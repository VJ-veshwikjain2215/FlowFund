"""Create source-only Embarko archives. No credentials or local state are included."""
import argparse
import io
import json
import pathlib
import tarfile
from urllib.parse import urlsplit

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "build" / "embarko"
EXCLUDED = {"node_modules", "dist", "target", "__pycache__", ".git", ".venv", "venv"}


def add_bytes(archive, name, data):
    info = tarfile.TarInfo(name)
    info.size = len(data)
    info.mode = 0o644
    archive.addfile(info, io.BytesIO(data))


def add_tree(archive, directory, prefix=""):
    for path in sorted(directory.rglob("*")):
        if not path.is_file() or path.is_symlink():
            continue
        rel = path.relative_to(directory)
        if any(part in EXCLUDED or part.startswith(".env") for part in rel.parts):
            continue
        add_bytes(archive, (pathlib.PurePosixPath(prefix) / rel.as_posix()).as_posix(), path.read_bytes())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--api-url", required=True, help="Public HTTPS backend API URL ending in /api")
    args = parser.parse_args()
    api = urlsplit(args.api_url)
    if (api.scheme != "https" or not api.hostname or api.username or api.password
            or api.query or api.fragment or api.path.rstrip("/") != "/api"):
        parser.error("--api-url must be an HTTPS origin followed by /api, without credentials or query")
    api_url = args.api_url.rstrip("/")
    OUTPUT.mkdir(parents=True, exist_ok=True)

    with tarfile.open(OUTPUT / "frontend.tar.gz", "w:gz") as archive:
        frontend = ROOT / "frontend"
        for name in ("package.json", "package-lock.json", "index.html", "vite.config.js"):
            add_bytes(archive, name, (frontend / name).read_bytes())
        add_tree(archive, frontend / "src", "src")
        for path in sorted((frontend / "public").rglob("*")):
            rel = path.relative_to(frontend / "public")
            if (path.is_file() and not path.is_symlink() and path.name != "flowfund-config.js"
                    and not any(part.startswith(".") or part in EXCLUDED for part in rel.parts)):
                add_bytes(archive, "public/" + rel.as_posix(), path.read_bytes())
        add_bytes(archive, "public/flowfund-config.js", ("window.FLOWFUND_API_BASE_URL = " + json.dumps(api_url) + ";\n").encode())

    with tarfile.open(OUTPUT / "backend.tar.gz", "w:gz") as archive:
        add_bytes(archive, "pom.xml", (ROOT / "backend" / "pom.xml").read_bytes())
        add_tree(archive, ROOT / "backend" / "src" / "main", "src/main")
        railpack = {"provider": "java", "deploy": {"startCommand": "java -Xmx128m -Xss512k -XX:+UseSerialGC -XX:MaxMetaspaceSize=96m -XX:ReservedCodeCacheSize=24m -XX:MaxDirectMemorySize=16m -jar target/flowfund-engine-0.0.1-SNAPSHOT.jar"}}
        add_bytes(archive, "railpack.json", json.dumps(railpack, indent=2).encode())

    with tarfile.open(OUTPUT / "ai-service.tar.gz", "w:gz") as archive:
        for name in ("main.py", "requirements.txt", "runtime.txt", ".python-version", "embarko.json"):
            add_bytes(archive, name, (ROOT / "ai-service" / name).read_bytes())
    print("Created frontend.tar.gz, backend.tar.gz and ai-service.tar.gz in", OUTPUT)


if __name__ == "__main__":
    main()

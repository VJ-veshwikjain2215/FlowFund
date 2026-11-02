import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/authService';
import api from '../services/api';

export default function Auth() {
  const [params] = useSearchParams();
  const signup = params.get('mode') === 'signup';
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuthStore();
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const callback = useRef(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token');
    if (token) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      callback.current = authService.getMe(token).then(user => ({ token, user }));
    }
    if (!callback.current) return;
    let active = true;
    setChecking(true);
    callback.current.then(({ token, user }) => {
      if (!active) return;
      useAuthStore.getState().logout();
      localStorage.setItem('token', token);
      useAuthStore.setState({ token, user });
      navigate(user.onboarded ? '/dashboard' : '/onboarding', { replace: true });
    }).catch(() => {
      if (active) {
        setError('We could not load your Google session. Please try again.');
        setChecking(false);
      }
    });
    return () => { active = false; };
  }, [navigate]);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const args = [form.get('email'), form.get('password')];
    const user = signup ? await register(form.get('name'), ...args) : await login(...args);
    if (user) navigate(user.onboarded ? '/dashboard' : '/onboarding', { replace: true });
    else setError(useAuthStore.getState().error);
  }
  const google = api.defaults.baseURL.replace(/\/api\/?$/, '') + '/oauth2/authorization/google';
  return <main className="paper account"><Link className="mast" to="/">FlowFund</Link>
    <section><small>ACCOUNT ACCESS</small><h1>{signup ? 'Open your ledger.' : 'Welcome back.'}</h1>
    {checking ? <p role="status">Opening your account…</p> : <>
    {(error || params.has('error')) && <p role="alert">{error || 'Google sign-in did not finish. Please try again.'}</p>}
    <a className="outline" href={google}>Continue with Google</a>
    <form onSubmit={submit} key={signup}><small>OR USE EMAIL</small>
    {signup && <label>Name<input name="name" autoComplete="name" required /></label>}
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label>Password<input name="password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} required /></label>
    <button className="ink-button" disabled={isLoading}>{signup ? 'Create account' : 'Sign in'} →</button>
    </form><Link className="under" onClick={() => setError('')} to={signup ? '/auth' : '/auth?mode=signup'}>{signup ? 'Already registered? Sign in' : 'New here? Create an account'}</Link></>}
    </section></main>;
}

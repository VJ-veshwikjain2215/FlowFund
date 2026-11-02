import logging
import os
from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from fastapi.responses import JSONResponse
import hmac
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import pandas as pd
import uvicorn
import io
import re

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="FlowFund AI Engine v6 - Universal CSV Loader")

@app.middleware("http")
async def require_service_key(request: Request, call_next):
    expected = os.environ.get("AI_SERVICE_SECRET", "")
    supplied = request.headers.get("X-Service-Key", "")
    if not expected or not hmac.compare_digest(expected, supplied):
        return JSONResponse(status_code=401, content={"detail": "Unauthorized"})
    return await call_next(request)

# --- UNIFIED DASHBOARD SCHEMA ---
class PredictionDetails(BaseModel):
    expected: float = 0.0
    min: float = 0.0
    max: float = 0.0

class DashboardResponse(BaseModel):
    has_data: bool = False
    safe_spend: Optional[float] = None
    emergency_buffer: Optional[float] = None 
    stability: Optional[str] = None
    volatility: Optional[float] = None 
    prediction: Optional[PredictionDetails] = None
    insights: List[str] = []
    tax_buffer: Optional[float] = None
    forecast_expense: Optional[float] = None
    reliability: Optional[int] = None
    forecast_series: List[float] = []
    data_points: int = 0


def clean_amt(val):
    if pd.isna(val): return 0.0
    s = str(val).replace(',','').replace(' ','').replace('₹','')
    try: return float(re.sub(r'[^-0-9.]', '', s))
    except: return 0.0

def calculate_volatility(data):
    if len(data) < 2: return 0.0
    mean = np.mean(data)
    if mean <= 0: return 0.0
    return float(np.std(data) / mean)

def get_prediction(series):
    """Rule-based monthly income prediction.
    
    Uses user's exact reference logic: weighted avg + capped trend + bounded volatility spread.
    Hard safety bounds prevent absurd values.
    """
    data_list = series.values.tolist() if isinstance(series, pd.Series) else list(series)
    n_total = len(data_list)
    
    if n_total == 0:
        return {"min": 0, "expected": 0, "max": 0}
    
    # Step 1: Adaptive window selection
    if n_total >= 12:
        months = data_list[-12:]
    elif n_total >= 6:
        months = data_list[-6:]
    else:
        months = list(data_list)
    
    n = len(months)
    
    if n == 0:
        return {"min": 0, "expected": 0, "max": 0}
    
    # < 3 months: conservative estimate
    if n < 3:
        avg = sum(months) / n
        low = avg * 0.95
        high = avg * 1.05
        expected = avg

        return {
            "min": float(round(max(0, low))),
            "expected": float(round(max(0, expected))),
            "max": float(round(max(0, high)))
        }
    
    # Step 2: Weighted average (recency-biased)
    weights = list(range(1, n + 1))
    weighted_avg = sum(m * w for m, w in zip(months, weights)) / sum(weights)
    
    # Step 3: Trend (capped at ±15% of weighted_avg)
    trend = months[-1] - months[-2]
    trend_cap = 0.15 * weighted_avg
    trend = max(-trend_cap, min(trend, trend_cap))
    
    # Step 4: Volatility
    volatility = max(months) - min(months)
    
    # Step 5: Base estimate
    base = weighted_avg + 0.25 * trend
    
    # Step 6: Spread (halved if high volatility)
    spread = 0.20 * volatility
    if weighted_avg > 0 and volatility > 0.60 * weighted_avg:
        spread *= 0.5

    
    low = base - spread
    high = base + spread
    
    # Step 7: Hard safety bounds
    min_month = min(months)
    max_month = max(months)
    
    if min_month > 0:
        low = max(low, 0.75 * min_month)
    high = min(high, 1.25 * max_month)
    low = max(low, 0)
    
    # Ensure low <= high
    if low > high:
        low, high = high, low
    
    # Minimum visible spread (5% of weighted_avg)
    min_spread = 0.05 * weighted_avg
    if (high - low) < min_spread:
        center = (high + low) / 2
        low = center - min_spread / 2
        high = center + min_spread / 2
    
    expected = (low + high) / 2.0
    
    low = max(0, low)
    high = max(0, high)
    expected = max(0, expected)




    
    return {
        "min": float(round(low)),
        "expected": float(round(expected)),
        "max": float(round(high))
    }

@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    logger.info("🚨 [SYNC] Initiating Universal Row Engine (v6)...")

    contents = await file.read(5 * 1024 * 1024 + 1)
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="CSV exceeds 5 MB")
    try: df = pd.read_csv(io.BytesIO(contents))
    except: raise HTTPException(status_code=400, detail="Invalid CSV format")
    if df.empty: raise HTTPException(status_code=400, detail="CSV is empty")
    if len(df) > 50000: raise HTTPException(status_code=400, detail="CSV has too many rows")
    
    df.columns = df.columns.str.lower().str.strip()
    valid_rows = []
    cols = df.columns.tolist()
    
    # Match complete normalized headers. Substring matches such as "cr" in
    # "description" can silently misclassify transactions.
    def normalized(value):
        return re.sub(r'[^a-z0-9]+', ' ', str(value).lower()).strip()
    normalized_cols = {normalized(col): col for col in cols}
    def get_col(candidates):
        return next((normalized_cols[normalized(name)] for name in candidates
                     if normalized(name) in normalized_cols), None)

    c_amt = get_col(['amount', 'transaction amount', 'txn amount', 'value'])
    c_cr = get_col(['credit', 'credit amount', 'deposit', 'deposit amount', 'cr', 'cr amt', 'inflow', 'income'])
    c_dr = get_col(['debit', 'debit amount', 'withdrawal', 'withdrawal amount', 'dr', 'dr amt', 'outflow', 'expense'])
    c_type = get_col(['type', 'transaction type', 'txn type', 'cr/dr', 'trans_type'])
    c_desc = get_col(['description', 'remarks', 'narration', 'memo', 'details', 'particulars'])
    c_date = get_col(['date', 'txn_date', 'transaction date'])
    if not c_date or not (c_amt or c_cr or c_dr):
        raise HTTPException(status_code=400, detail="CSV needs a date and amount or credit/debit columns")
    if c_amt and not c_type and not (c_cr or c_dr):
        amounts = [clean_amt(value) for value in df[c_amt] if pd.notna(value)]
        if not any(value < 0 for value in amounts):
            raise HTTPException(status_code=400, detail="Add a transaction type or credit/debit columns to distinguish expenses")

    for idx, row in df.iterrows():
        desc = str(row[c_desc]) if c_desc and pd.notna(row[c_desc]) else ""
        if any(sk in desc.lower() for sk in ["self transfer", "internal transfer"]): continue
        
        amt, p_type = 0.0, None
        
        # 1. Check Cr/Dr Separate Columns (Highest Priority)
        if c_cr and c_dr:
            cr = clean_amt(row[c_cr])
            dr = clean_amt(row[c_dr])
            if cr > 0: amt, p_type = cr, 'INCOME'
            elif dr > 0: amt, p_type = dr, 'EXPENSE'

        # 2. Check Single Amount Column + Type Column
        if amt == 0 and c_amt and pd.notna(row[c_amt]):
            v = clean_amt(row[c_amt])
            amt = abs(v)
            if v > 0: p_type = 'INCOME'
            elif v < 0: p_type = 'EXPENSE'
            
            if c_type:
                label = normalized(row[c_type]) if pd.notna(row[c_type]) else ''
                if label in {'cr', 'credit', 'income', 'deposit', 'receipt', 'inflow'}:
                    p_type = 'INCOME'
                elif label in {'dr', 'debit', 'expense', 'withdrawal', 'payment', 'outflow'}:
                    p_type = 'EXPENSE'
                elif amt:
                    raise HTTPException(status_code=400, detail="Unrecognized transaction type")

        # 3. Last Resort (Amount Only with Type Detection)
        if amt == 0 and (c_cr or c_dr):
            if c_cr and pd.notna(row[c_cr]): 
                v = clean_amt(row[c_cr])
                if v > 0: amt, p_type = v, 'INCOME'
            if amt == 0 and c_dr and pd.notna(row[c_dr]):
                v = clean_amt(row[c_dr])
                if v > 0: amt, p_type = v, 'EXPENSE'

        if amt > 0 and p_type:
            valid_rows.append({
                "date": str(row[c_date]) if c_date and pd.notna(row[c_date]) else "",
                "amount": float(amt),
                "type": p_type,
                "description": desc
            })

    if not valid_rows:
        logger.warning("⚠️ [SYNC] Blocked: No identifiable money flow found.")
        raise HTTPException(status_code=400, detail="No recognizable transactions")

    df_v = pd.DataFrame(valid_rows)
    # Smart date parsing: try ISO first, fall back to dayfirst
    df_v['date'] = pd.to_datetime(df_v['date'], errors='coerce')
    failed = df_v['date'].isna().sum()
    if failed > len(df_v) * 0.3:
        # Many failures with default parsing — retry with dayfirst=True
        df_v['date'] = pd.to_datetime(pd.DataFrame(valid_rows)['date'], errors='coerce', dayfirst=True)

    if df_v['date'].isna().any():
        raise HTTPException(status_code=400, detail="All transactions need a valid date")
    periods = df_v['date'].dt.to_period('M')
    months = pd.period_range(periods.min(), periods.max(), freq='M')
    if len(months) > 1200:
        raise HTTPException(status_code=400, detail="Date range is too large")
    def monthly(kind):
        rows = df_v[df_v['type'] == kind]
        return rows.groupby(rows['date'].dt.to_period('M'))['amount'].sum().reindex(months, fill_value=0).tolist()
    mi, me = monthly('INCOME'), monthly('EXPENSE')

    # Diagnostic logging



    # Forecast and estimated monthly surplus are based on monthly activity.
    # 2. FIX: "Next Month Prediction" logic (only from monthly credit totals)
    pred = get_prediction(mi)

    # Calculate other dashboard values based on decoupled logic
    ame = np.mean(me) if me else 0.0
    vol = calculate_volatility(mi)
    tax = pred["expected"] * 0.15 # Illustrative estimate, not a tax calculation
    safe = max(0.0, pred["expected"] - ame - tax)
    
    # Diagnostic logging (as requested)

    dashboard = {
        "has_data": True,
        "safe_spend": round(safe, 2),
        "emergency_buffer": 0,
        "stability": "Stable" if vol < 0.2 else "Moderate" if vol < 0.5 else "Volatile",
        "volatility": round(vol * 100, 1),
        "prediction": pred,
        "insights": [
             f"Total Monthly Income: ₹{round(sum(mi)/max(1, len(mi))):,}",
             f"Total Monthly Expense: ₹{round(sum(me)/max(1, len(me))):,}",
             f"Estimated monthly surplus: ₹{round(safe):,} / month"
        ],
        "tax_buffer": round(tax, 2),
        "forecast_expense": round(ame, 2),
        "reliability": int((1 - min(vol, 1.0)) * min(len(mi) / 12, 1) * 100),
        "forecast_series": [round(x, 2) for x in mi],
        "data_points": len(valid_rows),
        "model_used": "Rule-Based Estimate"
    }
    
    return {"dashboard": dashboard, "transactions": valid_rows}

class VacationRequest(BaseModel):
    totalBalance: float
    expenses: List[dict]
    selectedWeeks: int
    predictedIncome: float = 0.0

@app.post("/vacation-planner")
async def vacation_planner(req: VacationRequest):
    """🧠 [ENGINE] Redesigned Decision Engine for Vacation Runway."""
    monthly_expense = sum(float(e.get('amount', 0)) for e in req.expenses)
    weekly_expense = monthly_expense / 4.0 if monthly_expense > 0 else 0
    vacation_cost = weekly_expense * req.selectedWeeks
    
    if monthly_expense <= 0 or req.totalBalance <= 0:
        return { "status": "insufficient", "message": "INSUFFICIENT DATA: Please update your expenses." }
    
    # 1. Core Variables
    monthly_surplus = req.predictedIncome - monthly_expense
    remaining_bal = req.totalBalance - vacation_cost
    new_buffer = remaining_bal / monthly_expense if monthly_expense > 0 else 10
    recovery_time = vacation_cost / monthly_surplus if monthly_surplus > 0 else 999
    
    # 2. Decision logic
    status = "risky"
    message = ""
    
    if monthly_surplus <= 0 or new_buffer < 1.5 or recovery_time > 6 or vacation_cost > req.totalBalance:
        status = "dangerous"
        message = f"NOT RECOMMENDED: This spend is critical. Buffer: {new_buffer:.1f}mo. Recovery: {'Infinite' if monthly_surplus <= 0 else f'{recovery_time:.1f}mo'}."
    elif new_buffer >= 4 and recovery_time <= 1:
        status = "safe"
        message = f"YOU ARE SAFE: Position remains strong with {new_buffer:.1f}mo buffer and fast recovery ({recovery_time:.1f}mo)."
    elif new_buffer >= 2.5 or recovery_time <= 3:
        status = "moderate"
        message = f"MANAGEABLE: Acceptable spend. Buffer: {new_buffer:.1f}mo. Recovery: {recovery_time:.1f}mo."
    else:
        status = "risky"
        message = f"RISKY: Caution advised. Your buffer drops to {new_buffer:.1f}mo and recovery will take {recovery_time:.1f}mo."

    max_weeks = int(req.totalBalance / weekly_expense) if weekly_expense > 0 else 0
    
    return {
        "status": status,
        "message": message,
        "vacationCost": vacation_cost,
        "remainingBalance": remaining_bal,
        "maxWeeks": max_weeks,
        "survivalWeeks": max_weeks,
        "insight": "⚠️ Priority: Rebuilding buffer." if status in ["dangerous", "risky"] else "✅ Runway supports this break.",
        "suggestion": {
            "reduceMonthlyBy": round(monthly_expense * 0.1, 2),
            "gainWeeks": 1,
            "weeksToSaveMore": int(weekly_expense / max(monthly_surplus, 1)) if monthly_surplus > 0 else 10
        }
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5005))
    uvicorn.run(app, host="0.0.0.0", port=port)

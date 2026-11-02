-- Supabase SQL Schema for RupeeRakshak (FlowFund)
-- Execute this in the Supabase SQL Editor

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    provider VARCHAR(50),
    rent DECIMAL(19, 2) DEFAULT 0,
    groceries DECIMAL(19, 2) DEFAULT 0,
    utilities DECIMAL(19, 2) DEFAULT 0,
    internet DECIMAL(19, 2) DEFAULT 0,
    transport DECIMAL(19, 2) DEFAULT 0,
    monthly_debt DECIMAL(19, 2) DEFAULT 0,
    inflation_rate DECIMAL(19, 4) DEFAULT 0.06,
    profession VARCHAR(255),
    income_type VARCHAR(255),
    base_income DECIMAL(19, 2) DEFAULT 0,
    age INTEGER DEFAULT 25,
    dependents INTEGER DEFAULT 0,
    tax_regime VARCHAR(50) DEFAULT 'NEW',
    income_concentration DOUBLE PRECISION DEFAULT 0.5,
    onboarded BOOLEAN DEFAULT FALSE,
    role VARCHAR(50) DEFAULT 'USER'
);

-- 2. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    date DATE,
    description VARCHAR(255),
    amount DECIMAL(19, 2),
    type VARCHAR(50), -- INCOME / EXPENSE
    is_taxable BOOLEAN DEFAULT FALSE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Buffers Table
CREATE TABLE IF NOT EXISTS buffers (
    id BIGSERIAL PRIMARY KEY,
    tax_buffer DECIMAL(19, 2) DEFAULT 0,
    medical_buffer DECIMAL(19, 2) DEFAULT 0,
    emergency_buffer DECIMAL(19, 2) DEFAULT 0,
    safe_to_spend DECIMAL(19, 2) DEFAULT 0,
    total_emergency_fund DECIMAL(19, 2) DEFAULT 0,
    total_medical_fund DECIMAL(19, 2) DEFAULT 0,
    total_tax_saved DECIMAL(19, 2) DEFAULT 0,
    risk_level VARCHAR(50) DEFAULT 'STABLE',
    is_unstable BOOLEAN DEFAULT FALSE,
    is_deficit BOOLEAN DEFAULT FALSE,
    runway_completed BOOLEAN DEFAULT FALSE,
    volatility DECIMAL(19, 4) DEFAULT 0,
    score DOUBLE PRECISION DEFAULT 0.0,
    forecast DECIMAL(19, 2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Buffer Forecast Series (Element Collection)
CREATE TABLE IF NOT EXISTS buffer_forecast_series (
    buffer_id BIGINT NOT NULL REFERENCES buffers(id) ON DELETE CASCADE,
    forecast_amount DECIMAL(19, 2)
);

-- 5. Buffer Insights (Element Collection)
CREATE TABLE IF NOT EXISTS buffer_insights (
    buffer_id BIGINT NOT NULL REFERENCES buffers(id) ON DELETE CASCADE,
    insight_text VARCHAR(1000)
);

-- 6. Tax Records Table
CREATE TABLE IF NOT EXISTS tax_records (
    id BIGSERIAL PRIMARY KEY,
    annual_income DECIMAL(19, 2),
    annual_tax DECIMAL(19, 2),
    saved_tax DECIMAL(19, 2),
    monthly_buffer DECIMAL(19, 2),
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

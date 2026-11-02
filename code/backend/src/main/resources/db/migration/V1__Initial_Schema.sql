-- V1__Initial_Schema.sql
-- Initial Schema for FlowFund

CREATE TABLE users (
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

CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    date DATE,
    description VARCHAR(255),
    amount DECIMAL(19, 2),
    type VARCHAR(50),
    is_taxable BOOLEAN,
    user_id BIGINT REFERENCES users(id)
);

CREATE TABLE tax_records (
    id BIGSERIAL PRIMARY KEY,
    annual_income DECIMAL(19, 2),
    annual_tax DECIMAL(19, 2),
    saved_tax DECIMAL(19, 2),
    monthly_buffer DECIMAL(19, 2),
    user_id BIGINT UNIQUE REFERENCES users(id)
);

CREATE TABLE buffers (
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
    volatility DECIMAL(19, 4),
    score DOUBLE PRECISION,
    forecast DECIMAL(19, 2),
    last_updated TIMESTAMP,
    user_id BIGINT UNIQUE REFERENCES users(id)
);

CREATE TABLE buffer_forecast_series (
    buffer_id BIGINT NOT NULL REFERENCES buffers(id),
    forecast_amount DECIMAL(19, 2)
);

CREATE TABLE buffer_insights (
    buffer_id BIGINT NOT NULL REFERENCES buffers(id),
    insight_text VARCHAR(1000)
);

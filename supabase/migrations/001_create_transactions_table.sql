-- Create transactions table for logging all user transactions
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  transaction_code VARCHAR(50),
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(email);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Create debit_alerts table for tracking sent alerts
CREATE TABLE IF NOT EXISTS debit_alerts (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  transaction_code VARCHAR(50),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster queries
CREATE INDEX IF NOT EXISTS idx_debit_alerts_email ON debit_alerts(email);
CREATE INDEX IF NOT EXISTS idx_debit_alerts_sent_at ON debit_alerts(sent_at DESC);

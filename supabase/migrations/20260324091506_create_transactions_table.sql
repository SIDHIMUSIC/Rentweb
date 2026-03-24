/*
  # Create Transactions Table for Payment Tracking

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key) - Unique transaction ID
      - `payment_id` (text) - MongoDB Payment ID reference
      - `tenant_name` (text) - Tenant name for reference
      - `room_number` (text) - Room number
      - `amount` (numeric) - Payment amount
      - `payment_mode` (text) - UPI, Card, NetBanking
      - `transaction_id` (text) - Gateway transaction ID
      - `razorpay_order_id` (text) - Razorpay order ID
      - `razorpay_payment_id` (text) - Razorpay payment ID
      - `razorpay_signature` (text) - Razorpay signature for verification
      - `status` (text) - pending, success, failed
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on transactions table
    - Add policy for authenticated admin users to manage transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id text NOT NULL,
  tenant_name text NOT NULL,
  room_number text NOT NULL,
  amount numeric NOT NULL,
  payment_mode text NOT NULL,
  transaction_id text,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
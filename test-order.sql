-- Create a test order for the current user
INSERT INTO orders (
  user_id,
  customer_email,
  customer_name,
  customer_phone,
  total,
  status,
  payment_status,
  stripe_session_id,
  created_at,
  updated_at
) VALUES (
  'user_3BAWl1Nle0eGAtblJQzPKvVSHhG',
  'koukouloukil@gmail.com',
  'BigBonny Test',
  '+33612345678',
  29.99,
  'pending',
  'paid',
  'test_session_' || random()::text,
  NOW(),
  NOW()
);

-- Create a test order for the current user
INSERT INTO orders (
  user_id,
  total,
  status,
  street,
  city,
  postal_code,
  country,
  stripe_payment_intent_id,
  created_at,
  updated_at
) VALUES (
  'user_3BAWl1Nle0eGAtblJQzPKvVSHhG',
  29.99,
  'pending',
  '123 Test Street',
  'Paris',
  '75001',
  'France',
  'test_session_' || random()::text,
  NOW(),
  NOW()
);

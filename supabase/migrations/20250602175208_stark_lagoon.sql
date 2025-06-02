/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - name (text)
      - phone (text, optional)
      - is_host (boolean)
      - created_at (timestamp)
      
    - parking_slots
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - address (text)
      - latitude (float8)
      - longitude (float8)
      - width (float8)
      - length (float8)
      - price_per_hour (float8)
      - available_from (timestamp)
      - available_to (timestamp)
      - image_url (text)
      - host_id (uuid, references users)
      - amenities (text[])
      - rating (float8)
      - review_count (int)
      - created_at (timestamp)
      
    - bookings
      - id (uuid, primary key)
      - parking_slot_id (uuid, references parking_slots)
      - user_id (uuid, references users)
      - start_time (timestamp)
      - end_time (timestamp)
      - total_price (float8)
      - status (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  is_host boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create parking_slots table
CREATE TABLE IF NOT EXISTS parking_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  latitude float8 NOT NULL,
  longitude float8 NOT NULL,
  width float8 NOT NULL,
  length float8 NOT NULL,
  price_per_hour float8 NOT NULL,
  available_from timestamptz NOT NULL,
  available_to timestamptz NOT NULL,
  image_url text NOT NULL,
  host_id uuid REFERENCES users(id) NOT NULL,
  amenities text[] DEFAULT '{}',
  rating float8 DEFAULT 0,
  review_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parking_slot_id uuid REFERENCES parking_slots(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  total_price float8 NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policies for parking_slots table
CREATE POLICY "Anyone can read parking slots"
  ON parking_slots
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Hosts can create parking slots"
  ON parking_slots
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND is_host = true
    )
  );

CREATE POLICY "Hosts can update own parking slots"
  ON parking_slots
  FOR UPDATE
  TO authenticated
  USING (host_id = auth.uid())
  WITH CHECK (host_id = auth.uid());

-- Policies for bookings table
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
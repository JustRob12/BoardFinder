-- BoardFinder Database Schema (PostgreSQL/Supabase)

-- Users table to store profile information
-- Note: id is synced with Supabase Auth auth.users.id
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'renter' CHECK (role IN ('renter', 'landlord')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Boarding houses table for listings
CREATE TABLE IF NOT EXISTS boarding_houses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    location TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- New table for multiple photos
CREATE TABLE IF NOT EXISTS boarding_house_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boarding_house_id UUID REFERENCES boarding_houses(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for user profile information (contact details)
CREATE TABLE IF NOT EXISTS profile_information (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    phone_number TEXT,
    facebook_name TEXT,
    bio TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3)),
    post_limit INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'paid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SUPABASE TRIGGER (Run this in Supabase SQL Editor)
-- This function automatically creates a profile when a user signs up via Supabase Auth
/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, username, email, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'name', 
    COALESCE(new.raw_user_meta_data->>'username', new.email),
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'renter')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
*/

-- Fix the date column to allow NULL values for TBD seminars
ALTER TABLE public.seminars ALTER COLUMN date DROP NOT NULL;
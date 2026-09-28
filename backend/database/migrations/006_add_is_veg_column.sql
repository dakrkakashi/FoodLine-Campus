-- Migration 006: Add is_veg column to menu_items table
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS is_veg BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE menu_items SET is_veg = TRUE WHERE is_veg IS NULL;

ALTER TABLE menu_items ALTER COLUMN is_veg SET DEFAULT TRUE;

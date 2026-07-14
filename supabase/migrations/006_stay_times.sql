-- Přidání času příjezdu a odjezdu k pobytům

ALTER TABLE stays
  ADD COLUMN IF NOT EXISTS time_from time,
  ADD COLUMN IF NOT EXISTS time_to   time;

-- Platební systém a fakturační údaje

-- Rozšíření tabulky settings o fakturační údaje
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS issuer_name        text,
  ADD COLUMN IF NOT EXISTS issuer_address     text,
  ADD COLUMN IF NOT EXISTS issuer_ico         text,
  ADD COLUMN IF NOT EXISTS issuer_dic         text,
  ADD COLUMN IF NOT EXISTS bank_account       text,
  ADD COLUMN IF NOT EXISTS bank_iban          text,
  ADD COLUMN IF NOT EXISTS bank_name          text,
  ADD COLUMN IF NOT EXISTS default_rate_czk   numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS invoice_counter    integer DEFAULT 0;

-- Tabulka plateb
CREATE TABLE IF NOT EXISTS payments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_id         uuid NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
  type            text NOT NULL CHECK (type IN ('deposit', 'final')),
  amount          numeric(10,2) NOT NULL,
  paid_at         date,
  invoice_number  text,
  notes           text,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_stay_id_idx ON payments(stay_id);

-- Atomické generování čísla faktury
CREATE OR REPLACE FUNCTION increment_invoice_counter()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_counter integer;
BEGIN
  UPDATE settings
  SET invoice_counter = invoice_counter + 1
  WHERE id = (SELECT id FROM settings LIMIT 1)
  RETURNING invoice_counter INTO new_counter;
  RETURN to_char(now(), 'YYYY') || lpad(new_counter::text, 3, '0');
END;
$$;

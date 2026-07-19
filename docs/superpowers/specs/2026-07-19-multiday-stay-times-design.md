# Čas přivedení a vyzvednutí psa u vícedenních pobytů

## Kontext

Aplikace DogoTeka eviduje pobyty psů ("termíny") s rozsahem dat (`date_from`, `date_to`). Poslední funkce ("partial-day stay support", commit `ea68938`) přidala možnost zadat čas přivedení a vyzvednutí (`time_from`, `time_to`), ale **pouze pro jednodenní pobyty** (`date_from === date_to`) — formulář, validace i zobrazení jsou na tuto podmínku natvrdo navázané.

Potřeba: u vícedenních pobytů (např. přivedení 9:00 první den, vyzvednutí 17:00 poslední den) dnes není možné čas zadat vůbec. Cílem této změny je rozšířit stávající mechanismus `time_from`/`time_to` tak, aby fungoval nezávisle na délce pobytu, při zachování nepovinnosti a bez dopadu na cenu.

## Sémantika

- `time_from` = čas přivedení psa v den `date_from`.
- `time_to` = čas vyzvednutí psa v den `date_to`.
- Platí pro libovolný rozsah dat (jednodenní i vícedenní pobyt) — žádná změna DB schématu není potřeba, sloupce `stays.time_from` a `stays.time_to` už existují a jsou nullable (migrace `006_stay_times.sql`).

## Validace (`src/schemas/stay.schema.ts`)

- Odstranit `.refine()`, které dnes vyžaduje vyplnění `time_from`/`time_to` jen když `date_from === date_to`.
- Časy zůstávají **vždy volitelné**, bez ohledu na délku pobytu.
- Nové pravidlo konzistence: pokud je vyplněn jeden z časů, musí být vyplněný i druhý (oba prázdné, nebo oba vyplněné — ne napůl).
- Kontrola `time_from < time_to` platí **jen pro jednodenní pobyt** (`date_from === date_to`). U vícedenního pobytu se tato kontrola nevynucuje — jde o časy ve dvou různých dnech, takže přímé porovnání hodinami nedává smysl.

## Formulář (`src/components/stays/StayForm.tsx`)

- Odstranit podmínku `isSameDay`, která dnes skrývá pole "Čas přivedení" / "Čas vyzvednutí" u vícedenních pobytů (aktuálně řádky 38, 74–89).
- Pole se zobrazují vždy, nezávisle na `date_from`/`date_to`, a zůstávají vizuálně nepovinná (bez `*`).

## Zobrazení (`formatStayRange()` v `src/lib/utils.ts`)

- Dnes: čas se připojí k formátovanému rozsahu jen když `isSameDay`.
- Nově: čas se připojí, kdykoliv jsou `time_from` i `time_to` vyplněné — např. `12.7. 9:00 – 14.7. 17:00`. Bez vyplněných časů zůstává formát beze změny: `12.7. – 14.7.`.
- Protože jde o centrální formátovací funkci, detail termínu, seznam pobytů (`src/routes/stays/index.tsx`, `src/routes/index.tsx`), `StayPaymentRow.tsx` a `NoteTimeline.tsx` zdědí novou logiku automaticky bez dalších úprav.

## Faktura (`src/components/pdf/InvoicePDF.tsx`)

- Rozšířit dnešní zobrazení "Částečný den (HH:MM–HH:MM)" tak, aby platilo i pro vícedenní pobyty se zadaným časem, ve stejném formátu jako v `formatStayRange()`.

## Mimo scope

- **Kalendář** (`src/hooks/useCalendarEvents.ts`) — dotaz dnes nenačítá `time_from`/`time_to` ani pro jednodenní pobyty, takže zůstává beze změny. Konzistentní s požadavkem "stejně jako dnes, jen rozšířené na vícedenní".
- **Cena** (`src/components/stays/PaymentPanel.tsx`) — beze změny. Cena se počítá čistě z počtu nocí (`date_from`/`date_to`); čas je čistě informativní údaj pro logistiku, do výpočtu nevstupuje.
- **DB migrace** — není potřeba, sloupce `time_from`/`time_to` už existují.

## Testování / ověření

- **Nepovinnost**: vytvoření vícedenního pobytu bez `time_from`/`time_to` projde validací, uloží se `NULL`, cena i zobrazení fungují stejně jako dnes.
- **Pár hodnot**: vyplnění jen jednoho z časů (bez druhého) vyhodí validační chybu.
- **Same-day ordering**: `time_from < time_to` se vynucuje jen když `date_from === date_to`; u vícedenního pobytu projde i kombinace, kdy je `time_from` "později" než `time_to` (jde o různé dny).
- **Manuální ověření v UI**: vytvořit vícedenní termín s časy i bez nich, zkontrolovat zobrazení v detailu termínu, seznamu pobytů a na PDF faktuře; ověřit, že cena v `PaymentPanel` zůstává stejná bez ohledu na vyplnění časů.

/*
# Add active scholarship visibility rules

1. Modified Table: `scholarships`
- Add `currently_open_verified` to record whether an official source confirms an opportunity is currently open when no deadline is confirmed.
- Add `next_application_open_date` and `next_application_deadline` for a future application round when the official source confirms that round.
- Add `next_round_verified` so future-round dates cannot make a record public unless they are verified.
- Add `deadline_timezone` for future records whose official source provides a timezone. Existing date-only deadlines remain inclusive through the end of the stored calendar date.

2. New Database Function
- Add `get_active_scholarships()` as the single public catalogue query.
- A record is returned only when it has a current or future confirmed deadline, a verified currently-open flag with no deadline, or a verified future application round that is currently open.
- Records are never deleted; expired records remain available for administrative review and private saved-scholarship history.

3. Security
- The function runs as the invoker and uses the existing public SELECT policy on `scholarships`.
- Execute access is granted to `anon` and `authenticated` so the public catalogue can use it.

4. Important Notes
- No existing scholarship data is deleted or rewritten.
- Existing rows default to unverified open-state and no future round, so their past deadlines are excluded from active discovery until verified data is added.
*/

ALTER TABLE scholarships
  ADD COLUMN IF NOT EXISTS currently_open_verified boolean NOT NULL DEFAULT false;

ALTER TABLE scholarships
  ADD COLUMN IF NOT EXISTS next_application_open_date date;

ALTER TABLE scholarships
  ADD COLUMN IF NOT EXISTS next_application_deadline date;

ALTER TABLE scholarships
  ADD COLUMN IF NOT EXISTS next_round_verified boolean NOT NULL DEFAULT false;

ALTER TABLE scholarships
  ADD COLUMN IF NOT EXISTS deadline_timezone text;

CREATE OR REPLACE FUNCTION get_active_scholarships()
RETURNS SETOF scholarships
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT s.*
  FROM public.scholarships AS s
  WHERE s.status IS DISTINCT FROM 'closed'
    AND (
      (s.application_deadline IS NOT NULL AND s.application_deadline >= CURRENT_DATE)
      OR (
        s.application_deadline IS NULL
        AND s.currently_open_verified = true
      )
      OR (
        s.next_round_verified = true
        AND s.next_application_open_date IS NOT NULL
        AND s.next_application_deadline IS NOT NULL
        AND s.next_application_open_date <= CURRENT_DATE
        AND s.next_application_deadline >= CURRENT_DATE
      )
    )
  ORDER BY s.application_deadline NULLS LAST, s.last_verified_at DESC NULLS LAST;
$$;

GRANT EXECUTE ON FUNCTION get_active_scholarships() TO anon, authenticated;

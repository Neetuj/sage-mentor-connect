
-- Create seminar_schedule_items table
CREATE TABLE public.seminar_schedule_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminar_id uuid NOT NULL REFERENCES public.seminars(id) ON DELETE CASCADE,
  time_slot text NOT NULL,
  event_title text NOT NULL,
  event_description text,
  speaker text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seminar_schedule_items ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view schedule items"
  ON public.seminar_schedule_items
  FOR SELECT
  USING (true);

-- Admin write
CREATE POLICY "Only admins can manage schedule items"
  ON public.seminar_schedule_items
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Updated_at trigger
CREATE TRIGGER update_seminar_schedule_items_updated_at
  BEFORE UPDATE ON public.seminar_schedule_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

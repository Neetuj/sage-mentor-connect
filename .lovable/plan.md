

## Plan: Conference Schedule Feature

### Overview
Add a day-of schedule/agenda table to each seminar, editable from the admin panel, and accessible via a "View Schedule" button on seminar cards.

### Database Changes
1. **Create `seminar_schedule_items` table** with columns: `id`, `seminar_id` (FK to seminars), `time_slot` (text, e.g. "9:00 AM - 9:30 AM"), `event_title` (text), `event_description` (text, nullable), `speaker` (text, nullable), `display_order` (int), `created_at`, `updated_at`. RLS: public SELECT, admin-only write.

### Frontend Changes

2. **Create `ScheduleDialog` component** — a dialog triggered from the seminar card showing a clean table of the day's schedule items (time, event, speaker/description). Fetches from `seminar_schedule_items` filtered by `seminar_id`.

3. **Update `SeminarCalendar.tsx`** — add a "View Schedule" button on each seminar card that opens the `ScheduleDialog`. Only show the button if schedule items exist for that seminar.

4. **Create `ScheduleItemForm` component** — admin form to add/edit schedule items for a selected seminar. Fields: time slot, event title, description, speaker, display order.

5. **Create `ScheduleItemManagement` component** — lists schedule items for a seminar with edit/delete controls, reorderable by display_order.

6. **Create `AdminSchedule` page** — new admin page at `/admin/schedule` combining the form and management components, with a seminar selector dropdown to pick which seminar's schedule to edit.

7. **Update admin routing** — add `/admin/schedule` route to `Admin.tsx` and sidebar nav item in `AdminSidebar.tsx`.

### Technical Details
- The `seminar_schedule_items` table uses a foreign key to `seminars(id)` with `ON DELETE CASCADE`.
- Schedule items ordered by `display_order` then `time_slot`.
- The types file will auto-update after migration.


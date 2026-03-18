

## Plan: Remove Hannah Shin from Website

### Changes to `src/components/About.tsx`

1. **Remove Hannah's import**: Delete `import hannahProfile from "@/assets/hannah-profile.jpg";`

2. **Remove Hannah from founders array**: Delete the Hannah Shin object (lines 31-36)

3. **Update text references**:
   - Line 50: "three high school students" → "two high school students"
   - Line 90: "Three passionate high school students" → "Two passionate high school students"

4. **Simplify profile image logic**: Remove the `Hannah Shin` branch from the ternary (lines 115-116)

5. **Center the two remaining cards**: Change `grid md:grid-cols-3` → `grid md:grid-cols-2 max-w-3xl mx-auto` so Isabel and Rohan are centered

6. **Optionally delete** `src/assets/hannah-profile.jpg` (no longer referenced)


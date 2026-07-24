# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Ritualo product/architecture decisions (do not re-litigate)

- **No manual Parent/Kid toggle.** Mode is derived from `activeMember.role` on
  the signed-in device (`app/(app)/_layout.tsx`), not a switch in the UI.
  Each family member's own device shows their own mode automatically — this
  is intentional, matches real multi-device family usage, and should stay
  this way even though an earlier design prototype showed a manual toggle.
- **Auth is a single combined screen** (`app/(auth)/index.tsx`), not separate
  sign-up/sign-in screens. It has a Log In / Sign Up segmented control, and
  in Sign Up mode asks for "Family name" (stored as `AuthUser.name`), Email,
  Password, one "Continue" button. Family/forest creation itself still
  happens as a separate step in `app/(setup)/create.tsx`, which prefills its
  "Forest name" field from `authUser.name` to avoid asking twice.
- **Habit Setup runs as a multi-member wizard** (`app/(setup)/habits.tsx`)
  when following the create/join-family flow — "Member X of N", "Next:
  <name>" — cycling through every member missing habits in one sitting.
  When opened from Profile → "Add a ritual" it takes a `memberId` param and
  runs single-member mode instead.
- **Per-habit streaks and growth-type stats** (mushroom/firefly/tree/
  creature counts) live in `AppStateContext` (`streakFor`, `growthCounts`)
  and are surfaced on the Parent Home screen.
- State is local only (AsyncStorage-backed `AppStateContext`), structured so
  a real backend (e.g. Supabase) can be swapped in later without changing
  screen code — screens only call context methods, never touch storage
  directly.

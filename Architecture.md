# Architecture

Ritualo is an Expo Router app (SDK 54) with no backend: everything lives in a
single AsyncStorage-backed React context, structured so a real backend (e.g.
Supabase) can be swapped in later without touching screen code.

## Tech stack

- **Expo SDK 54**, React Native 0.81, React 19
- **expo-router 6** (file-based routing, typed via `app/`)
- **AsyncStorage** for all persistence — no network calls, no backend
- **react-native-reanimated** for micro-animations (check-in celebration, fireflies)
- Custom theming (`src/theme`) — no UI kit

## State: `AppStateContext`

`src/context/AppStateContext.tsx` is the single source of truth. It loads one
JSON blob from AsyncStorage (`ritualo:v1`) on mount, exposes it plus derived
values through `useAppState()`, and persists on every mutation
(`persist()` = `setState` + fire-and-forget `AsyncStorage.setItem`).

Persisted shape:

```ts
{
  authUser: AuthUser | null;      // { email, name } — fake local auth, no real login
  family: Family | null;          // { id, forestName, inviteCode }
  members: Member[];              // { id, name, role: 'parent' | 'kid', emoji }
  habits: Habit[];                // { id, memberId, label, emoji, growthLabel, growthType, stars }
  completions: Completion[];      // { id, habitId, memberId, completedAt, reactions }
  activeMemberId: string | null;  // which family member this device is signed in as
}
```

Derived values the context computes on top of that (not persisted):
`isAuthenticated`, `hasFamily`, `activeMember`, `forest` (growth stage from
total completions), `streakFor(habitId)`, `growthCounts()` (mushroom/
firefly/tree/creature tallies), `weeklyStats()`, `membersMissingHabits()`.

Screens never touch `AsyncStorage` directly — only `useAppState()` methods
(`signUp`, `createFamily`, `addHabit`, `completeHabit`, etc.). This is the
seam a real backend would slot into.

## Mode: parent vs. kid

There is **no manual Parent/Kid toggle** in the UI. Mode is derived from
`activeMember.role` on the signed-in device (`app/(app)/_layout.tsx`) and
provided via `ModeProvider`/`useColors()` (`src/theme/ThemeContext.tsx`),
which picks a color palette per mode (`src/theme/tokens.ts`). Each family
member's own device shows their own mode automatically, matching real
multi-device family usage — a parent's phone and a kid's phone/tablet are
different `activeMember`s in the same shared `family`.

## Routing (`app/`)

Expo Router's file-based routing, with one important gotcha this codebase
has already been bitten by: **parenthesized group folders don't add a URL
segment**, so a group's own `index.tsx` resolves to the same path as its
parent's `index.tsx`. Only one file may ever own a given path — see the
`(auth)/auth.tsx` / `(setup)/choose.tsx` naming below, chosen specifically
to avoid colliding with `app/index.tsx`.

```
app/
  index.tsx            Gate — redirects based on auth/family/active-member state
  onboarding.tsx        "Grow together" splash → (auth)/auth
  checkin/[habitId].tsx Check-in bottom sheet (transparentModal), redirects to
                         '/' if the habit isn't found once loading settles
  (auth)/
    auth.tsx            Combined Log In / Sign Up screen (segmented control)
  (setup)/
    choose.tsx           "Start a Forest" vs "Have an invite code?"
    create.tsx           Create family — forest name prefilled from authUser.name
    join.tsx              Join family by invite code
    invite.tsx             Show invite code after creating
    who-is-this.tsx         Pick which family member this device is
    habits.tsx               Multi-member habit-setup wizard (or single-member
                              via ?memberId= from Profile → "Add a ritual")
  (app)/                 Tab navigator (only reachable once authenticated,
                          has a family, and has an active member)
    home.tsx              Parent or Kid home (src/screens/HomeParent|Kid.tsx)
    feed.tsx               Family activity feed
    recap.tsx                Weekly recap / stats
    profile.tsx               Settings, switch member, invite, add a ritual
```

`app/index.tsx` (`Gate`) is the only screen allowed to own `/`. Its redirect
logic:

```
loading            → show spinner
!isAuthenticated    → /onboarding
!hasFamily           → /(setup)/choose
members.length > 0
  && !activeMember    → /(setup)/who-is-this
else                   → /(app)/home
```

## Habit setup wizard

`app/(setup)/habits.tsx` runs in two modes:

- **Wizard mode** (from create/join-family flow): cycles through every
  member missing habits in one sitting — "Member X of N", "Next: `<name>`".
- **Single-member mode**: triggered when opened with a `memberId` param
  (Profile → "Add a ritual"), skips the wizard chrome.

Habits come from either a fixed template (`src/data/templates.ts`,
role-specific lists) or "Create your own" — a custom label + `EmojiPicker`
icon + a `growthType` pick (`growthTypeOptions`, each with a default
`growthLabel` flavor line used in the check-in celebration). Both share the
same 1–3 selection cap per member.

## Growth / forest scene

Each habit has a `growthType` (`mushroom | firefly | tree | creature`).
Completions accumulate into `AppStateContext`'s `streakFor`/`growthCounts`,
and total completions map to a forest stage (`FOREST_STAGES`: Seed → Sprout
→ Sapling → Grove → Glowing Grove) surfaced on the Parent Home screen.

Beyond the aggregate counts, every completion also gets one **permanently
placed sprite** on a persistent world canvas
(`src/data/forestLayout.ts:layoutForest`) — position is a pure function of
`(completion id, index among same-growth-type completions)`, so existing
sprites never move as the forest grows, they only accumulate. `ForestScene`
(`src/components/ForestScene.tsx`) renders that canvas with pinch/pan
(react-native-gesture-handler `Gesture.Simultaneous(Pan, Pinch)` +
Reanimated shared values). It measures its own container via `onLayout`
(not `useWindowDimensions()`), so the same component works both full-screen
and embedded in a shorter frame, and is used in two places:

- **Home hero** (`src/screens/HomeParent.tsx`, `HomeKid.tsx`) — the
  permanent, always-visible view of the family's accumulated forest.
  Interactive (pinch/pan) on Parent Home; non-interactive on Kid Home since
  it spans the full screen behind a scrolling habit list there and would
  otherwise fight the list's own pan gesture.
- **Check-in** (`app/checkin/[habitId].tsx`) — explorable before you check
  in, and on completion it zooms/pans to the newly-grown sprite with a
  spring entrance + glow.

Two non-obvious things baked into that math, worth knowing before touching
it: CSS/RN `transform: scale` pivots around the element's own center, not
`(0,0)`, so centering a world point at the viewport center needs a
`worldCenter * (1 - scale)` compensation term; and the check-in screen's
detail sheet covers the bottom ~55% of the viewport, so the celebration zoom
targets `viewportH * 0.32` (the visible "peek" band above the sheet), not
the full viewport's vertical center.

## Fox companion

`src/components/FoxCompanion.tsx` is a hand-drawn `react-native-svg`
character (no Rive/Lottie — hand-authoring a rigged character in either
format without a visual editor isn't practical) animated with Reanimated:
an idle loop (body bob, tail sway, periodic blink), a wave, and a celebrate
reaction, plus a tappable speech bubble cycling encouraging lines.

It's mounted once in `app/(app)/_layout.tsx`, floating above the tab bar so
it persists across every tab, not just Home. That layout watches
`completions.length` for increases and flips the fox to `celebrate` mood for
~2.6s whenever anyone in the family finishes a habit, from wherever you are
in the app.

## Known constraints

- **No backend, no real auth.** `signUp`/`signIn` just persist
  `{ email, name }` locally — there is no password check, no server, no
  cross-device sync. Two devices "joining" the same family via invite code
  each keep their own local copy of that family's data; nothing is actually
  shared over a network yet.
- **Single JSON blob persistence.** Fine at this scale; would need real
  migrations/schema versioning before swapping in a backend.

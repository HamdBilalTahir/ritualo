# Ritualo

A shared Magical Forest that grows every time your family shows up for each
other — one small ritual at a time. Kids and parents each check off their
own daily habits, and the family's forest grows with streaks, mushrooms,
fireflies, and trees.

Built with Expo (SDK 54) and Expo Router. All data is local-only
(AsyncStorage) — there's no backend yet, so nothing syncs across devices.
See [Architecture.md](./Architecture.md) for how it's put together.

## Requirements

- Node.js 18+
- The [Expo Go](https://expo.dev/go) app on your phone, matching **SDK 54**
  (check Expo Go → Settings → "Supported SDK") — or an iOS
  simulator / Android emulator

## Getting started

```bash
git clone git@github.com:HamdBilalTahir/ritualo.git
cd ritualo
npm install
npx expo start
```

Scan the QR code with Expo Go (same Wi-Fi network as your machine), or press
`i` / `a` / `w` in the terminal for iOS simulator / Android emulator / web.

On a different network than your machine (e.g. mobile data), use a tunnel
instead:

```bash
npx expo start --tunnel
```

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server (LAN) |
| `npm run android` | Start and open on a connected Android device/emulator |
| `npm run ios` | Start and open in the iOS simulator |
| `npm run web` | Start and open in a browser |

## Troubleshooting

- **"Project is incompatible with this version of Expo Go"** — your Expo Go
  app is on an older SDK than this project (`expo` in `package.json`).
  Force-reinstall Expo Go from the app store (staged rollouts can lag behind
  what's actually published), or match the project's SDK to your installed
  Expo Go version.
- **Stuck on a blank screen / stale state after a dependency change** — clear
  Metro's cache: `npx expo start --clear`.

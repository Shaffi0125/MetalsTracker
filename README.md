# Metal Prices RN

A React Native (Expo) app that displays **live-looking** precious metal prices (Gold, Silver, Platinum, Palladium).
Each tile loads independently with its own loader and error state. Tapping a tile opens a details screen
showing 24K price, open, close, previous close, change %, date and time, etc.

> Prices are mocked locally via `src/api/mockApi.js` but you can swap in a real API (e.g., goldapi.io) easily.

## Features
- Landing page with clickable tiles for Gold, Silver, Platinum, and Palladium
- Each tile fetches data with its **own loader** and error indicator
- Details page with more fields (24K price, open, close, previous close, change, change %, high/low, date/time)
- Auto-refresh snapshots every 30s
- Proper **error handling** and **loading states**
- React Navigation (native stack)

## Getting Started

```bash
# 1) Ensure Node.js 18+ and latest npm or pnpm
# 2) Install Expo CLI if you don't have it yet
npm i -g expo

# 3) Install deps
npm install

# 4) Start the dev server
npm run start

# 5) Run on Android/iOS/Web
# Use Expo Go app or an emulator/simulator when prompted
```

## Swap to a Real API

Replace the calls in `src/api/mockApi.js` with your real endpoints, e.g.:

```js
import axios from 'axios';

export async function fetchMetalSnapshot(metal) {
  const { data } = await axios.get(`https://example.com/price?metal=${metal}`);
  return data; // shape should match what the app expects
}
```

If your real API returns a different shape, adapt the mapping in `fetchMetalSnapshot` / `fetchMetalDetails`.

## Project Structure

```
.
├── App.js
├── app.json
├── package.json
├── src
│   ├── api
│   │   └── mockApi.js
│   ├── components
│   │   └── MetalTile.js
│   ├── screens
│   │   ├── DetailsScreen.js
│   │   └── HomeScreen.js
│   └── utils
│       └── format.js
└── README.md
```

## Notes
- "24K price" is represented by the `karat24Price` field in the mock.
- Time/date display uses your device locale via `Intl`/`date-fns`.
- To add more metals, update `METALS` in `HomeScreen.js` and implement server-side support.


## Bullet points on approach and challenges/unresolved notes

---

###### **\* Approach:-**



* Started by creating a **React Native** project with **Expo** for easy cross-platform development.
  Set up **React Navigation** to switch between Home and Details screens.
* Built a **reusable MetalTile component** to display each metal's snapshot with independent loading/error states.
* Used a **mock API**(mockApi,js) for development to simulate live data fetching.
* **Structured the project** into api/, components/, screens/, and utils/ folders for maintainability.
  Implemented **auto-refresh** every few seconds to mimic real-time price updates.
  Added a **utility function**(format.js) for consistent currency formatting.



**Challenges/Unresolved notes:-**

---

* Currently using a mock API, needs integration with a real API (eg - goldapi.io).
* Limited styling, UI could be enhanced with charts and filters or alerts.
* Error handling can be enhanced for poor/no network connection.
* Deployment tested only on Expo Go, production builds not yet validated.


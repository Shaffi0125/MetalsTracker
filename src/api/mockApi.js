// A lightweight mock API that simulates per-metal network calls with variable latency and random errors.
// In a real app, replace these functions with axios.get('https://example.com/price?metal=gold') etc.

const METALS = ['gold', 'silver', 'platinum', 'palladium'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function basePrice(metal) {
  switch (metal) {
    case 'gold': return 2400;
    case 'silver': return 30;
    case 'platinum': return 980;
    case 'palladium': return 1300;
    default: return 100;
  }
}

function jitter(price) {
  return price * (1 + (Math.random() - 0.5) * 0.01); // ±0.5%
}

function maybeError() {
  // 10% chance of error
  return Math.random() < 0.10;
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

export async function fetchMetalSnapshot(metal) {
  if (!METALS.includes(metal)) throw new Error('Unknown metal');
  // Simulate variable latency 200–1200ms
  await delay(200 + Math.random() * 1000);
  if (maybeError()) {
    const err = new Error('Network error while fetching ' + metal + ' price');
    err.code = 'NET_FAIL';
    throw err;
  }
  const now = new Date();
  const open = jitter(basePrice(metal));
  const previousClose = jitter(basePrice(metal));
  const current = jitter(basePrice(metal));
  const change = current - previousClose;
  const changePercent = (change / previousClose) * 100;

  return {
    metal,
    symbol: metal === 'gold' ? 'XAU' : metal === 'silver' ? 'XAG' : metal === 'platinum' ? 'XPT' : 'XPD',
    karat24Price: current,   // 24 Karat equivalent (for gold); for others, treat as spot
    open,
    previousClose,
    close: current,          // using current as intraday "close" proxy in mock
    lastUpdated: now.toISOString(),
    date: now.toISOString(),
    change,
    changePercent
  };
}

export async function fetchMetalDetails(metal) {
  // Could be the same as snapshot but with extra fields
  const base = await fetchMetalSnapshot(metal);
  const high = base.karat24Price * (1 + Math.random() * 0.01);
  const low = base.karat24Price * (1 - Math.random() * 0.01);
  return {
    ...base,
    dayHigh: high,
    dayLow: low,
    volume: Math.floor(randomBetween(1000, 100000)),
    exchange: 'MOCK-COMEX',
  };
}

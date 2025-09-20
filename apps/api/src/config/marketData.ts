import { Market } from '../domain/entities/Market';

/**
 * Market data constants for Region VII (Central Visayas)
 * These are the markets that appear in the Bantay Presyo data
 */
export const REGION_VII_MARKETS = [
  'TABUNOK PUBLIC MARKET',
  'MANDAUE CITY PUBLIC MARKET',
  'LAPU LAPU CITY PUBLIC MARKET',
  'LAZI PUBLIC MARKET',
  'DAO PUBLIC MARKET',
  'DUMAGUETE CITY PUBLIC MARKET',
  'CARBON PASIL MARKET',
  'LARENA PUBLIC MARKET',
  'SIQUIJOR PUBLIC MARKET',
  'PASIL PUBLIC MARKET'
] as const;

/**
 * Market data constants for other regions
 * Add more regions as needed
 */
export const MARKET_DATA = {
  'Region VII': REGION_VII_MARKETS,
  // Add other regions here as needed
  // 'Region I': [...],
  // 'Region II': [...],
} as const;

/**
 * Get market names for a specific region
 */
export function getMarketsForRegion(region: string): readonly string[] {
  return MARKET_DATA[region as keyof typeof MARKET_DATA] || [];
}

/**
 * Get all available regions
 */
export function getAvailableRegions(): string[] {
  return Object.keys(MARKET_DATA);
}

/**
 * Check if a market exists in a specific region
 */
export function isMarketInRegion(marketName: string, region: string): boolean {
  const regionMarkets = getMarketsForRegion(region);
  return regionMarkets.includes(marketName);
}

/**
 * Create Market entities from market names
 */
export function createMarketsFromNames(marketNames: readonly string[]): Market[] {
  return marketNames.map(name => Market.fromString(name));
}

/**
 * Get Market entities for a specific region
 */
export function getMarketEntitiesForRegion(region: string): Market[] {
  const marketNames = getMarketsForRegion(region);
  return createMarketsFromNames(marketNames);
}

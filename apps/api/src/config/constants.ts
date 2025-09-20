/**
 * Application constants
 */

// API Configuration
export const API_CONFIG = {
  BANTAY_PRESYO_BASE_URL: 'http://www.bantaypresyo.da.gov.ph',
  DEFAULT_PORT: 4000,
  GRAPHQL_ENDPOINT: '/graphql',
} as const;

// Database Configuration
export const DATABASE_CONFIG = {
  COLLECTIONS: {
    PRICE_DATA: 'price_data',
  },
  INDEXES: {
    COMMODITY_AND_REGION: 'commodity_region_index',
    COMMODITY: 'commodity_index',
    REGION: 'region_index',
    UPDATED_AT: 'updated_at_index',
  },
} as const;

// Commodity Types
export const COMMODITY_TYPES = [
  'Rice',
  'Corn',
  'Vegetables',
  'Fruits',
  'Meat',
  'Fish',
  'Poultry',
  'Dairy',
] as const;

// Region Names
export const REGIONS = [
  'Region I (Ilocos Region)',
  'Region II (Cagayan Valley)',
  'Region III (Central Luzon)',
  'Region IV-A (CALABARZON)',
  'Region IV-B (MIMAROPA)',
  'Region V (Bicol Region)',
  'Region VI (Western Visayas)',
  'Region VII (Central Visayas)',
  'Region VIII (Eastern Visayas)',
  'Region IX (Zamboanga Peninsula)',
  'Region X (Northern Mindanao)',
  'Region XI (Davao Region)',
  'Region XII (SOCCSKSARGEN)',
  'Region XIII (Caraga)',
  'NCR (National Capital Region)',
  'CAR (Cordillera Administrative Region)',
  'BARMM (Bangsamoro Autonomous Region in Muslim Mindanao)',
] as const;

// Default Values
export const DEFAULT_VALUES = {
  COUNT: 10,
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  MONGODB_CONNECTION_FAILED: 'Failed to connect to MongoDB',
  PRICE_DATA_FETCH_FAILED: 'Failed to fetch price data',
  PRICE_DATA_SAVE_FAILED: 'Failed to save price data',
  INVALID_REQUEST: 'Invalid request parameters',
  EXTERNAL_API_ERROR: 'External API error',
  VALIDATION_ERROR: 'Validation error',
} as const;

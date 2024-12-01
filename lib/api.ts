// import axios from 'axios';
// import type { Blockchain } from '@/types/blockchain';

// const api = axios.create({
//   baseURL: 'https://api.coingecko.com/api/v3',
//   headers: {
//     'Accept': 'application/json',
//   },
// });

// let lastRequestTime = 0;
// const RATE_LIMIT_DELAY = 1100; // 1.1 seconds to respect rate limit

// const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export async function getBlockchains(page: number, limit: number, searchTerm?: string) {
//   try {
//     // Respect rate limiting
//     const now = Date.now();
//     const timeSinceLastRequest = now - lastRequestTime;
//     if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
//       await wait(RATE_LIMIT_DELAY - timeSinceLastRequest);
//     }

//     const response = await api.get('/coins/markets', {
//       params: {
//         vs_currency: 'usd',
//         order: 'market_cap_desc',
//         per_page: limit,
//         page,
//         sparkline: false,
//         ...(searchTerm && { ids: searchTerm.toLowerCase() }),
//       },
//     });

//     lastRequestTime = Date.now();

//     return response.data.map((coin: any): Blockchain => ({
//       id: coin.id,
//       name: coin.name,
//       symbol: coin.symbol,
//       image: coin.image,
//       current_price: coin.current_price,
//       price_change_percentage_24h: coin.price_change_percentage_24h,
//     }));
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response?.status === 429) {
//       // Handle rate limiting
//       await wait(RATE_LIMIT_DELAY);
//       return getBlockchains(page, limit, searchTerm);
//     }
//     console.error('Error fetching blockchains:', error);
//     throw error;
//   }
// }


// import axios from 'axios';
// import type { Blockchain } from '@/types/blockchain';

// const api = axios.create({
//   baseURL: 'https://api.coingecko.com/api/v3',
//   headers: {
//     'Accept': 'application/json',
//   },
// });

// let lastRequestTime = 0;
// const RATE_LIMIT_DELAY = 1100; // 1.1 seconds to respect rate limit
// const MAX_RETRIES = 3;

// const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export async function getBlockchains(
//   page: number, 
//   limit: number, 
//   searchTerm?: string, 
//   retryCount = 0
// ): Promise<Blockchain[]> {
//   try {
//     // Respect rate limiting
//     const now = Date.now();
//     const timeSinceLastRequest = now - lastRequestTime;
//     if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
//       await wait(RATE_LIMIT_DELAY - timeSinceLastRequest);
//     }

//     const response = await api.get('/coins/markets', {
//       params: {
//         vs_currency: 'usd',
//         order: 'market_cap_desc',
//         per_page: limit,
//         page,
//         sparkline: false,
//         ...(searchTerm && { ids: searchTerm.toLowerCase() }),
//       },
//     });

//     lastRequestTime = Date.now();

//     return response.data.map((coin: any): Blockchain => ({
//       id: coin.id,
//       name: coin.name,
//       symbol: coin.symbol,
//       image: coin.image,
//       current_price: coin.current_price,
//       price_change_percentage_24h: coin.price_change_percentage_24h,
//     }));
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
//         // Handle rate limiting with exponential backoff
//         const backoffDelay = RATE_LIMIT_DELAY * Math.pow(2, retryCount);
//         await wait(backoffDelay);
//         return getBlockchains(page, limit, searchTerm, retryCount + 1);
//       }
      
//       if (error.response?.status === 404 && searchTerm) {
//         // Return empty array for invalid search terms
//         return [];
//       }
//     }
    
//     console.error('Error fetching blockchains:', error);
//     throw error;
//   }
// }


// import axios from 'axios';
// import type { Blockchain } from '@/types/blockchain';

// const api = axios.create({
//   baseURL: 'https://api.coingecko.com/api/v3',
//   headers: {
//     'Accept': 'application/json',
//   },
// });

// let lastRequestTime = 0;
// const RATE_LIMIT_DELAY = 1100; // 1.1 seconds to respect rate limit
// const MAX_RETRIES = 3;

// const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export async function getBlockchains(
//   page: number, 
//   limit: number, 
//   searchTerm?: string, 
//   retryCount = 0
// ): Promise<Blockchain[]> {
//   try {
//     // Respect rate limiting
//     const now = Date.now();
//     const timeSinceLastRequest = now - lastRequestTime;
//     if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
//       await wait(RATE_LIMIT_DELAY - timeSinceLastRequest);
//     }

//     const params: any = {
//       vs_currency: 'usd',
//       order: 'market_cap_desc',
//       per_page: limit,
//       page,
//       sparkline: false,
//     };

//     const response = await api.get('/coins/markets', { 
//       params: searchTerm 
//         ? { 
//             ...params, 
//             ids: searchTerm.toLowerCase() 
//           } 
//         : params 
//     });

//     lastRequestTime = Date.now();

//     // Filter results to match search term more precisely
//     const filteredData = searchTerm 
//       ? response.data.filter((coin: any) => 
//           coin.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       : response.data;

//     return filteredData.map((coin: any): Blockchain => ({
//       id: coin.id,
//       name: coin.name,
//       symbol: coin.symbol,
//       image: coin.image,
//       current_price: coin.current_price,
//       price_change_percentage_24h: coin.price_change_percentage_24h,
//     }));
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
//         // Handle rate limiting with exponential backoff
//         const backoffDelay = RATE_LIMIT_DELAY * Math.pow(2, retryCount);
//         await wait(backoffDelay);
//         return getBlockchains(page, limit, searchTerm, retryCount + 1);
//       }
      
//       if (error.response?.status === 404 && searchTerm) {
//         // Return empty array for invalid search terms
//         return [];
//       }
//     }
    
//     console.error('Error fetching blockchains:', error);
//     throw error;
//   }
// }


import axios from 'axios';
import type { Blockchain } from '@/types/blockchain';
import { apiCache } from './cache';

const api = axios.create({
  baseURL: '/api/coins',
  timeout: 10000,
});

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

async function throttledRequest<T>(
  url: string,
  params: Record<string, any>
): Promise<T> {
  const cacheKey = `${url}?${new URLSearchParams(params).toString()}`;
  const cachedData = apiCache.get(cacheKey);
  
  if (cachedData) {
    return cachedData as T;
  }

  const now = Date.now();
  const timeToWait = Math.max(0, MIN_REQUEST_INTERVAL - (now - lastRequestTime));
  
  if (timeToWait > 0) {
    await new Promise(resolve => setTimeout(resolve, timeToWait));
  }

  const response = await api.get<T>(url, { params });
  lastRequestTime = Date.now();
  
  apiCache.set(cacheKey, response.data);
  return response.data;
}

export async function getBlockchains(
  page: number = 1,
  limit: number = 20,
  searchTerm?: string
): Promise<Blockchain[]> {
  try {
    if (searchTerm?.trim()) {
      const searchResponse = await throttledRequest<{ coins: any[] }>('/', {
        path: 'search',
        query: searchTerm.trim()
      });

      if (!Array.isArray(searchResponse?.coins)) {
        return [];
      }

      const coinIds = searchResponse.coins
        .slice(0, limit)
        .map((coin: any) => coin.id)
        .join(',');

      if (!coinIds) return [];

      const marketResponse = await throttledRequest<any[]>('/', {
        path: 'coins/markets',
        vs_currency: 'usd',
        ids: coinIds,
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false
      });

      if (!Array.isArray(marketResponse)) {
        return [];
      }

      return marketResponse.map(mapCoinToBlockchain);
    }

    const response = await throttledRequest<any[]>('/', {
      path: 'coins/markets',
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit,
      page: page,
      sparkline: false
    });

    if (!Array.isArray(response)) {
      return [];
    }

    return response.map(mapCoinToBlockchain);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch blockchain data');
    }
    throw new Error('An unexpected error occurred');
  }
}

function mapCoinToBlockchain(coin: any): Blockchain {
  return {
    id: coin.id || '',
    name: coin.name || '',
    symbol: coin.symbol || '',
    image: coin.image || '',
    current_price: typeof coin.current_price === 'number' ? coin.current_price : 0,
    price_change_percentage_24h: typeof coin.price_change_percentage_24h === 'number' ? coin.price_change_percentage_24h : 0,
  };
}

import { HardwareSpec, MarketData, ProfitabilityResult } from '../types';
import { BLOCK_REWARD, BLOCKS_PER_DAY } from '../constants';

// Simulates fetching market data
export const getMarketData = (): MarketData => {
  // In a real app, this would be an API call
  return {
    btcPrice: 65000,
    networkDifficulty: 88.5, // In Trillion
  };
};

// Calculates network hashrate in TH/s from difficulty
const calculateNetworkHashrate = (difficulty: number): number => {
  // difficulty is in Trillion, so multiply by 10^12
  const networkHashrateHS = (difficulty * 1e12 * Math.pow(2, 32)) / 600;
  return networkHashrateHS / 1e12; // Convert to TH/s
};

export const calculateProfitability = (
  modelSpec: HardwareSpec,
  marketData: MarketData,
  electricityCost: number, // USD per kWh
  poolFee: number // Percentage, e.g., 1 for 1%
): ProfitabilityResult => {
  const networkHashrate = calculateNetworkHashrate(marketData.networkDifficulty);
  const minerShare = modelSpec.hashrate / networkHashrate;
  
  const dailyBtcRevenue = minerShare * BLOCKS_PER_DAY * BLOCK_REWARD;
  const dailyUsdRevenue = dailyBtcRevenue * marketData.btcPrice;
  
  const dailyPowerConsumptionKWh = (modelSpec.power / 1000) * 24;
  const dailyElectricityCost = dailyPowerConsumptionKWh * electricityCost;
  
  const dailyGrossProfit = dailyUsdRevenue - dailyElectricityCost;
  const dailyNetProfit = dailyGrossProfit * (1 - poolFee / 100);

  return {
    dailyRevenue: dailyUsdRevenue,
    dailyCost: dailyElectricityCost,
    dailyProfit: dailyNetProfit,
    monthlyProfit: dailyNetProfit * 30.44,
    yearlyProfit: dailyNetProfit * 365.25,
  };
};

export const calculateBreakeven = (dailyProfit: number, hardwareCost: number): number => {
  if (dailyProfit <= 0) return Infinity;
  return hardwareCost / dailyProfit;
};

export const forecastObsolescence = (
    modelSpec: HardwareSpec,
    marketData: MarketData,
    electricityCost: number,
    difficultyGrowthRate: number // Percentage per 14 days
): number => {
    let currentDifficulty = marketData.networkDifficulty;
    let profitableDays = 0;
    
    // Convert power to kW
    const powerKW = modelSpec.power / 1000;
    const dailyElectricityCost = powerKW * 24 * electricityCost;

    for (let days = 0; days < 365 * 10; days++) { // Limit to 10 years to prevent infinite loops
        const networkHashrate = calculateNetworkHashrate(currentDifficulty);
        const minerShare = modelSpec.hashrate / networkHashrate;
        const dailyUsdRevenue = (minerShare * BLOCKS_PER_DAY * BLOCK_REWARD) * marketData.btcPrice;

        if (dailyUsdRevenue <= dailyElectricityCost) {
            break;
        }

        profitableDays++;
        
        // Difficulty adjustment every 14 days
        if ((days + 1) % 14 === 0) {
            currentDifficulty *= (1 + difficultyGrowthRate / 100);
        }
    }

    return profitableDays / 30.44; // Return lifespan in months
};

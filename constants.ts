
import { HardwareModel, HardwareSpec, MarketData, AnalysisMode } from './types';

export const HARDWARE_SPECS: Record<HardwareModel, HardwareSpec> = {
  [HardwareModel.CPU]: { hashrate: 0.00002, power: 130 },
  [HardwareModel.GPU]: { hashrate: 0.0008, power: 300 },
  [HardwareModel.FPGA]: { hashrate: 0.00083, power: 60 },
  [HardwareModel.ASIC]: { hashrate: 13.5, power: 1350 },
  [HardwareModel.MODERN_ASIC]: { hashrate: 110, power: 3250 },
};

export const SIMULATED_MARKET_DATA: MarketData = {
  btcPrice: 65000,
  networkDifficulty: 88.5, // In T
};

export const WELCOME_MESSAGE = "Welcome, I am the Bitcoin Mining Hardware Economic Analyst (BMHEA). I can help you analyze the profitability and lifecycle of mining hardware. How can I assist you today?";
export const DISCLAIMER_MESSAGE = "Please note: This analysis is based on the provided data and current market conditions. The cryptocurrency market is highly volatile, and this is not financial advice.";

export const MENU_OPTIONS = [
    AnalysisMode.PROFITABILITY,
    AnalysisMode.BREAKEVEN,
    AnalysisMode.OBSOLESCENCE,
    AnalysisMode.COMPARE,
];

export const BLOCK_REWARD = 3.125; // BTC per block
export const BLOCKS_PER_DAY = 144; // Approx. 24 * 6

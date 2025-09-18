
export enum HardwareModel {
  CPU = "CPU (Intel Core i7-980X)",
  GPU = "GPU (AMD Radeon HD 5970)",
  FPGA = "FPGA (BFL Single)",
  ASIC = "ASIC (Antminer S9)",
  MODERN_ASIC = "Modern ASIC (Antminer S19 Pro)",
}

export interface HardwareSpec {
  hashrate: number; // in TH/s
  power: number;    // in Watts
}

export interface MarketData {
  btcPrice: number;
  networkDifficulty: number; // in T
}

export enum AnalysisMode {
  PROFITABILITY = "1. Analyze Current Profitability",
  BREAKEVEN = "2. Calculate Breakeven / ROI",
  OBSOLESCENCE = "3. Forecast Hardware Obsolescence",
  COMPARE = "4. Compare Two Hardware Models",
}

export interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text?: string;
  options?: AnalysisMode[];
  result?: any;
  analysisMode?: AnalysisMode;
  disclaimer?: boolean;
}

export interface ProfitabilityResult {
    dailyRevenue: number;
    dailyCost: number;
    dailyProfit: number;
    monthlyProfit: number;
    yearlyProfit: number;
}

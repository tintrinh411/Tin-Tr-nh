
import React from 'react';
import { AnalysisMode } from '../types';

interface AnalysisResultProps {
  result: any;
  analysisMode: AnalysisMode;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const TableRow: React.FC<{ label: string; value: string; isHeader?: boolean; highlight?: boolean }> = ({ label, value, isHeader = false, highlight = false }) => (
    <div className={`grid grid-cols-2 p-3 ${isHeader ? 'font-bold text-light-text' : 'text-medium-text'} ${highlight ? 'bg-btc-orange/20 text-btc-orange font-semibold' : ''} border-b border-dark-tertiary last:border-b-0`}>
        <span className="text-left">{label}</span>
        <span className="text-right">{value}</span>
    </div>
);

const ProfitabilityTable: React.FC<{ data: any }> = ({ data }) => (
    <div className="bg-dark-secondary rounded-lg overflow-hidden border border-dark-tertiary">
        <TableRow label="Metric" value="Value" isHeader />
        <TableRow label="Daily Revenue" value={formatCurrency(data.dailyRevenue)} />
        <TableRow label="Daily Electricity Cost" value={formatCurrency(data.dailyCost)} />
        <TableRow label="Daily Profit" value={formatCurrency(data.dailyProfit)} highlight />
        <TableRow label="Monthly Profit (est.)" value={formatCurrency(data.monthlyProfit)} />
        <TableRow label="Yearly Profit (est.)" value={formatCurrency(data.yearlyProfit)} />
    </div>
);

const BreakevenResult: React.FC<{ data: any }> = ({ data }) => (
    <div className="bg-dark-secondary rounded-lg p-6 text-center border border-dark-tertiary">
        <p className="text-medium-text mb-2">Estimated Breakeven Point / ROI</p>
        <p className="text-4xl font-bold text-btc-orange">
            {isFinite(data.breakevenDays) ? `${Math.ceil(data.breakevenDays)} Days` : "Never (Not Profitable)"}
        </p>
    </div>
);

const ObsolescenceResult: React.FC<{ data: any }> = ({ data }) => (
    <div className="bg-dark-secondary rounded-lg p-6 text-center border border-dark-tertiary">
        <p className="text-medium-text mb-2">Estimated Profitable Lifespan</p>
        <p className="text-4xl font-bold text-btc-orange">
            {`${data.lifespanMonths.toFixed(1)} Months`}
        </p>
        <p className="text-sm text-medium-text mt-2">Assuming all other factors (BTC price, electricity cost) remain constant.</p>
    </div>
);

const ComparisonTable: React.FC<{ data: any }> = ({ data }) => (
    <div className="bg-dark-secondary rounded-lg overflow-hidden border border-dark-tertiary">
        <div className="grid grid-cols-3 p-3 font-bold text-light-text border-b border-dark-tertiary">
            <span className="text-left">Metric</span>
            <span className="text-right">{data.model1.name}</span>
            <span className="text-right">{data.model2.name}</span>
        </div>
        {[
            { label: 'Daily Revenue', key: 'dailyRevenue', format: formatCurrency },
            { label: 'Daily Cost', key: 'dailyCost', format: formatCurrency },
            { label: 'Daily Profit', key: 'dailyProfit', format: formatCurrency, highlight: true },
            { label: 'Monthly Profit', key: 'monthlyProfit', format: formatCurrency },
            { label: 'Yearly Profit', key: 'yearlyProfit', format: formatCurrency },
        ].map(row => {
            const val1 = data.model1.results[row.key];
            const val2 = data.model2.results[row.key];
            const val1IsBetter = val1 > val2;

            return (
                <div key={row.key} className="grid grid-cols-3 p-3 text-medium-text border-b border-dark-tertiary last:border-b-0">
                    <span className="text-left">{row.label}</span>
                    <span className={`text-right font-mono ${row.highlight && val1IsBetter ? 'text-btc-orange font-bold' : ''}`}>{row.format(val1)}</span>
                    <span className={`text-right font-mono ${row.highlight && !val1IsBetter ? 'text-btc-orange font-bold' : ''}`}>{row.format(val2)}</span>
                </div>
            );
        })}
    </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, analysisMode }) => {
  if (!result || !analysisMode) return null;

  switch (analysisMode) {
    case AnalysisMode.PROFITABILITY:
      return <ProfitabilityTable data={result} />;
    case AnalysisMode.BREAKEVEN:
        return <BreakevenResult data={result} />;
    case AnalysisMode.OBSOLESCENCE:
        return <ObsolescenceResult data={result} />;
    case AnalysisMode.COMPARE:
        return <ComparisonTable data={result} />;
    default:
      return <div className="text-red-500">Error: Unknown analysis mode.</div>;
  }
};

export default AnalysisResult;

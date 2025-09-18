
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HardwareModel, AnalysisMode, ChatMessage } from './types';
import { WELCOME_MESSAGE, MENU_OPTIONS, HARDWARE_SPECS, DISCLAIMER_MESSAGE } from './constants';
import { calculateProfitability, calculateBreakeven, forecastObsolescence, getMarketData } from './services/miningCalculator';
import AnalysisResult from './components/AnalysisResult';

const BtcIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-btc-orange">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9.663 5.333a.75.75 0 0 1 .531.221l1.414 1.414a.75.75 0 0 1 0 1.06l-1.414 1.415a.75.75 0 0 1-1.061 0l-.353-.354a.75.75 0 0 1 0-1.06l.353-.354a.75.75 0 0 1 1.06 0l.354.354a.75.75 0 0 0 1.061 0l.353-.354a.75.75 0 0 1 1.06 0l.354.354a.75.75 0 0 1 0 1.06l-.354.353a.75.75 0 0 0 0 1.061l.354.353a.75.75 0 0 1 1.061 0l.353-.353a.75.75 0 0 1 1.06 0l.354.354a.75.75 0 0 1 0 1.06l-1.414 1.414a.75.75 0 0 1-1.06 0l-.354-.353a.75.75 0 0 0-1.06 0l-.354.354a.75.75 0 0 1-1.061 0l-.353-.354a.75.75 0 0 1 0-1.06l.353-.354a.75.75 0 0 0 0-1.06l-1.415-1.415a.75.75 0 0 1-.22-.531V9.75a.75.75 0 0 0-1.5 0v.622a.75.75 0 0 1-.22.53l-1.415 1.415a.75.75 0 0 0 0 1.06l.354.354a.75.75 0 0 1 0 1.06l-.354.354a.75.75 0 0 1-1.06 0l-.354-.354a.75.75 0 0 1 0-1.06l1.414-1.414a.75.75 0 0 1 1.06-1.061l.354.354a.75.75 0 0 0 1.061 0l1.414-1.414a.75.75 0 0 1 .531-.221h.375a.75.75 0 0 0 0-1.5h-.375Zm-2.663 6.417a.75.75 0 0 1 1.06 0l.354.354a.75.75 0 0 1 0 1.06l-.354.354a.75.75 0 0 1-1.06 0l-1.414-1.414a.75.75 0 0 1 0-1.06l1.414-1.414a.75.75 0 0 1 1.06 0l.354.354a.75.75 0 0 0 1.06 0l.354-.354a.75.75 0 0 1 1.061 0l.353.354a.75.75 0 0 1 0 1.06l-.353.354a.75.75 0 0 0 0 1.06l.353.354a.75.75 0 0 1 1.06 0l.354-.353a.75.75 0 0 1 1.061 0l1.414 1.414a.75.75 0 0 1 .22.531v.375a.75.75 0 0 0 1.5 0v-.375a.75.75 0 0 1 .22-.531l1.414-1.414a.75.75 0 0 0 0-1.06l-1.414-1.414a.75.75 0 0 0-1.06 0l-.354.353a.75.75 0 0 1-1.061 0l-.353-.354a.75.75 0 0 0-1.06 0l-.354.354a.75.75 0 0 1 0 1.06l.354.354a.75.75 0 0 0 0 1.06l-1.414 1.415a.75.75 0 0 1-1.061 0l-.353-.354a.75.75 0 0 0-1.06 0l-1.414 1.414a.75.75 0 0 1-.531.221H9.75a.75.75 0 0 0 0 1.5h.622a.75.75 0 0 1 .53.22l1.415 1.415a.75.75 0 0 0 1.06 0l1.414-1.414a.75.75 0 0 0 0-1.06l-.353-.354a.75.75 0 0 1 0-1.06l.353-.354a.75.75 0 0 1 1.061 0l1.414 1.414a.75.75 0 0 1 .221.531v.375a.75.75 0 0 0 1.5 0v-.375a.75.75 0 0 1 .221-.531l1.414-1.414a.75.75 0 0 0 0-1.06l-1.414-1.414a.75.75 0 0 0-1.06 0l-.354.353a.75.75 0 0 1-1.061 0l-.353-.354a.75.75 0 0 0-1.06 0l-.354.354a.75.75 0 0 1 0 1.06l.354.354a.75.75 0 0 0 0 1.06l-1.414 1.415a.75.75 0 0 1-1.061 0l-1.414-1.414a.75.75 0 0 1-.221-.531v-.622a.75.75 0 0 0-1.5 0v.622a.75.75 0 0 1-.221.531l-1.414 1.415a.75.75 0 0 0 0 1.06l1.414 1.414a.75.75 0 0 0 1.06 0l.354-.353a.75.75 0 0 1 1.061 0l1.414 1.414a.75.75 0 0 0 1.06 0l.354-.354a.75.75 0 0 1 1.06 0l.354.354a.75.75 0 0 1 0 1.06l-.354.354a.75.75 0 0 0 0 1.06l.354.354a.75.75 0 0 1 1.06 0l.354-.353a.75.75 0 0 1 1.06 0l.353.354a.75.75 0 0 1 0 1.06l-1.414 1.414a.75.75 0 0 1-1.06 0l-.354-.353a.75.75 0 0 0-1.06 0l-.354.354a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
    </svg>
);


const hardwareOptions = Object.values(HardwareModel);

type ConversationStep = {
    key: string;
    question: string;
    type: 'select' | 'number';
    options?: any[];
};

const conversationFlows: Record<AnalysisMode, ConversationStep[]> = {
    [AnalysisMode.PROFITABILITY]: [
        { key: 'model', question: 'Which hardware model would you like to analyze?', type: 'select', options: hardwareOptions },
        { key: 'electricityCost', question: 'What is your electricity price in USD per kWh? (e.g., 0.10)', type: 'number' },
        { key: 'poolFee', question: 'What is your mining pool fee in percent? (e.g., 1)', type: 'number' },
    ],
    [AnalysisMode.BREAKEVEN]: [
        { key: 'model', question: 'Which hardware model would you like to analyze?', type: 'select', options: hardwareOptions },
        { key: 'hardwareCost', question: 'What is the hardware cost in USD?', type: 'number' },
        { key: 'electricityCost', question: 'What is your electricity price in USD per kWh?', type: 'number' },
        { key: 'poolFee', question: 'What is your mining pool fee in percent?', type: 'number' },
    ],
    [AnalysisMode.OBSOLESCENCE]: [
        { key: 'model', question: 'Which hardware model would you like to analyze?', type: 'select', options: hardwareOptions },
        { key: 'electricityCost', question: 'What is your electricity price in USD per kWh?', type: 'number' },
        { key: 'difficultyGrowth', question: 'What is the estimated difficulty growth rate every 14 days in percent? (e.g., 2 for 2%)', type: 'number' },
    ],
    [AnalysisMode.COMPARE]: [
        { key: 'model1', question: 'Select the first hardware model to compare.', type: 'select', options: hardwareOptions },
        { key: 'model2', question: 'Select the second hardware model to compare.', type: 'select', options: hardwareOptions },
        { key: 'electricityCost', question: 'What is your electricity price in USD per kWh? (common for both)', type: 'number' },
        { key: 'poolFee', question: 'What is your mining pool fee in percent? (common for both)', type: 'number' },
    ],
};

const App: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [analysisMode, setAnalysisMode] = useState<AnalysisMode | null>(null);
    const [userInput, setUserInput] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const chatEndRef = useRef<HTMLDivElement>(null);

    const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
        setMessages(prev => [...prev, { ...message, id: Date.now() + Math.random() }]);
    }, []);

    const resetState = useCallback(() => {
        setAnalysisMode(null);
        setCurrentStep(0);
        setUserInput({});
        setInputValue('');
        setTimeout(() => addMessage({ sender: 'ai', options: MENU_OPTIONS, text: "How can I assist you next?" }), 500);
    }, [addMessage]);

    useEffect(() => {
        addMessage({ sender: 'ai', text: WELCOME_MESSAGE, options: MENU_OPTIONS });
    }, [addMessage]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleOptionSelect = useCallback((option: AnalysisMode | HardwareModel) => {
        addMessage({ sender: 'user', text: option });

        if (Object.values(AnalysisMode).includes(option as AnalysisMode) && !analysisMode) {
            const mode = option as AnalysisMode;
            setAnalysisMode(mode);
            setCurrentStep(0);
            addMessage({ sender: 'ai', text: conversationFlows[mode][0].question });
        } else if (analysisMode) {
            const flow = conversationFlows[analysisMode];
            const currentQuestion = flow[currentStep];
            if (currentQuestion.type === 'select') {
                const nextUserInput = { ...userInput, [currentQuestion.key]: option };
                setUserInput(nextUserInput);

                if (currentStep < flow.length - 1) {
                    setCurrentStep(currentStep + 1);
                    addMessage({ sender: 'ai', text: flow[currentStep + 1].question });
                } else {
                    performAnalysis(nextUserInput, analysisMode);
                }
            }
        }
    }, [analysisMode, currentStep, userInput, addMessage]);

    const handleNumberInput = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!analysisMode || !inputValue) return;

        const numValue = parseFloat(inputValue);
        if (isNaN(numValue)) {
            addMessage({ sender: 'ai', text: "Please enter a valid number." });
            return;
        }

        addMessage({ sender: 'user', text: inputValue });
        setInputValue('');

        const flow = conversationFlows[analysisMode];
        const currentQuestion = flow[currentStep];
        const nextUserInput = { ...userInput, [currentQuestion.key]: numValue };
        setUserInput(nextUserInput);

        if (currentStep < flow.length - 1) {
            setCurrentStep(currentStep + 1);
            addMessage({ sender: 'ai', text: flow[currentStep + 1].question });
        } else {
            performAnalysis(nextUserInput, analysisMode);
        }
    }, [analysisMode, inputValue, currentStep, userInput, addMessage]);

    const performAnalysis = async (finalUserInput: Record<string, any>, mode: AnalysisMode) => {
        setIsLoading(true);
        addMessage({ sender: 'ai', text: "Analyzing, please wait..." });
        
        await new Promise(res => setTimeout(res, 1000)); // Simulate async work

        const marketData = getMarketData();
        let result: any = null;

        try {
            switch (mode) {
                case AnalysisMode.PROFITABILITY:
                    result = calculateProfitability(HARDWARE_SPECS[finalUserInput.model], marketData, finalUserInput.electricityCost, finalUserInput.poolFee);
                    break;
                case AnalysisMode.BREAKEVEN:
                    const profitResult = calculateProfitability(HARDWARE_SPECS[finalUserInput.model], marketData, finalUserInput.electricityCost, finalUserInput.poolFee);
                    const breakevenDays = calculateBreakeven(profitResult.dailyProfit, finalUserInput.hardwareCost);
                    result = { breakevenDays };
                    break;
                case AnalysisMode.OBSOLESCENCE:
                    const lifespanMonths = forecastObsolescence(HARDWARE_SPECS[finalUserInput.model], marketData, finalUserInput.electricityCost, finalUserInput.difficultyGrowth);
                    result = { lifespanMonths };
                    break;
                case AnalysisMode.COMPARE:
                    const results1 = calculateProfitability(HARDWARE_SPECS[finalUserInput.model1], marketData, finalUserInput.electricityCost, finalUserInput.poolFee);
                    const results2 = calculateProfitability(HARDWARE_SPECS[finalUserInput.model2], marketData, finalUserInput.electricityCost, finalUserInput.poolFee);
                    result = { model1: { name: finalUserInput.model1, results: results1 }, model2: { name: finalUserInput.model2, results: results2 } };
                    break;
            }

            addMessage({ sender: 'ai', text: `Here is the analysis for ${mode.substring(3)}:`, result, analysisMode: mode });

        } catch (error) {
            console.error("Analysis Error:", error);
            addMessage({ sender: 'ai', text: "An error occurred during the analysis. Please try again." });
        } finally {
            addMessage({ sender: 'ai', text: DISCLAIMER_MESSAGE, disclaimer: true });
            setIsLoading(false);
            resetState();
        }
    };
    
    const getCurrentInputType = () => {
        if (!analysisMode) return 'options';
        const flow = conversationFlows[analysisMode];
        if (currentStep >= flow.length) return 'loading';
        return flow[currentStep].type;
    };

    const currentInputType = getCurrentInputType();

    return (
        <div className="bg-dark-primary text-light-text min-h-screen flex flex-col font-sans">
            <header className="bg-dark-secondary p-4 border-b border-dark-tertiary shadow-lg flex items-center justify-center space-x-4">
                <BtcIcon />
                <h1 className="text-2xl font-bold tracking-wider">Bitcoin Mining Hardware Economic Analyst</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((msg, index) => (
                        <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                             {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-btc-orange/80 flex items-center justify-center font-bold text-dark-primary text-sm flex-shrink-0">AI</div>}
                            <div className={`max-w-lg p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-btc-orange text-dark-primary rounded-br-none' : 'bg-dark-secondary text-light-text rounded-bl-none'}`}>
                                {msg.text && <p className={`whitespace-pre-wrap ${msg.disclaimer ? 'text-sm text-medium-text italic' : ''}`}>{msg.text}</p>}
                                {msg.options && (
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {msg.options.map(opt => (
                                            <button key={opt} onClick={() => handleOptionSelect(opt)} className="bg-dark-tertiary hover:bg-btc-orange hover:text-dark-primary transition-colors duration-200 text-left p-3 rounded-lg text-sm w-full disabled:opacity-50" disabled={!!analysisMode}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {msg.result && msg.analysisMode && (
                                    <div className="mt-3">
                                        <AnalysisResult result={msg.result} analysisMode={msg.analysisMode} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-3 justify-start">
                             <div className="w-8 h-8 rounded-full bg-btc-orange/80 flex items-center justify-center font-bold text-dark-primary text-sm flex-shrink-0">AI</div>
                            <div className="max-w-lg p-4 rounded-2xl bg-dark-secondary rounded-bl-none flex items-center space-x-2">
                                <div className="w-2 h-2 bg-btc-orange rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-btc-orange rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-btc-orange rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </main>
            
            <footer className="bg-dark-primary p-4 border-t border-dark-tertiary">
                <div className="max-w-3xl mx-auto">
                    {currentInputType === 'number' && !isLoading && (
                        <form onSubmit={handleNumberInput} className="flex gap-2">
                            <input
                                type="number"
                                step="any"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter a value..."
                                autoFocus
                                className="flex-1 bg-dark-secondary border border-dark-tertiary rounded-lg p-3 focus:ring-2 focus:ring-btc-orange focus:outline-none"
                            />
                            <button type="submit" className="bg-btc-orange text-dark-primary font-bold px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors">Send</button>
                        </form>
                    )}
                    {currentInputType === 'select' && !isLoading && analysisMode && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {conversationFlows[analysisMode][currentStep].options?.map(opt => (
                                <button key={opt} onClick={() => handleOptionSelect(opt)} className="bg-dark-secondary hover:bg-btc-orange hover:text-dark-primary p-3 rounded-lg transition-colors duration-200 text-center">
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default App;

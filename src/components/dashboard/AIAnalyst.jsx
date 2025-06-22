import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiMessageSquare, FiTrendingUp, FiBarChart2, FiPieChart, FiActivity, FiTarget, FiZap, FiChevronRight, FiTrendingDown, FiUsers, FiDollarSign, FiCalendar, FiArrowUp, FiArrowDown, FiEye } from 'react-icons/fi';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ComposedChart, Cell, Area, AreaChart, PieChart, Pie, ScatterChart, Scatter
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

// --- IMPORTANT: API Key Configuration ---
// It's recommended to use environment variables to store your API key securely.
// 1. Create a .env file in the root of your project.
// 2. Add your API key to the .env file: VITE_GEMINI_API_KEY=YOUR_API_KEY
// 3. Make sure your build process (e.g., Vite) is configured to handle .env files.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const AIAnalyst = ({ analysis, file, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedKeywords, setSuggestedKeywords] = useState([]);
    const messagesEndRef = useRef(null);

    const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

    // Enhanced color palette for charts
    const chartColors = [
        '#7400B8', '#9B4DCA', '#C77DFF', '#E0AAFF', '#F8F4FF',
        '#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#F3E8FF',
        '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63'
    ];

    useEffect(() => {
        if (!API_KEY) {
            console.error('Gemini API key is not configured. Please add it to your .env file.');
        }
        
        // Generate initial insights and suggested keywords
        generateInitialInsights();
    }, [file.originalName, analysis]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateInitialInsights = async () => {
        if (!analysis || !genAI) return;

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const formattedAnalysis = formatAnalysisData();
            const { category } = analysis.insights;
            
            const prompt = `
Based on this data analysis, provide:
1. A brief overview of the key insights (2-3 sentences)
2. 6-10 suggested questions/keywords that users might want to explore (mix of basic and advanced questions)
3. 2-3 visual suggestions for charts that would be most insightful

Data: ${file.originalName}
Category: ${category}
Analysis: ${formattedAnalysis}

For suggested keywords, include:
- Basic analysis questions (e.g., "What are the top performers?")
- Trend analysis questions (e.g., "How have sales changed over time?")
- Comparative questions (e.g., "Which categories perform best?")
- Actionable insight questions (e.g., "What should we focus on to improve?")
- Industry-specific questions relevant to ${category}

Respond in this exact JSON format:
{
  "overview": "Brief overview of key insights",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "visualSuggestions": [
    {
      "type": "chart_type",
      "title": "Chart title",
      "description": "Why this chart would be useful"
    }
  ]
}
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            try {
                // The AI might wrap the JSON in ```json ... ```. We need to extract it.
                const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
                const jsonString = jsonMatch ? jsonMatch[1] : text;
                const parsed = JSON.parse(jsonString);
                
                // Set initial message with insights
                setMessages([
                    {
                        id: Date.now(),
                        type: 'ai',
                        content: `Hi there! 👋 I'm your AI data analyst. I've analyzed your ${file.originalName} file and here's what I found:

**📊 Key Insights:**
${parsed.overview}

**💡 You can ask me about:**
${parsed.suggestedKeywords.map(keyword => `• ${keyword}`).join('\n')}

**📈 Suggested Visualizations:**
${parsed.visualSuggestions.map(viz => `• ${viz.title}: ${viz.description}`).join('\n')}

**🎯 Industry Focus:** Since this is ${category} data, I can provide industry-specific insights and recommendations.

What would you like to explore first?`,
                        timestamp: new Date()
                    },
                ]);
                
                setSuggestedKeywords(parsed.suggestedKeywords);
            } catch (parseError) {
                console.error('Error parsing initial insights:', parseError);
                // Fallback to basic message
                setMessages([
                    {
                        id: Date.now(),
                        type: 'ai',
                        content: `Hi there! 👋 I'm your AI data analyst. I've analyzed your ${file.originalName} file and I'm here to help you understand what the data is telling us. What would you like to explore?`,
                        timestamp: new Date()
                    },
                ]);
            }
        } catch (error) {
            console.error('Error generating initial insights:', error);
            // Fallback to basic message
            setMessages([
                {
                    id: Date.now(),
                    type: 'ai',
                    content: `Hi there! 👋 I'm your AI data analyst. I've analyzed your ${file.originalName} file and I'm here to help you understand what the data is telling us. What would you like to explore?`,
                    timestamp: new Date()
                },
            ]);
        }
    };

    const formatAnalysisData = () => {
        if (!analysis) return '';

        const { insights } = analysis;
        let formattedData = '';

        // Format KPIs
        if (insights.kpis) {
            formattedData += 'Key Performance Indicators:\n';
            Object.entries(insights.kpis).forEach(([key, value]) => {
                formattedData += `- ${key.replace(/_/g, ' ').toUpperCase()}: ${value}\n`;
            });
            formattedData += '\n';
        }

        // Format hypothesis
        if (insights.hypothesis) {
            formattedData += 'Analysis Hypothesis:\n';
            insights.hypothesis.forEach((hyp, index) => {
                formattedData += `${index + 1}. ${hyp}\n`;
            });
            formattedData += '\n';
        }

        // Format high performers
        if (insights.highPerformers) {
            formattedData += 'Top Performers:\n';
            Object.entries(insights.highPerformers).forEach(([category, data]) => {
                if (data && typeof data === 'object') {
                    formattedData += `- ${category.replace(/_/g, ' ').toUpperCase()}:\n`;
                    Object.entries(data).forEach(([key, values]) => {
                        if (Array.isArray(values)) {
                            formattedData += `  ${key}: ${values.join(', ')}\n`;
                        }
                    });
                }
            });
            formattedData += '\n';
        }

        // Format totals data
        if (insights.totals) {
            formattedData += 'Data Totals:\n';
            Object.entries(insights.totals).forEach(([category, data]) => {
                if (data && typeof data === 'object') {
                    formattedData += `- ${category.replace(/_/g, ' ').toUpperCase()}:\n`;
                    Object.entries(data).forEach(([key, values]) => {
                        if (Array.isArray(values)) {
                            formattedData += `  ${key}: ${values.join(', ')}\n`;
                        }
                    });
                }
            });
        }

        return formattedData;
    };

    const createEnhancedPrompt = (userMessage) => {
        const formattedAnalysis = formatAnalysisData();
        const { category } = analysis.insights;

        return `
You are an expert AI data analyst with access to comprehensive data analysis results. Your role is to:

1. **Provide insightful analysis** based on the available data
2. **Suggest relevant visualizations** when appropriate
3. **Answer questions naturally** while staying focused on the data context
4. **Generate actionable insights** that help users understand their data
5. **Provide context-aware recommendations** based on the industry/category

**Available Data Context:**
- File: ${file.originalName}
- Category: ${category}
- Analysis Results: ${formattedAnalysis}

**User Question:** "${userMessage}"

**Response Guidelines:**
- Be conversational but professional
- Provide specific insights based on the data
- When suggesting visualizations, include them in JSON format
- If the question is off-topic, gently redirect to data-related topics
- Always provide value and actionable insights
- Use industry-specific terminology when relevant
- Suggest follow-up questions that might be interesting

**For Visualizations, use this format:**
\`\`\`json
{
  "type": "chart_type",
  "title": "Chart Title",
  "description": "Why this visualization is useful and what insights it provides",
  "data": [
    {"name": "Category A", "value": 100},
    {"name": "Category B", "value": 150}
  ]
}
\`\`\`

**Supported chart types:** bar, line, pie, area, scatter

**Industry-specific insights for ${category}:**
- Focus on relevant KPIs and metrics for this industry
- Suggest actionable recommendations based on industry best practices
- Consider seasonal trends and industry-specific patterns
- Provide benchmarking insights when possible

Provide a comprehensive, helpful response that addresses the user's question while leveraging the available data insights and industry context.
`;
    };

    const parseAIResponse = (text) => {
        let content = text;
        let chartData = null;

        const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
        const match = text.match(jsonRegex);

        if (match && match[1]) {
            try {
                // Remove comments from the JSON string before parsing
                const jsonString = match[1].replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
                chartData = JSON.parse(jsonString);
                content = text.replace(jsonRegex, '').trim();
            } catch (error) {
                console.error('Error parsing chart JSON from AI response:', error);
            }
        }

        return { content, chartData };
    };

    const formatMessageContent = (content) => {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/- (.*)/g, '• $1')
            .replace(/📊/g, '<span class="text-blue-600">📊</span>')
            .replace(/💡/g, '<span class="text-yellow-600">💡</span>')
            .replace(/📈/g, '<span class="text-green-600">📈</span>')
            .replace(/🔍/g, '<span class="text-purple-600">🔍</span>')
            .replace(/✅/g, '<span class="text-green-600">✅</span>')
            .replace(/❌/g, '<span class="text-red-600">❌</span>')
            .replace(/⚠️/g, '<span class="text-yellow-600">⚠️</span>')
            .replace(/🎯/g, '<span class="text-purple-600">🎯</span>')
            .replace(/📋/g, '<span class="text-blue-600">📋</span>')
            .replace(/💰/g, '<span class="text-green-600">💰</span>')
            .replace(/👥/g, '<span class="text-blue-600">👥</span>')
            .replace(/📅/g, '<span class="text-purple-600">📅</span>');
    };

    const handleSendMessage = async (promptText = input) => {
        if (!promptText.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: promptText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const enhancedPrompt = createEnhancedPrompt(promptText);
            
            const result = await model.generateContent(enhancedPrompt);
            const response = await result.response;
            const text = response.text();

            const { content, chartData } = parseAIResponse(text);
            
            const newAiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: content,
                chartSuggestions: chartData ? [chartData] : [],
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newAiMessage]);
        } catch (error) {
            console.error('Error generating response:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: 'I apologize, but I encountered an error while processing your request. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeywordClick = (keyword) => {
        setInput(keyword);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const renderChart = (suggestion) => {
        const { type, data, title } = suggestion;
        
        if (!data || data.length === 0) return null;

        switch (type) {
            case 'bar':
                return (
                    <div className="space-y-2">
                        {title && <h4 className="text-sm font-semibold text-gray-700">{title}</h4>}
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                    formatter={(value) => [value, 'Value']}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                />
                                <Bar dataKey="value" fill="#7400B8" radius={[4, 4, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );
            
            case 'pie':
                return (
                    <div className="space-y-2">
                        {title && <h4 className="text-sm font-semibold text-gray-700">{title}</h4>}
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                );
            
            case 'line':
                return (
                    <div className="space-y-2">
                        {title && <h4 className="text-sm font-semibold text-gray-700">{title}</h4>}
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                    formatter={(value) => [value, 'Value']}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#7400B8" 
                                    strokeWidth={3}
                                    dot={{ fill: '#7400B8', strokeWidth: 2, r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                );

            case 'area':
                return (
                    <div className="space-y-2">
                        {title && <h4 className="text-sm font-semibold text-gray-700">{title}</h4>}
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                    formatter={(value) => [value, 'Value']}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#7400B8" 
                                    fill="#7400B8"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                );

            case 'scatter':
                return (
                    <div className="space-y-2">
                        {title && <h4 className="text-sm font-semibold text-gray-700">{title}</h4>}
                        <ResponsiveContainer width="100%" height={200}>
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="x" type="number" />
                                <YAxis dataKey="y" type="number" />
                                <Tooltip 
                                    formatter={(value, name) => [value, name === 'x' ? 'X Value' : 'Y Value']}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                />
                                <Scatter data={data} fill="#7400B8" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                );
            
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-8"
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] p-3 sm:p-4 lg:p-6 text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </div>
                        <div>
                            <h2 className="text-sm sm:text-lg lg:text-xl font-bold">AI Data Analyst</h2>
                            <p className="text-xs sm:text-sm text-white/80 hidden sm:block">Ask me anything about your data</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-1 sm:p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                        <FiX className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </motion.button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                                        <div className={`p-3 sm:p-4 rounded-2xl ${
                                            message.type === 'user' 
                                                ? 'bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white' 
                                                : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-800'
                                        }`}>
                                            <div className="prose prose-sm sm:prose-base max-w-none">
                                                <div dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} />
                                            </div>
                                            
                                            {/* Chart Suggestions */}
                                            {message.chartSuggestions && message.chartSuggestions.length > 0 && (
                                                <div className="mt-4 space-y-3">
                                                    {message.chartSuggestions.map((suggestion, index) => (
                                                        <div key={index} className="bg-white/10 rounded-xl p-3 sm:p-4">
                                                            <div className="text-xs sm:text-sm font-medium text-white/90 mb-2 flex items-center">
                                                                <FiEye className="w-4 h-4 mr-2" />
                                                                {suggestion.title || 'Suggested Visualization'}
                                                            </div>
                                                            {suggestion.description && (
                                                                <p className="text-xs text-white/80 mb-3">{suggestion.description}</p>
                                                            )}
                                                            <div className="h-48 sm:h-56 lg:h-64">
                                                                {renderChart(suggestion)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                            {message.timestamp.toLocaleTimeString()}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {/* Loading indicator */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 sm:p-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#7400B8] border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm sm:text-base text-gray-600">AI is thinking...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested Keywords */}
                    {suggestedKeywords.length > 0 && (
                        <div className="border-t border-gray-200/50 p-3 sm:p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                <FiZap className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-gray-700">Quick Questions:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {suggestedKeywords.map((keyword, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleKeywordClick(keyword)}
                                        className="px-3 py-1.5 bg-gradient-to-r from-[#7400B8]/10 to-[#9B4DCA]/10 text-[#7400B8] rounded-full text-xs font-medium hover:from-[#7400B8]/20 hover:to-[#9B4DCA]/20 transition-all duration-200 border border-[#7400B8]/20"
                                    >
                                        {keyword}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="border-t border-gray-200/50 p-3 sm:p-4 lg:p-6">
                        <div className="flex space-x-2 sm:space-x-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me about your data..."
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7400B8] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                    disabled={isLoading}
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSendMessage()}
                                disabled={!input.trim() || isLoading}
                                className={`p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                                    input.trim() && !isLoading
                                        ? 'bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white hover:shadow-lg'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AIAnalyst; 
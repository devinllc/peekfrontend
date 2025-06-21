import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiMessageSquare, FiTrendingUp, FiBarChart2, FiPieChart, FiActivity, FiTarget, FiZap } from 'react-icons/fi';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ComposedChart, Cell, Area, AreaChart, PieChart, Pie
} from 'recharts';

const AIAnalyst = ({ analysis, file, onClose }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        generateInitialSuggestions();
    }, [messages]);

    const generateInitialSuggestions = () => {
        if (!analysis?.insights?.hypothesis) return;

        const category = file?.fileCategory || 'General';
        
        let categorySuggestions = [];
        
        switch(category) {
            case 'Retail':
                categorySuggestions = [
                    "What are the top performing products?",
                    "Show me sales trends over time",
                    "Which regions have the highest sales?",
                    "What's the customer behavior pattern?",
                    "Generate a sales forecast for next quarter"
                ];
                break;
            case 'Finance':
                categorySuggestions = [
                    "What are the key financial metrics?",
                    "Show me revenue trends by division",
                    "Which investments are performing best?",
                    "What's the risk assessment?",
                    "Generate a financial forecast"
                ];
                break;
            case 'Education':
                categorySuggestions = [
                    "Which students are performing best?",
                    "Show me attendance patterns",
                    "What subjects have the highest scores?",
                    "Which students need support?",
                    "Generate performance predictions"
                ];
                break;
            case 'Healthcare':
                categorySuggestions = [
                    "What are the most common conditions?",
                    "Show me patient demographics",
                    "Which treatments are most effective?",
                    "What's the resource utilization?",
                    "Generate health outcome predictions"
                ];
                break;
            case 'Manufacturing':
                categorySuggestions = [
                    "What's the production efficiency?",
                    "Show me quality metrics",
                    "Which production lines are best?",
                    "What's the defect rate analysis?",
                    "Generate production forecasts"
                ];
                break;
            default:
                categorySuggestions = [
                    "What are the key insights?",
                    "Show me trends in the data",
                    "What patterns do you see?",
                    "Generate recommendations",
                    "What should I focus on?"
                ];
        }

        setSuggestions(categorySuggestions);
    };

    const handleSendMessage = async (promptText = input) => {
        if (!promptText.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: promptText,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Simulate AI response with enhanced analysis
            const aiResponse = await generateAIResponse(promptText);
            
            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: aiResponse.content,
                charts: aiResponse.charts,
                insights: aiResponse.insights,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error generating AI response:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: 'Sorry, I encountered an error while processing your request. Please try again.',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const generateAIResponse = async (prompt) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const { insights, summary } = analysis;
        const { kpis, totals, trends, hypothesis } = insights;
        const category = file?.fileCategory || 'General';

        // Enhanced response generation based on prompt and data
        let response = {
            content: '',
            charts: null,
            insights: []
        };

        const promptLower = prompt.toLowerCase();

        // Generate contextual responses based on prompt keywords
        if (promptLower.includes('trend') || promptLower.includes('pattern')) {
            response.content = generateTrendAnalysis(category, insights);
            response.charts = generateTrendChart(totals, trends, category);
        } else if (promptLower.includes('top') || promptLower.includes('best') || promptLower.includes('performance')) {
            response.content = generatePerformanceAnalysis(category, insights);
            response.charts = generatePerformanceChart(totals, category);
        } else if (promptLower.includes('forecast') || promptLower.includes('predict')) {
            response.content = generateForecastAnalysis(category, insights);
            response.charts = generateForecastChart(trends, category);
        } else if (promptLower.includes('recommend') || promptLower.includes('suggest')) {
            response.content = generateRecommendations(category, insights);
            response.insights = generateActionableInsights(category, insights);
        } else {
            response.content = generateGeneralAnalysis(category, insights);
            response.charts = generateOverviewChart(totals, category);
        }

        return response;
    };

    const generateTrendAnalysis = (category, insights) => {
        const { kpis, totals } = insights;
        
        switch(category) {
            case 'Retail':
                return `Based on the sales data analysis, I can see several key trends:\n\n` +
                       `📈 **Sales Performance**: Average sales are ${kpis?.avg_sales || 'N/A'} with a maximum of ${kpis?.max_sales || 'N/A'}\n` +
                       `🌍 **Regional Trends**: ${totals?.sales_by_region?.Region?.length || 0} regions analyzed\n` +
                       `📊 **Category Performance**: ${totals?.sales_by_category?.[0]?.length || 0} product categories tracked\n\n` +
                       `The data shows consistent growth patterns with seasonal variations. Top performing regions include ${totals?.sales_by_region?.Region?.[0] || 'N/A'} and ${totals?.sales_by_region?.Region?.[1] || 'N/A'}.`;
            
            case 'Education':
                return `Educational performance analysis reveals:\n\n` +
                       `🎓 **Academic Performance**: Average score is ${kpis?.avg_score || 'N/A'} with ${kpis?.attendance_rate_avg || 'N/A'} attendance rate\n` +
                       `📚 **Subject Performance**: ${totals?.performance_by_subject?.Subject?.length || 0} subjects analyzed\n` +
                       `👥 **Student Engagement**: ${totals?.performance_by_student?.Student?.length || 0} students tracked\n\n` +
                       `Top performing subjects include ${totals?.performance_by_subject?.Subject?.[0] || 'N/A'} and ${totals?.performance_by_subject?.Subject?.[1] || 'N/A'}.`;
            
            default:
                return `Analysis of the ${category} data shows:\n\n` +
                       `📊 **Key Metrics**: ${Object.keys(kpis || {}).length} performance indicators tracked\n` +
                       `📈 **Trends**: Data spans multiple periods with clear patterns\n` +
                       `🎯 **Insights**: ${hypothesis?.length || 0} key insights identified\n\n` +
                       `The data reveals consistent patterns and opportunities for optimization.`;
        }
    };

    const generatePerformanceAnalysis = (category, insights) => {
        const { kpis, highPerformers, lowPerformers } = insights;
        
        switch(category) {
            case 'Retail':
                return `**Top Performance Analysis** 📊\n\n` +
                       `🏆 **Best Performing Categories**:\n` +
                       `${highPerformers?.top_categories?.Category?.map((cat, i) => 
                           `${i + 1}. ${cat}: ${highPerformers.top_categories.Sales[i]} sales`
                       ).join('\n') || 'No data available'}\n\n` +
                       `📈 **Key Success Factors**:\n` +
                       `• High customer engagement\n` +
                       `• Effective marketing campaigns\n` +
                       `• Strong regional presence\n` +
                       `• Quality product offerings`;
            
            case 'Education':
                return `**Academic Performance Analysis** 🎓\n\n` +
                       `🏆 **Top Students**:\n` +
                       `${highPerformers?.top_students?.Student?.map((student, i) => 
                           `${i + 1}. ${student}: ${highPerformers.top_students.Score[i]} score`
                       ).join('\n') || 'No data available'}\n\n` +
                       `📚 **Best Subjects**:\n` +
                       `${highPerformers?.top_subjects?.Subject?.map((subject, i) => 
                           `${i + 1}. ${subject}: ${highPerformers.top_subjects.Score[i]} avg score`
                       ).join('\n') || 'No data available'}`;
            
            default:
                return `**Performance Analysis** 📊\n\n` +
                       `🏆 **Top Performers**: ${highPerformers ? Object.keys(highPerformers).length : 0} categories analyzed\n` +
                       `📉 **Areas for Improvement**: ${lowPerformers ? Object.keys(lowPerformers).length : 0} categories identified\n` +
                       `📈 **Key Metrics**: ${Object.keys(kpis || {}).length} performance indicators tracked`;
        }
    };

    const generateForecastAnalysis = (category, insights) => {
        const { kpis } = insights;
        
        switch(category) {
            case 'Retail':
                return `**Sales Forecast** 🔮\n\n` +
                       `📊 **Current Performance**:\n` +
                       `• Total Sales: ${kpis?.total_sales || 'N/A'}\n` +
                       `• Average Sales: ${kpis?.avg_sales || 'N/A'}\n` +
                       `• Growth Rate: ${kpis?.growth_rate || 'N/A'}\n\n` +
                       `🔮 **Next Quarter Prediction**:\n` +
                       `• Expected Sales: ${kpis?.predicted_next_quarter_sales || 'N/A'}\n` +
                       `• Growth Projection: ${kpis?.predicted_growth || 'N/A'}\n` +
                       `• Key Drivers: Seasonal trends, marketing campaigns, product launches`;
            
            case 'Education':
                return `**Academic Forecast** 🎓\n\n` +
                       `📊 **Current Performance**:\n` +
                       `• Average Score: ${kpis?.avg_score || 'N/A'}\n` +
                       `• Attendance Rate: ${kpis?.attendance_rate_avg || 'N/A'}\n` +
                       `• Completion Rate: ${kpis?.avg_completion_rate || 'N/A'}\n\n` +
                       `🔮 **Next Year Prediction**:\n` +
                       `• Expected Score: ${kpis?.predicted_next_year_score || 'N/A'}\n` +
                       `• Improvement Areas: ${kpis?.improvement_areas || 'N/A'}\n` +
                       `• Key Factors: Student engagement, resource utilization, teaching methods`;
            
            default:
                return `**Forecast Analysis** 🔮\n\n` +
                       `📊 **Current Trends**: Based on ${Object.keys(kpis || {}).length} key metrics\n` +
                       `🔮 **Future Projections**: Positive growth trajectory expected\n` +
                       `📈 **Key Drivers**: Data-driven insights suggest continued improvement`;
        }
    };

    const generateRecommendations = (category, insights) => {
        const { kpis, lowPerformers } = insights;
        
        switch(category) {
            case 'Retail':
                return `**Strategic Recommendations** 💡\n\n` +
                       `🎯 **Immediate Actions**:\n` +
                       `• Focus on underperforming regions: ${lowPerformers?.bottom_regions?.Region?.[0] || 'N/A'}\n` +
                       `• Optimize inventory for top categories\n` +
                       `• Enhance marketing campaigns for low-performing products\n\n` +
                       `📈 **Long-term Strategy**:\n` +
                       `• Expand successful product lines\n` +
                       `• Invest in customer retention programs\n` +
                       `• Develop regional-specific strategies`;
            
            case 'Education':
                return `**Educational Recommendations** 🎓\n\n` +
                       `🎯 **Immediate Actions**:\n` +
                       `• Provide support for: ${lowPerformers?.bottom_students?.Student?.[0] || 'N/A'}\n` +
                       `• Focus on improving: ${lowPerformers?.bottom_subjects?.Subject?.[0] || 'N/A'}\n` +
                       `• Enhance resource utilization\n\n` +
                       `📈 **Long-term Strategy**:\n` +
                       `• Implement personalized learning programs\n` +
                       `• Develop comprehensive support systems\n` +
                       `• Optimize teaching methodologies`;
            
            default:
                return `**Strategic Recommendations** 💡\n\n` +
                       `🎯 **Immediate Actions**:\n` +
                       `• Address performance gaps in ${lowPerformers ? Object.keys(lowPerformers).length : 0} areas\n` +
                       `• Optimize resource allocation\n` +
                       `• Enhance monitoring systems\n\n` +
                       `📈 **Long-term Strategy**:\n` +
                       `• Implement continuous improvement programs\n` +
                       `• Develop predictive analytics capabilities\n` +
                       `• Foster data-driven decision making`;
        }
    };

    const generateGeneralAnalysis = (category, insights) => {
        const { kpis, hypothesis } = insights;
        
        return `**${category} Data Analysis** 📊\n\n` +
               `🔍 **Key Findings**:\n` +
               `• ${Object.keys(kpis || {}).length} performance metrics analyzed\n` +
               `• ${hypothesis?.length || 0} key insights identified\n` +
               `• Data quality: Excellent\n\n` +
               `📈 **Performance Overview**:\n` +
               `${Object.entries(kpis || {}).slice(0, 3).map(([key, value]) => 
                   `• ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${value}`
               ).join('\n')}\n\n` +
               `💡 **Next Steps**:\n` +
               `• Review detailed performance metrics\n` +
               `• Identify optimization opportunities\n` +
               `• Implement data-driven strategies`;
    };

    const generateActionableInsights = (category, insights) => {
        const actionableInsights = [];
        
        switch(category) {
            case 'Retail':
                actionableInsights.push(
                    { icon: '📈', title: 'Sales Optimization', description: 'Focus on top-performing categories and regions' },
                    { icon: '🎯', title: 'Inventory Management', description: 'Optimize stock levels based on demand patterns' },
                    { icon: '📊', title: 'Marketing Strategy', description: 'Target campaigns to underperforming regions' }
                );
                break;
            case 'Education':
                actionableInsights.push(
                    { icon: '🎓', title: 'Student Support', description: 'Provide additional resources to struggling students' },
                    { icon: '📚', title: 'Curriculum Enhancement', description: 'Improve teaching methods for low-performing subjects' },
                    { icon: '📈', title: 'Performance Tracking', description: 'Implement continuous monitoring systems' }
                );
                break;
            default:
                actionableInsights.push(
                    { icon: '📊', title: 'Data Analysis', description: 'Continue monitoring key performance indicators' },
                    { icon: '🎯', title: 'Process Optimization', description: 'Identify and address performance bottlenecks' },
                    { icon: '📈', title: 'Growth Strategy', description: 'Develop data-driven improvement plans' }
                );
        }
        
        return actionableInsights;
    };

    const generateTrendChart = (totals, trends, category) => {
        if (!totals || !trends) return null;

        switch(category) {
            case 'Retail':
                if (totals.sales_by_region?.Region) {
                    return {
                        type: 'bar',
                        data: totals.sales_by_region.Region.map((region, index) => ({
                            name: region,
                            sales: totals.sales_by_region.Sales[index]
                        })),
                        title: 'Sales by Region'
                    };
                }
                break;
            case 'Education':
                if (totals.performance_by_subject?.Subject) {
                    return {
                        type: 'pie',
                        data: totals.performance_by_subject.Subject.map((subject, index) => ({
                            name: subject,
                            value: totals.performance_by_subject.Score[index]
                        })),
                        title: 'Performance by Subject'
                    };
                }
                break;
        }
        return null;
    };

    const generatePerformanceChart = (totals, category) => {
        if (!totals) return null;

        switch(category) {
            case 'Retail':
                if (totals.sales_by_category?.[0]) {
                    return {
                        type: 'bar',
                        data: totals.sales_by_category[0].map((category, index) => ({
                            name: category,
                            sales: totals.sales_by_category[1][index]
                        })),
                        title: 'Sales by Category'
                    };
                }
                break;
            case 'Education':
                if (totals.performance_by_student?.Student) {
                    return {
                        type: 'bar',
                        data: totals.performance_by_student.Student.map((student, index) => ({
                            name: student,
                            score: totals.performance_by_student.Score[index]
                        })),
                        title: 'Student Performance'
                    };
                }
                break;
        }
        return null;
    };

    const generateForecastChart = (trends, category) => {
        if (!trends || !Array.isArray(trends)) return null;

        return {
            type: 'area',
            data: trends.map(trend => ({
                date: trend.date,
                value: trend.total || trend.avg || trend.avg_value
            })),
            title: 'Trend Analysis'
        };
    };

    const generateOverviewChart = (totals, category) => {
        if (!totals) return null;

        // Return the first available chart data
        const chartData = totals.sales_by_region || totals.performance_by_student || totals.sales_by_category;
        if (chartData) {
            return {
                type: 'bar',
                data: Object.values(chartData)[0].map((item, index) => ({
                    name: item,
                    value: Object.values(chartData)[1]?.[index] || 0
                })),
                title: 'Overview'
            };
        }
        return null;
    };

    const renderChart = (chartData) => {
        if (!chartData) return null;

        const { type, data, title } = chartData;

        switch(type) {
            case 'bar':
                return (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                    formatter={(value) => [value.toLocaleString(), title]}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                />
                                <Bar dataKey="value" fill="#7400B8" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );
            
            case 'pie':
                return (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#7400B8', '#9B4DCA', '#C77DFF', '#E0AAFF'][index % 4]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                );
            
            case 'area':
                return (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7400B8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#7400B8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#7400B8" fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                );
            
            default:
                return null;
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl h-[80vh] flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-2xl flex items-center justify-center">
                            <FiMessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">AI Analyst</h2>
                            <p className="text-sm text-gray-600">Ask questions about your {file?.fileCategory || 'data'}</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                        <FiX className="w-6 h-6 text-gray-600" />
                    </motion.button>
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && messages.length === 0 && (
                    <div className="p-6 border-b border-gray-200/50">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiZap className="w-5 h-5 text-[#7400B8]" />
                            Suggested Questions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {suggestions.map((suggestion, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSendMessage(suggestion)}
                                    className="p-3 text-left bg-gradient-to-r from-[#F9F4FF] to-white rounded-xl border border-[#7400B8]/10 hover:border-[#7400B8]/30 transition-all duration-200"
                                >
                                    <p className="text-sm text-gray-700">{suggestion}</p>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Suggestions */}
                    {suggestions.length > 0 && messages.length === 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FiZap className="w-5 h-5 text-[#7400B8]" />
                                Suggested Questions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {suggestions.map((suggestion, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSendMessage(suggestion)}
                                        className="p-3 text-left bg-gradient-to-r from-[#F9F4FF] to-white rounded-xl border border-[#7400B8]/10 hover:border-[#7400B8]/30 transition-all duration-200"
                                    >
                                        <p className="text-sm text-gray-700">{suggestion}</p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-[#7400B8] text-white' : 'bg-white/80 backdrop-blur-sm border border-gray-200'} rounded-2xl p-4 shadow-lg`}>
                                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                                
                                {/* Charts */}
                                {message.charts && (
                                    <div className="mt-4 p-4 bg-white/50 rounded-xl">
                                        <h4 className="font-semibold text-gray-800 mb-3">{message.charts.title}</h4>
                                        {renderChart(message.charts)}
                                    </div>
                                )}
                                
                                {/* Insights */}
                                {message.insights && message.insights.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        <h4 className="font-semibold text-gray-800">Actionable Insights:</h4>
                                        {message.insights.map((insight, index) => (
                                            <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#F9F4FF] to-white rounded-xl border border-[#7400B8]/10">
                                                <span className="text-lg">{insight.icon}</span>
                                                <div>
                                                    <h5 className="font-medium text-gray-800">{insight.title}</h5>
                                                    <p className="text-sm text-gray-600">{insight.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="text-xs opacity-70 mt-2">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-[#7400B8] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm text-gray-600">AI is analyzing your data...</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 border-t border-gray-200/50">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about your data..."
                                className="w-full p-4 pr-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#7400B8] focus:border-transparent transition-all duration-200"
                                rows={1}
                                style={{ minHeight: '60px', maxHeight: '120px' }}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSendMessage()}
                            disabled={!input.trim() || isLoading}
                            className="px-6 py-4 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white rounded-2xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <FiSend className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AIAnalyst; 
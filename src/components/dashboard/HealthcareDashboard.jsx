import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiHeart, FiUsers, FiBarChart2, FiActivity, FiCpu, FiMessageSquare, FiTarget, FiArrowUp, FiArrowDown, FiCalendar } from 'react-icons/fi';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ComposedChart, Cell, Area, AreaChart, PieChart, Pie
} from 'recharts';
import AIAnalyst from './AIAnalyst';

const HealthcareDashboard = ({ file, analysis }) => {
    const [isAiChatOpen, setIsAiChatOpen] = useState(false);

    if (!file || !analysis) {
        return (
            <div className="text-center p-8">
                <p>No analysis data available for this file.</p>
            </div>
        );
    }

    const { originalName } = file;
    
    // Enhanced color palette for pie charts
    const pieColors = [
        '#7400B8', '#9B4DCA', '#C77DFF', '#E0AAFF', '#4e389f',
        '#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#4e389f',
        '#7C3AED', '#9333EA', '#A855F7', '#C084FC', '#4e389f'
    ];

    const { summary, insights } = analysis;
    const { kpis, highPerformers, lowPerformers, hypothesis, totals, trends } = insights;

    // Helper function to format numbers
    const formatNumber = (value) => {
        return typeof value === 'number' ? value.toLocaleString() : value;
    };

    // Helper function to format percentage
    const formatPercentage = (value) => {
        if (typeof value === 'string' && value.includes('%')) {
            return value;
        }
        return `${parseFloat(value).toFixed(2)}%`;
    };

    // Get summary fields dynamically
    const summaryFields = Object.keys(summary || {}).map(fieldName => {
        const fieldData = summary[fieldName];
        return {
            name: fieldName,
            min: fieldData?.min || 0,
            max: fieldData?.max || 0,
            mean: fieldData?.mean || 0,
            median: fieldData?.median || 0
        };
    });

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 p-4 sm:p-6 lg:p-8"
            >
                {/* Key Performance Indicators */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FiTrendingUp className="w-6 h-6 text-[#7400B8]" />
                        Key Performance Indicators
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 bg-gradient-to-br from-[#F9F4FF] to-white rounded-2xl border border-[#7400B8]/10 hover:border-[#7400B8]/20 transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[#7400B8]/10 flex items-center justify-center">
                                    <FiHeart className="w-5 h-5 text-[#7400B8]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Cases</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#7400B8]">{formatNumber(kpis?.total_cases || 0)}</p>
                            <p className="text-xs text-green-600 mt-2 flex items-center">
                                <FiArrowUp className="w-3 h-3 mr-1" />
                                {formatPercentage(kpis?.avg_cases || 0)} avg
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 bg-gradient-to-br from-[#F9F4FF] to-white rounded-2xl border border-[#7400B8]/10 hover:border-[#7400B8]/20 transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[#7400B8]/10 flex items-center justify-center">
                                    <FiTarget className="w-5 h-5 text-[#7400B8]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg Cases</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#7400B8]">{formatNumber(kpis?.avg_cases || 0)}</p>
                            <p className="text-xs text-blue-600 mt-2 flex items-center">
                                <FiArrowUp className="w-3 h-3 mr-1" />
                                {formatPercentage(kpis?.median_cases || 0)} median
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-6 bg-gradient-to-br from-[#F9F4FF] to-white rounded-2xl border border-[#7400B8]/10 hover:border-[#7400B8]/20 transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[#7400B8]/10 flex items-center justify-center">
                                    <FiBarChart2 className="w-5 h-5 text-[#7400B8]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Max Cases</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#7400B8]">{formatNumber(kpis?.max_cases || 0)}</p>
                            <p className="text-xs text-purple-600 mt-2 flex items-center">
                                <FiArrowUp className="w-3 h-3 mr-1" />
                                Peak recorded
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 bg-gradient-to-br from-[#F9F4FF] to-white rounded-2xl border border-[#7400B8]/10 hover:border-[#7400B8]/20 transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[#7400B8]/10 flex items-center justify-center">
                                    <FiActivity className="w-5 h-5 text-[#7400B8]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Next Year Forecast</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#7400B8]">{kpis?.predicted_next_year_cases || 'N/A'}</p>
                            <p className="text-xs text-orange-600 mt-2 flex items-center">
                                <FiArrowUp className="w-3 h-3 mr-1" />
                                Predicted cases
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Performance Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Performers */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FiTrendingUp className="w-6 h-6 text-[#7400B8]" />
                            Top Performing Regions
                        </h3>
                        <div className="space-y-4">
                            {highPerformers?.top_regions?.map((region, index) => (
                                <motion.div
                                    key={region.Region}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-white rounded-2xl border border-green-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{region.Region}</p>
                                            <p className="text-sm text-gray-600">{region.Cases} cases</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-green-600">{region.Cases}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Low Performers */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FiTrendingDown className="w-6 h-6 text-[#7400B8]" />
                            Low Performing Regions
                        </h3>
                        <div className="space-y-4">
                            {lowPerformers?.bottom_regions?.map((region, index) => (
                                <motion.div
                                    key={region.Region}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-white rounded-2xl border border-red-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{region.Region}</p>
                                            <p className="text-sm text-gray-600">{region.Cases} cases</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-red-600">{region.Cases}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Cases by Region Chart */}
                    {totals?.cases_by_regions && Array.isArray(totals.cases_by_regions) && totals.cases_by_regions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiUsers className="w-6 h-6 text-[#7400B8]" />
                                Cases by Region
                            </h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart
                                        data={totals.cases_by_regions}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="Region" />
                                        <YAxis />
                                        <Tooltip 
                                            formatter={(value) => [value.toLocaleString(), 'Cases']}
                                            labelStyle={{ color: '#7400B8' }}
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #f0f0f0',
                                                borderRadius: '12px',
                                                padding: '12px',
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Legend />
                                        <Bar 
                                            dataKey="Cases" 
                                            fill="#7400B8" 
                                            radius={[8, 8, 0, 0]}
                                            barSize={40}
                                        >
                                            {totals.cases_by_regions.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={`rgba(116, 0, 184, ${0.3 + (index * 0.15)})`} />
                                            ))}
                                        </Bar>
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}

                    {/* Cases by Condition Chart */}
                    {totals?.cases_by_conditions && Array.isArray(totals.cases_by_conditions) && totals.cases_by_conditions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiBarChart2 className="w-6 h-6 text-[#7400B8]" />
                                Cases by Condition
                            </h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={totals.cases_by_conditions}
                                            dataKey="Cases"
                                            nameKey="Condition"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            fill="#8884d8"
                                            labelLine={false}
                                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                                const RADIAN = Math.PI / 180;
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                return (
                                                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                                        {`${(percent * 100).toFixed(0)}%`}
                                                    </text>
                                                );
                                            }}
                                        >
                                            {totals.cases_by_conditions.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value, name) => [value.toLocaleString(), name]}
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #f0f0f0',
                                                borderRadius: '12px',
                                                padding: '12px',
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Trends Analysis */}
                {trends && Array.isArray(trends) && trends.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FiTrendingUp className="w-6 h-6 text-[#7400B8]" />
                            Cases Trend Analysis
                        </h3>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={trends}
                                    margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7400B8" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#7400B8" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value) => [value.toLocaleString(), 'Cases']}
                                        labelStyle={{ color: '#7400B8' }}
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="total" 
                                        stroke="#7400B8" 
                                        fill="url(#colorCases)" 
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}

                {/* Data Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                >
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FiCalendar className="w-6 h-6 text-[#7400B8]" />
                        Data Analytics Summary
                    </h3>
                    <p className="text-gray-600 mb-6">Statistical overview of healthcare metrics</p>
                    
                    <div className="mb-6">
                        <p className="text-sm text-gray-600">Metrics analyzed: <span className="font-semibold text-[#7400B8]">{summaryFields.length}</span></p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {summaryFields.map((field, index) => (
                            <motion.div
                                key={field.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-gradient-to-br from-[#F9F4FF] to-white rounded-2xl border border-[#7400B8]/10 hover:border-[#7400B8]/20 transition-all duration-200"
                            >
                                <h4 className="font-semibold text-gray-800 mb-3 capitalize">
                                    {field.name.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Min:</span>
                                        <span className="font-medium text-[#7400B8]">{formatNumber(field.min)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Max:</span>
                                        <span className="font-medium text-[#7400B8]">{formatNumber(field.max)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mean:</span>
                                        <span className="font-medium text-[#7400B8]">{formatNumber(field.mean)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Median:</span>
                                        <span className="font-medium text-[#7400B8]">{formatNumber(field.median)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* AI Insights Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FiCpu className="w-6 h-6 text-[#7400B8]" />
                            AI-Powered Insights
                        </h3>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAiChatOpen(true)}
                            className="px-4 py-2 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium"
                        >
                            <FiMessageSquare className="w-4 h-4" />
                            <span>Ask AI</span>
                        </motion.button>
                    </div>
                    
                    {/* Hypothesis */}
                    {hypothesis && Array.isArray(hypothesis) && (
                        <div className="mb-6">
                            <h4 className="font-bold text-gray-800 mb-3">Analysis Summary:</h4>
                            <div className="space-y-2">
                                {hypothesis.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-[#7400B8] mt-0.5">•</span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {isAiChatOpen && (
                    <AIAnalyst
                        file={file}
                        analysis={analysis}
                        onClose={() => setIsAiChatOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default HealthcareDashboard; 
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiBarChart2, FiActivity, FiCpu, FiMessageSquare, FiPieChart, FiTarget, FiArrowUp, FiArrowDown, FiArrowRight, FiAlertCircle, FiCheckCircle, FiInfo, FiCalendar } from 'react-icons/fi';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ComposedChart, Cell, Area, AreaChart, PieChart, Pie
} from 'recharts';
import AIAnalyst from './AIAnalyst';

const FinanceDashboard = ({ file, analysis }) => {
    const [isAiChatOpen, setIsAiChatOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [selectedMetric, setSelectedMetric] = useState('revenue');

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
        '#7400B8', '#9B4DCA', '#C77DFF', '#E0AAFF', '#F8F4FF',
        '#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#F3E8FF',
        '#7C3AED', '#9333EA', '#A855F7', '#C084FC', '#DDD6FE'
    ];

    const { summary, insights } = analysis;
    const { kpis, highPerformers, lowPerformers, hypothesis, totals, trends } = insights;

    // Helper function to format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
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

    // Create chart data for revenue by division
    const divisionChartData = totals?.revenue_by_Division || [];

    // Create trend data
    const trendData = trends || [];

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
                                    <FiDollarSign className="w-5 h-5 text-[#7400B8]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#7400B8]">{formatCurrency(kpis?.total_revenue || 0)}</p>
                            <p className="text-xs text-green-600 mt-2 flex items-center">
                                <FiArrowUp className="w-3 h-3 mr-1" />
                                {formatPercentage(kpis?.revenue_growth_rate_avg || 0)} growth
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
                                    <p className="text-sm font-medium text-gray-600">Net Profit</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#7400B8]">{formatCurrency(kpis?.net_profit || 0)}</p>
                            <p className="text-xs text-blue-600 mt-2 flex items-center">
                                <FiArrowUp className="w-3 h-3 mr-1" />
                                {((kpis?.net_profit / kpis?.total_revenue) * 100).toFixed(1)}% margin
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
                                    <p className="text-sm font-medium text-gray-600">Avg Revenue</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#7400B8]">{formatCurrency(kpis?.avg_revenue || 0)}</p>
                            <p className="text-xs text-purple-600 mt-2 flex items-center">
                                <FiArrowUp className="w-3 h-3 mr-1" />
                                {formatPercentage(kpis?.revenue_growth_rate_median || 0)} median
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
                                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#7400B8]">{formatCurrency(kpis?.total_expenses || 0)}</p>
                            <p className="text-xs text-orange-600 mt-2 flex items-center">
                                <FiArrowDown className="w-3 h-3 mr-1" />
                                {((kpis?.total_expenses / kpis?.total_revenue) * 100).toFixed(1)}% of revenue
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Revenue Forecast */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-2xl flex items-center justify-center">
                                <FiTrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Revenue Forecast</h2>
                                <p className="text-gray-600">Next period projection and growth analysis</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Forecast Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center p-4 bg-gradient-to-br from-[#F9F4FF] to-white rounded-2xl border border-[#7400B8]/10">
                            <p className="text-sm text-gray-600 mb-2">Current Period</p>
                            <p className="text-2xl font-bold text-gray-800">{formatCurrency(kpis?.total_revenue || 0)}</p>
                            <p className="text-xs text-gray-500 mt-1">Total revenue this period</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-[#F9F4FF] to-white rounded-2xl border border-[#7400B8]/10">
                            <p className="text-sm text-gray-600 mb-2">Growth Rate</p>
                            <p className="text-2xl font-bold text-green-600">{formatPercentage(kpis?.revenue_growth_rate_avg || 0)}</p>
                            <p className="text-xs text-gray-500 mt-1">Average growth trend</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-[#F9F4FF] to-white rounded-2xl border border-[#7400B8]/10">
                            <p className="text-sm text-gray-600 mb-2">Next Period Forecast</p>
                            <p className="text-2xl font-bold text-[#7400B8]">{formatCurrency(kpis?.revenue_forecast_next_period || 0)}</p>
                            <p className="text-xs text-gray-500 mt-1">Projected revenue</p>
                        </div>
                    </div>

                
                </motion.div>


                {/* Revenue by Division Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-2xl flex items-center justify-center">
                                <FiPieChart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Revenue Distribution</h2>
                                <p className="text-gray-600">Revenue breakdown across all divisions</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-[#7400B8]">{formatCurrency(kpis?.total_revenue || 0)}</p>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Pie Chart */}
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={divisionChartData.map((division, index) => ({
                                            name: division.Division,
                                            value: division.Total_Amount_Received
                                        }))}
                                        cx="50%"
                                        cy="50%"
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
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {divisionChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value, name) => [formatCurrency(value), name]}
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Division Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Division Breakdown</h3>
                            <div className="space-y-3 max-h-[320px] overflow-y-auto">
                                {divisionChartData.map((division, index) => (
                                    <motion.div
                                        key={division.Division}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200/50 hover:border-[#7400B8]/20 transition-all duration-200"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div 
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: pieColors[index % pieColors.length] }}
                                            ></div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{division.Division}</p>
                                                <p className="text-sm text-gray-600">
                                                    {((division.Total_Amount_Received / (kpis?.total_revenue || 1)) * 100).toFixed(1)}% of total
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">{formatCurrency(division.Total_Amount_Received)}</p>
                                            <p className="text-xs text-gray-500">Revenue</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Revenue by Division - Bar Chart */}
                    {divisionChartData.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiBarChart2 className="w-6 h-6 text-[#7400B8]" />
                                Revenue by Division
                            </h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart
                                        data={divisionChartData.map((division, index) => ({
                                            name: division.Division,
                                            revenue: division.Total_Amount_Received,
                                            trend: division.Total_Amount_Received * 0.8
                                        }))}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="name" />
                                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                        <Tooltip 
                                            formatter={(value, name) => [
                                                formatCurrency(value),
                                                name === 'revenue' ? 'Revenue' : 'Trend'
                                            ]}
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
                                            dataKey="revenue" 
                                            fill="#7400B8" 
                                            radius={[8, 8, 0, 0]}
                                            barSize={40}
                                        >
                                            {divisionChartData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={`rgba(116, 0, 184, ${0.3 + (index * 0.15)})`} />
                                            ))}
                                        </Bar>
                                        <Line 
                                            type="monotone" 
                                            dataKey="trend" 
                                            stroke="#9B4DCA" 
                                            strokeWidth={3}
                                            dot={{ fill: '#9B4DCA', strokeWidth: 2, r: 6 }}
                                            activeDot={{ r: 10 }}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}

                    {/* Performance Comparison */}
                    {highPerformers?.top_Division && lowPerformers?.bottom_Division && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiTrendingUp className="w-6 h-6 text-[#7400B8]" />
                                Performance Comparison
                            </h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart
                                        data={[
                                            ...highPerformers.top_Division.map((div, index) => ({
                                                name: div.Division,
                                                revenue: div.Total_Amount_Received,
                                                type: 'Top Performer',
                                                rank: index + 1
                                            })),
                                            ...lowPerformers.bottom_Division.map((div, index) => ({
                                                name: div.Division,
                                                revenue: div.Total_Amount_Received,
                                                type: 'Bottom Performer',
                                                rank: -(index + 1)
                                            }))
                                        ]}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="name" />
                                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                        <Tooltip 
                                            formatter={(value, name) => [
                                                formatCurrency(value),
                                                name === 'revenue' ? 'Revenue' : name
                                            ]}
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
                                            dataKey="revenue" 
                                            fill="#7400B8" 
                                            radius={[8, 8, 0, 0]}
                                            barSize={40}
                                        >
                                            {[...highPerformers.top_Division, ...lowPerformers.bottom_Division].map((_, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={index < highPerformers.top_Division.length ? '#7400B8' : '#9B4DCA'} 
                                                />
                                            ))}
                                        </Bar>
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </div>

            
                {/* Data Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-2xl flex items-center justify-center">
                                <FiActivity className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Data Analytics Summary</h2>
                                <p className="text-gray-600">Statistical overview of financial metrics</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-[#7400B8]">{summaryFields.length}</p>
                            <p className="text-sm text-gray-600">Metrics Analyzed</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {summaryFields.map((field, index) => (
                            <motion.div
                                key={field.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                                className="p-6 bg-gradient-to-br from-[#F9F4FF] to-white rounded-2xl border border-[#7400B8]/10 hover:border-[#7400B8]/20 transition-all duration-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-800 capitalize">{field.name.replace(/_/g, ' ')}</h3>
                                    <div className="w-8 h-8 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-lg flex items-center justify-center">
                                        <FiBarChart2 className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Minimum</span>
                                        <span className="font-semibold text-gray-800">{formatCurrency(field.min)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Maximum</span>
                                        <span className="font-semibold text-[#7400B8]">{formatCurrency(field.max)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Average</span>
                                        <span className="font-semibold text-green-600">{formatCurrency(field.mean)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Median</span>
                                        <span className="font-semibold text-blue-600">{formatCurrency(field.median)}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Range</span>
                                        <span className="text-xs font-medium text-gray-700">
                                            {formatCurrency(field.max - field.min)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* AI Insights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-2xl flex items-center justify-center">
                                <FiCpu className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">AI-Powered Insights</h2>
                                <p className="text-gray-600">Key findings and recommendations</p>
                            </div>
                        </div>
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
                    {hypothesis && hypothesis.length > 0 && (
                        <div className="text-gray-700 space-y-4 prose prose-purple max-w-none">
                            <h4 className="font-bold text-lg">Key Insights:</h4>
                            <ul className="list-disc list-inside space-y-2">
                                {hypothesis.map((insight, index) => (
                                    <li key={index} className="text-gray-700">{insight}</li>
                                ))}
                            </ul>
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

export default FinanceDashboard; 
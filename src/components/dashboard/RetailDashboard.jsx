import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiUsers, FiBarChart2, FiShoppingCart, FiCpu, FiMessageSquare } from 'react-icons/fi';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ComposedChart, Cell, Area, AreaChart, PieChart, Pie
} from 'recharts';
import AIAnalyst from './AIAnalyst';

const RetailDashboard = ({ file, analysis }) => {
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
        '#7400B8', '#9B4DCA', '#C77DFF', '#E0AAFF', '#F8F4FF',
        '#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#F3E8FF',
        '#7C3AED', '#9333EA', '#A855F7', '#C084FC', '#DDD6FE'
    ];

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 p-4 sm:p-6 lg:p-8"
            >
                {/* KPIs Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FiTrendingUp className="w-6 h-6 text-[#7400B8]" />
                        Key Performance Indicators
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {analysis.insights.kpis && Object.entries(analysis.insights.kpis).map(([key, value], index) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 bg-gradient-to-br from-[#F9F4FF] to-white rounded-2xl border border-[#7400B8]/10 hover:border-[#7400B8]/20 transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#7400B8]/10 flex items-center justify-center">
                                        <FiDollarSign className="w-5 h-5 text-[#7400B8]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-[#7400B8]">
                                    {key.includes('total') || key.includes('avg') || key.includes('median') ? 
                                      `₹${typeof value === 'number' ? value.toLocaleString() : value}` : 
                                      typeof value === 'number' ? value.toLocaleString() : value}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Sales by Region */}
                    {analysis.insights.totals?.sales_by_region?.Region &&
                     Array.isArray(analysis.insights.totals.sales_by_region.Region) &&
                     Array.isArray(analysis.insights.totals.sales_by_region.Sales) &&
                     analysis.insights.totals.sales_by_region.Region.length > 0 &&
                     analysis.insights.totals.sales_by_region.Sales.length === analysis.insights.totals.sales_by_region.Region.length && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiUsers className="w-6 h-6 text-[#7400B8]" />
                                Sales by Region
                            </h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart
                                        data={analysis.insights.totals.sales_by_region.Region.map((region, index) => ({
                                            name: region,
                                            sales: analysis.insights.totals.sales_by_region.Sales[index],
                                            trend: analysis.insights.totals.sales_by_region.Sales[index] * 0.8
                                        }))}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip 
                                            formatter={(value, name) => [
                                                `₹${value.toLocaleString()}`,
                                                name === 'sales' ? 'Sales' : 'Trend'
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
                                            dataKey="sales" 
                                            fill="#7400B8" 
                                            radius={[8, 8, 0, 0]}
                                            barSize={40}
                                        >
                                            {analysis.insights.totals.sales_by_region.Region.map((_, index) => (
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

                    {/* Sales by Region/Category */}
                    {analysis.insights.totals?.sales_by_category &&
                     Array.isArray(analysis.insights.totals.sales_by_category) &&
                     analysis.insights.totals.sales_by_category.length >= 2 &&
                     Array.isArray(analysis.insights.totals.sales_by_category[0]) &&
                     Array.isArray(analysis.insights.totals.sales_by_category[1]) &&
                     analysis.insights.totals.sales_by_category[0].length > 0 &&
                     analysis.insights.totals.sales_by_category[0].length === analysis.insights.totals.sales_by_category[1].length && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiBarChart2 className="w-6 h-6 text-[#7400B8]" />
                                Sales by Category
                            </h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart
                                        data={analysis.insights.totals.sales_by_category[0].map((category, index) => ({
                                            name: category,
                                            sales: analysis.insights.totals.sales_by_category[1][index],
                                            trend: analysis.insights.totals.sales_by_category[1][index] * 0.8 + Math.random() * 0.4 * analysis.insights.totals.sales_by_category[1][index]
                                        }))}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip 
                                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
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
                                            dataKey="sales" 
                                            fill="#7400B8" 
                                            radius={[8, 8, 0, 0]}
                                            barSize={40}
                                        >
                                            {analysis.insights.totals.sales_by_category[0].map((_, index) => (
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

                    {/* Sales by Category - Pie Chart */}
                    {analysis.insights.totals?.sales_by_category &&
                     Array.isArray(analysis.insights.totals.sales_by_category) &&
                     analysis.insights.totals.sales_by_category.length >= 2 &&
                     Array.isArray(analysis.insights.totals.sales_by_category[0]) &&
                     Array.isArray(analysis.insights.totals.sales_by_category[1]) &&
                     analysis.insights.totals.sales_by_category[0].length > 0 &&
                     analysis.insights.totals.sales_by_category[0].length === analysis.insights.totals.sales_by_category[1].length && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiBarChart2 className="w-6 h-6 text-[#7400B8]" />
                                Sales Distribution by Category
                            </h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analysis.insights.totals.sales_by_category[0].map((category, index) => ({
                                                name: category,
                                                value: analysis.insights.totals.sales_by_category[1][index]
                                            }))}
                                            dataKey="value"
                                            nameKey="name"
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
                                            {analysis.insights.totals.sales_by_category[0].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
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
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}

                    {/* Sales Over Time */}
                    {analysis.insights.trends?.sales_over_time?.Date &&
                     Array.isArray(analysis.insights.trends.sales_over_time.Date) &&
                     Array.isArray(analysis.insights.trends.sales_over_time.Sales) &&
                     analysis.insights.trends.sales_over_time.Date.length > 0 &&
                     analysis.insights.trends.sales_over_time.Sales.length === analysis.insights.trends.sales_over_time.Date.length && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 xl:col-span-2"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiShoppingCart className="w-6 h-6 text-[#7400B8]" />
                                Sales Over Time
                            </h3>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={analysis.insights.trends.sales_over_time.Date.map((date, index) => ({
                                            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                            sales: analysis.insights.trends.sales_over_time.Sales[index]
                                        }))}
                                        margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#7400B8" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#7400B8" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip 
                                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
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
                                            dataKey="sales" 
                                            stroke="#7400B8" 
                                            fill="url(#colorSales)" 
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Insights Section */}
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
                    {analysis.insights?.summary && (
                        <div className="text-gray-700 space-y-4 prose prose-purple max-w-none">
                            <p>{analysis.insights.summary.replace("Sure, here is your summary:", "").trim()}</p>
                            
                            {analysis.insights.recommendations && (
                                <div>
                                    <h4 className="font-bold">Recommendations:</h4>
                                    <ul className="list-disc list-inside">
                                        {analysis.insights.recommendations.map((rec, index) => (
                                            <li key={index}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
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

export default RetailDashboard; 
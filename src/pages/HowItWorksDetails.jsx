import { motion } from 'framer-motion';
import { FiCopy, FiDownload, FiCheck, FiArrowLeft, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

const HowItWorksDetails = () => {
    const [copiedColumn, setCopiedColumn] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});
    const [copiedColumns, setCopiedColumns] = useState({});

    const copyToClipboard = (text, key) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedColumns(prev => ({
                ...prev,
                [key]: true
            }));
            
            // Reset the copied state after 2 seconds
            setTimeout(() => {
                setCopiedColumns(prev => ({
                    ...prev,
                    [key]: false
                }));
            }, 2000);
            
            toast.success(`"${text}" copied to clipboard!`);
        }).catch(() => {
            toast.error('Failed to copy to clipboard');
        });
    };

    const industryColumns = {
        retail: {
            title: "Retail Analytics",
            description: "Perfect for e-commerce, retail stores, and sales data analysis",
            columns: {
                quantity: ['qty', 'quantity', 'units sold', 'unitsold', 'sold quantity', 'sold_qty', 'order quantity', 'order_qty', 'qty sold'],
                unitPrice: ['unit price', 'unitprice', 'unit cost', 'unitcost', 'price', 'price per unit', 'rate', 'cost per item', 'item price'],
                sales: ['total', 'amount', 'sales', 'sale', 'revenue', 'gross sale', 'net sale', 'invoice value', 'total revenue', 'totalamount', 'total price', 'total_price', 'order value'],
                profit: ['profit', 'gross profit', 'net profit', 'profit margin', 'profit ($)', 'profit amount', 'margin'],
                cost: ['cost', 'purchase cost', 'total cost', 'purchase price', 'cost per unit', 'unit cost'],
                loss: ['loss', 'net loss', 'negative profit'],
                category: ['category', 'product', 'item', 'brand', 'segment', 'product category', 'sub category', 'subcategory'],
                region: ['region', 'area', 'zone', 'territory', 'location', 'market'],
                date: ['date', 'order date', 'timestamp', 'sale date', 'datetime', 'transaction date'],
                customer: ['customer', 'customer id', 'client', 'user', 'customer name', 'client id', 'user id'],
                returnFlag: ['return', 'returned', 'is return', 'is_return', 'returned (y/n)', 'return status', 'was returned', 'isreturned'],
                promotionFlag: ['promo', 'discount', 'promotion', 'promotion applied (y/n)', 'is_discounted', 'discount applied', 'discountflag']
            }
        },
        manufacturing: {
            title: "Manufacturing Analytics",
            description: "Ideal for production data, quality control, and operational efficiency",
            columns: {
                prodCol: ['produce', 'unit', 'output', 'volume', 'production', 'unitproduced', 'unitsproduced', 'product_id'],
                costCol: ['cost', 'expense', 'spend', 'productioncost', 'repair_cost'],
                qualityCol: ['defect', 'quality', 'reject', 'scrap', 'defectrate', 'defect_id'],
                machineCol: ['machine', 'downtime', 'uptime', 'maintenance', 'machineuptime', 'machinedowntime', 'machinemaintenance'],
                leadTimeCol: ['leadtime', 'delivery', 'supply'],
                materialCol: ['material', 'raw', 'input'],
                energyCol: ['energy', 'power', 'electricity'],
                laborCol: ['labor', 'workforce', 'staff', 'manpower'],
                dateCol: ['date', 'period', 'time', 'timestamp', 'month', 'defect_date']
            }
        },
        finance: {
            title: "Financial Analytics",
            description: "Perfect for financial statements, transactions, and revenue analysis",
            columns: {
                revenueCol: ['revenue', 'sales', 'amount', 'income', 'checking', 'transaction'],
                expenseCol: ['expense', 'cost', 'spend', 'debit', 'withdrawal'],
                dateCol: ['date', 'timestamp', 'period', 'time', 'month', 'year'],
                metricCol: ['metric', 'type', 'category', 'label'],
                customerCol: ['customer', 'client', 'user', 'sme', 'enterprise', 'retail']
            }
        },
        education: {
            title: "Education Analytics",
            description: "Ideal for academic performance, student data, and institutional metrics",
            columns: {
                scoreCol: ['score', 'marks', 'grade', 'result', 'performance'],
                studentCol: ['student', 'name', 'learner'],
                subjectCol: ['subject', 'course', 'class'],
                dateCol: ['year', 'date', 'month', 'timestamp'],
                attendanceCol: ['attendance', 'present', 'absent', 'attendancerate'],
                completionCol: ['completion', 'status', 'coursecompleted', 'completionrate'],
                resourceCol: ['resource', 'usage', 'time', 'hour', 'videos'],
                teacherCol: ['teacher', 'instructor', 'faculty'],
                budgetCol: ['budget', 'cost', 'expenditure'],
                alumniCol: ['alumni', 'employed', 'career', 'placement'],
                infrastructureCol: ['lab', 'library', 'facility', 'infrastructure'],
                enrollmentCol: ['enrollment', 'registered', 'join'],
                dropoutCol: ['dropout', 'retention', 'left']
            }
        },
        healthcare: {
            title: "Healthcare Analytics",
            description: "Perfect for patient data, medical records, and healthcare metrics",
            columns: {
                admissionCol: ['admission', 'visit', 'encounter', 'number'],
                departmentCol: ['department', 'unit', 'ward'],
                diseaseCol: ['disease', 'diagnosis', 'condition', 'icd'],
                treatmentCol: ['treatment', 'therapy', 'procedure'],
                outcomeCol: ['outcome', 'result', 'status'],
                bedCol: ['bed', 'occupancy', 'room', 'number'],
                staffCol: ['staff', 'nurse', 'doctor', 'personnel'],
                equipmentCol: ['equipment', 'machine', 'device'],
                insuranceCol: ['insurance', 'payer', 'claim'],
                medicationCol: ['medication', 'drug', 'prescription', 'rx'],
                dateCol: ['date', 'admission date', 'timestamp', 'period']
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#7400B8]/5 via-[#9B4DCA]/5 to-[#C77DFF]/5">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-[#7400B8] hover:text-[#9B4DCA] transition-colors mb-4">
                        <FiArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Back to Home</span>
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">How PeekBI Works: Complete Guide</h1>
                    <p className="text-xl text-gray-600">Everything you need to know about using PeekBI for data analysis</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Article */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview Section */}
                        <motion.div
                            className="bg-white rounded-2xl p-8 shadow-lg border border-[#7400B8]/10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold text-[#7400B8] mb-4">What is PeekBI?</h2>
                            <p className="text-gray-700 mb-4">
                                PeekBI is an AI-powered data analysis platform that transforms your raw data into actionable insights. 
                                Whether you're analyzing sales data, financial reports, or operational metrics, PeekBI provides 
                                instant visualizations and recommendations to help you make data-driven decisions.
                            </p>
                            <p className="text-gray-700">
                                Our platform uses advanced machine learning algorithms to automatically detect patterns, 
                                identify trends, and generate comprehensive reports tailored to your industry and data structure.
                            </p>
                        </motion.div>

                        {/* How It Works Process */}
                        <motion.div
                            className="bg-white rounded-2xl p-8 shadow-lg border border-[#7400B8]/10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h2 className="text-2xl font-bold text-[#7400B8] mb-6">The PeekBI Process</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Data Upload & Processing</h3>
                                        <p className="text-gray-600">Upload your Excel, CSV, or other data files. PeekBI automatically detects your data structure and prepares it for analysis.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">AI Analysis & Pattern Recognition</h3>
                                        <p className="text-gray-600">Our AI algorithms analyze your data to identify trends, correlations, and insights specific to your industry.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">3</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Insight Generation</h3>
                                        <p className="text-gray-600">Generate comprehensive reports with charts, summaries, and actionable recommendations based on your data.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">4</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Export & Share</h3>
                                        <p className="text-gray-600">Download your reports as PDFs, share insights with your team, or integrate results into your existing workflows.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Best Practices */}
                        <motion.div
                            className="bg-white rounded-2xl p-8 shadow-lg border border-[#7400B8]/10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold text-[#7400B8] mb-6">Best Practices for Optimal Results</h2>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <FiCheck className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Use Consistent Column Names</h3>
                                        <p className="text-gray-600">Follow the recommended column naming conventions for your industry to ensure accurate analysis.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FiCheck className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Clean Your Data</h3>
                                        <p className="text-gray-600">Remove duplicates, fix formatting issues, and ensure data consistency before uploading.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FiCheck className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Include Date Columns</h3>
                                        <p className="text-gray-600">Date information helps PeekBI identify trends and seasonal patterns in your data.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FiCheck className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Use Sample Files First</h3>
                                        <p className="text-gray-600">Start with our industry-specific sample files to understand the expected format and results.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Column Names & Downloads */}
                    <div className="space-y-6">
                        {/* Sample Files */}
                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-lg border border-[#7400B8]/10"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h3 className="text-xl font-bold text-[#7400B8] mb-4">Sample Files</h3>
                            <div className="space-y-3">
                                {Object.entries(industryColumns).map(([key, industry]) => (
                                    <a
                                        key={key}
                                        href={`/files/${key}_sample_peekbi.xlsx`}
                                        download
                                        className="block w-full px-4 py-3 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white rounded-lg font-semibold text-center hover:from-[#9B4DCA] hover:to-[#C77DFF] transition-all flex items-center justify-center gap-2"
                                    >
                                        <FiDownload className="w-4 h-4" />
                                        {industry.title}
                                    </a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Column Names by Industry */}
                        {Object.entries(industryColumns).map(([key, industry], index) => (
                            <motion.div
                                key={key}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-[#7400B8]/10"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-[#7400B8]">{industry.title}</h3>
                                    <button
                                        onClick={() => setExpandedSections(prev => ({
                                            ...prev,
                                            [key]: !prev[key]
                                        }))}
                                        className="text-[#7400B8] hover:text-[#9B4DCA] transition-colors"
                                    >
                                        {expandedSections[key] ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                                    </button>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">{industry.description}</p>
                                
                                {expandedSections[key] && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        {Object.entries(industry.columns).map(([colKey, columns]) => (
                                            <div key={colKey} className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-800 mb-2 capitalize">
                                                    {colKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {columns.map((col, colIndex) => (
                                                        <motion.button
                                                            key={`${key}-${colKey}-${colIndex}`}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => copyToClipboard(col, `${key}-${colKey}-${colIndex}`)}
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                                                                copiedColumns[`${key}-${colKey}-${colIndex}`]
                                                                    ? 'bg-green-100 text-green-700 border-green-300'
                                                                    : 'bg-white text-[#7400B8] border-[#7400B8] hover:bg-[#7400B8] hover:text-white'
                                                            }`}
                                                        >
                                                            {col}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksDetails; 
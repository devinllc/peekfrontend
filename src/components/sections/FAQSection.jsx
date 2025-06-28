import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiZap, FiUsers, FiBarChart2, FiCreditCard, FiMessageSquare, FiDownload, FiUpload, FiCpu, FiHelpCircle } from 'react-icons/fi';

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: 'How do I get started with PeekBI?',
            answer: 'Getting started with PeekBI is simple and takes just a few minutes. First, create your account by providing basic information like your name, email, and business type. Choose a subscription plan that fits your needs - we offer a free trial with no credit card required. Once registered, you can immediately upload your data files (Excel, CSV, or other formats) and start analyzing. Our AI will automatically process your data and provide instant insights, charts, and recommendations. You can also explore our sample files to see how the platform works before uploading your own data.',
            icon: <FiZap className="w-6 h-6" />
        },
        {
            question: 'What types of data files does PeekBI support?',
            answer: 'PeekBI supports a wide range of data file formats including Excel (.xlsx, .xls), CSV files, JSON, and text files. For best results, we recommend using structured data with clear column headers. The platform automatically detects your data type and applies industry-specific analysis. We provide sample files for different industries (retail, finance, healthcare, education, manufacturing) that you can download and use as templates. Each industry has specific column requirements that you can copy directly from our platform to ensure optimal analysis results.',
            icon: <FiUpload className="w-6 h-6" />
        },
        {
            question: 'How does PeekBI ensure my data security and privacy?',
            answer: 'Data security is our top priority. PeekBI employs enterprise-grade security measures including end-to-end encryption for data in transit and at rest, regular security audits, and compliance with industry standards like GDPR, HIPAA, and SOC 2. Your data is processed in secure, isolated environments and is never shared with third parties. We implement strict access controls, regular backups, and comprehensive logging. All data processing is done in compliance with international privacy regulations, and you maintain full ownership of your data. You can request data deletion at any time, and we provide detailed information about how your data is used.',
            icon: <FiShield className="w-6 h-6" />
        },
        {
            question: 'What insights and analytics does PeekBI provide?',
            answer: 'PeekBI provides comprehensive analytics including key performance indicators (KPIs), trend analysis, anomaly detection, and predictive insights. The platform automatically generates interactive charts, graphs, and dashboards tailored to your industry. You\'ll receive detailed summaries of your data, identify top and bottom performers, discover patterns and correlations, and get actionable recommendations. Our AI assistant can answer specific questions about your data and generate custom visualizations. The platform also provides comparative analysis, seasonal trend detection, and forecasting capabilities to help you make data-driven decisions.',
            icon: <FiBarChart2 className="w-6 h-6" />
        },
        {
            question: 'How does the AI assistant work and what can I ask it?',
            answer: 'The AI assistant is an intelligent chatbot that understands your data and can answer questions in natural language. You can ask questions like "What are my top performing products?", "Show me sales trends by region", "Identify seasonal patterns", or "Compare performance across different periods". The AI analyzes your uploaded data and provides detailed responses with relevant charts and insights. It can detect anomalies, suggest improvements, and help you understand complex patterns in your data. The assistant learns from your interactions and provides increasingly relevant insights over time. You can also ask it to generate custom reports or export specific data views.',
            icon: <FiCpu className="w-6 h-6" />
        },
        {
            question: 'What kind of customer support do you provide?',
            answer: 'We provide comprehensive customer support through multiple channels. All users have access to email support and our extensive knowledge base with tutorials, guides, and best practices. Professional and Enterprise plan subscribers receive priority support with faster response times. Enterprise customers get dedicated account managers and phone support. We also offer live chat support during business hours, video tutorials, webinars, and regular training sessions. Our support team consists of data analytics experts who can help you with technical questions, data preparation, analysis interpretation, and platform optimization. We typically respond to support requests within 24 hours, with priority support receiving responses within 4 hours.',
            icon: <FiHelpCircle className="w-6 h-6" />
        },
        {
            question: 'How accurate are the AI-generated insights and predictions?',
            answer: 'PeekBI\'s AI insights are highly accurate, leveraging advanced machine learning algorithms trained on diverse business datasets. The accuracy depends on the quality and quantity of your data - we recommend having at least 30-50 data points for reliable analysis. The platform provides confidence scores for predictions and clearly indicates when insights are based on limited data. Our AI continuously learns and improves from user feedback and new data patterns. For critical business decisions, we recommend using the AI insights as guidance while applying your domain expertise. The platform also includes data validation features to help ensure data quality and flag potential issues that might affect analysis accuracy.',
            icon: <FiMessageSquare className="w-6 h-6" />
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-gradient-to-br from-[#F9F4FF] to-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-[40rem] h-[40rem] bg-[#7400B8] rounded-full mix-blend-multiply filter blur-3xl opacity-[0.05]"></div>
                <div className="absolute bottom-1/4 left-1/4 w-[45rem] h-[45rem] bg-[#9B4DCA] rounded-full mix-blend-multiply filter blur-3xl opacity-[0.05]"></div>
            </div>

            <div className="container mx-auto px-4 max-w-[1000px] relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Everything you need to know about getting started, using features, and maximizing the value of PeekBI for your business analytics needs.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "50px" }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <button
                                className={`w-full text-left p-6 flex justify-between items-center focus:outline-none transition-all duration-300 ${
                                    activeIndex === index 
                                        ? 'bg-gradient-to-r from-[#7400B8]/10 to-[#9B4DCA]/10 border-b border-[#7400B8]/20' 
                                        : 'hover:bg-gradient-to-r hover:from-[#7400B8]/5 hover:to-[#9B4DCA]/5'
                                }`}
                                onClick={() => toggleFAQ(index)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                        activeIndex === index 
                                            ? 'bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white' 
                                            : 'bg-[#F9F4FF] text-[#7400B8]'
                                    }`}>
                                        {faq.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</h3>
                                </div>
                                <svg
                                    className={`w-6 h-6 text-[#7400B8] transform transition-transform duration-300 flex-shrink-0 ${
                                        activeIndex === index ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-gray-700 bg-gradient-to-r from-[#F9F4FF]/50 to-white/50 border-t border-[#7400B8]/10">
                                            <div className="prose prose-lg max-w-none">
                                                <p className="leading-relaxed text-base">{faq.answer}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Still have questions?</h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Our expert support team is here to help you get the most out of PeekBI. 
                            Whether you need technical assistance, have questions about your data, or want to explore advanced features, we're ready to assist.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white px-8 py-3 rounded-xl text-lg font-medium hover:from-[#9B4DCA] hover:to-[#C77DFF] transition-all duration-300 shadow-lg hover:shadow-xl">
                                Contact Support
                            </button>
                            <button className="bg-white text-[#7400B8] border-2 border-[#7400B8] px-8 py-3 rounded-xl text-lg font-medium hover:bg-[#7400B8] hover:text-white transition-all duration-300">
                                Schedule Demo
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;
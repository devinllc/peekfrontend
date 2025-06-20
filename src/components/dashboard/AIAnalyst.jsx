import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCpu, FiMessageSquare, FiX, FiInfo, FiKey } from 'react-icons/fi';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- IMPORTANT: API Key Configuration ---
// It's recommended to use environment variables to store your API key securely.
// 1. Create a .env file in the root of your project.
// 2. Add your API key to the .env file: VITE_GEMINI_API_KEY=YOUR_API_KEY
// 3. Make sure your build process (e.g., Vite) is configured to handle .env files.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const AIAnalyst = ({ analysis, file, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const chatEndRef = useRef(null);

    const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

    useEffect(() => {
        if (!API_KEY) {
            setError('Gemini API key is not configured. Please add it to your .env file.');
        }
        // Initial message from AI
        setMessages([
            {
                sender: 'ai',
                text: `Hello! I'm your AI Data Analyst. I have the analysis summary for **${file.originalName}**. How can I help you today?`,
            },
        ]);
    }, [file.originalName]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const suggestedPrompts = [
        "What are the top 3 key trends in this data?",
        "Summarize the customer behavior based on the analysis.",
        "Which areas are underperforming and why?",
        "Suggest three actionable strategies to improve performance.",
    ];

    const handleSendMessage = async (promptText = input) => {
        if (!promptText.trim() || isLoading) return;

        if (!API_KEY || !genAI) {
            setError('Cannot send message. Gemini API key is not configured.');
            return;
        }

        const userMessage = { sender: 'user', text: promptText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const fullPrompt = `
                You are a professional data analyst. You are assisting a user with analyzing their data.
                The file they have uploaded is named "${file.originalName}" and it is from the "${file.fileCategory}" industry.

                Here is the JSON summary of the data analysis that has already been performed:
                \`\`\`json
                ${JSON.stringify(analysis, null, 2)}
                \`\`\`

                Based on this data, please answer the user's question. Be insightful, clear, and provide actionable advice where possible.
                Format your response using markdown for better readability (e.g., use headings, lists, bold text).

                User's question: "${promptText}"
            `;

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();
            
            const aiMessage = { sender: 'ai', text };
            setMessages(prev => [...prev, aiMessage]);

        } catch (err) {
            console.error("Error calling Gemini API:", err);
            const errorMessage = "Sorry, I encountered an error trying to process your request. Please check your API key and network connection.";
            setError(errorMessage);
            setMessages(prev => [...prev, { sender: 'ai', text: errorMessage, isError: true }]);
        } finally {
            setIsLoading(false);
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 w-[450px] h-[600px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 flex flex-col z-50 overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-between bg-white/50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-xl flex items-center justify-center">
                        <FiCpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">AI Data Analyst</h3>
                        <p className="text-xs text-gray-600">Powered by Gemini</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-200/50"
                >
                    <FiX />
                </motion.button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                        >
                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-full flex items-center justify-center flex-shrink-0">
                                    <FiCpu className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <div className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl ${
                                msg.sender === 'user'
                                    ? 'bg-[#7400B8] text-white rounded-br-none'
                                    : `bg-gray-100 text-gray-800 rounded-bl-none ${msg.isError ? 'bg-red-100 text-red-800' : ''}`
                            }`}>
                                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                            </div>
                            {msg.sender === 'user' && (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-gray-600 font-bold">
                                    U
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && (
                     <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                    >
                        <div className="w-8 h-8 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] rounded-full flex items-center justify-center flex-shrink-0">
                            <FiCpu className="w-5 h-5 text-white" />
                        </div>
                        <div className="max-w-xs md:max-w-sm px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={chatEndRef} />
            </div>
            
            {/* Suggested Prompts */}
            {!isLoading && messages.length < 3 && (
                <div className="px-4 pb-2">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Suggested Prompts:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedPrompts.map(prompt => (
                            <motion.button
                                key={prompt}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSendMessage(prompt)}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                            >
                                {prompt}
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200/50 bg-white/50">
                {error && (
                     <div className="p-2 mb-2 bg-red-100 border border-red-200 rounded-lg text-red-800 text-xs flex items-center gap-2">
                        <FiInfo />
                        <span>{error}</span>
                        {!API_KEY && (
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-medium flex items-center gap-1">
                                <FiKey className="w-3 h-3"/> Get API Key
                            </a>
                        )}
                    </div>
                )}
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a question about your data..."
                        className="w-full pl-4 pr-12 py-3 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7400B8] resize-none"
                        rows={1}
                        style={{ maxHeight: '80px', overflowY: 'auto' }}
                        disabled={isLoading || !API_KEY}
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSendMessage()}
                        disabled={isLoading || !input.trim() || !API_KEY}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiArrowRight className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default AIAnalyst; 
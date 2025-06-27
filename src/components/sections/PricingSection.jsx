import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';
// Add this import at the top with the other imports
import { useNavigate } from 'react-router-dom';
gsap.registerPlugin(ScrollTrigger);

const PLAN_DEFAULTS = {
    free: {
        price: 0,
        billingInterval: 'monthly',
        limits: {
            uploads: 10,
            download: 5,
            analyse: 3,
            aiPromts: 5,
            reports: 2,
            charts: 5,
            maxUsersPerAccount: 1,
            dataRetentionDays: 7,
        },
        features: {
            scheduleReports: false,
            exportAsPDF: false,
            shareableDashboards: false,
            emailSupport: true,
            prioritySupport: false,
        },
    },
    premium: {
        price: 99,
        billingInterval: 'monthly',
        limits: {
            uploads: 100,
            download: 50,
            analyse: 30,
            aiPromts: 50,
            reports: 20,
            charts: 50,
            maxUsersPerAccount: 5,
            dataRetentionDays: 30,
        },
        features: {
            scheduleReports: true,
            exportAsPDF: true,
            shareableDashboards: true,
            emailSupport: true,
            prioritySupport: false,
        },
    },
    enterprise: {
        price: 499,
        billingInterval: 'monthly',
        limits: {
            uploads: 1000,
            download: 500,
            analyse: 300,
            aiPromts: 500,
            reports: 200,
            charts: 500,
            maxUsersPerAccount: 100,
            dataRetentionDays: 365,
        },
        features: {
            scheduleReports: true,
            exportAsPDF: true,
            shareableDashboards: true,
            emailSupport: true,
            prioritySupport: true,
        },
    }
};

const pricingPlans = [
    {
        name: 'Starter',
        planKey: 'free',
        highlighted: false,
        buttonText: 'Start Free Trial',
        description: 'Perfect for small businesses and startups',
    },
    {
        name: 'Professional',
        planKey: 'premium',
        highlighted: true,
        buttonText: 'Start Free Trial',
        description: 'Ideal for growing businesses',
    },
    {
        name: 'Enterprise',
        planKey: 'enterprise',
        highlighted: false,
        buttonText: 'Contact Sales',
        description: 'For large organizations with complex needs',
    },
];

const PricingSection = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        gsap.utils.toArray('.pricingCard').forEach(pricingCard=>{
            gsap.to(pricingCard,{
                scale:0.7,
                opacity:0,
                scrollTrigger:{
                  trigger:pricingCard,
                  start:"top 15",
                  end:"bottom 15",
                //   markers:true,
                  scrub:true,
                }
            })
        })
    })

    return (
        <section className="py-24 bg-white"> {/* Changed to white background */}
            <div className="container flex flex-col items-center mx-auto px-4 max-w-[1200px]">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-bold mb-4 text-gray-800">Simple, Transparent Pricing</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose the plan that's right for your business</p>
                </motion.div>

                <div className="flex card flex-col gap-[20vh] md:w-[30%] pb-[20vh] items-center">
                    {pricingPlans.map((plan, index) => (
                        <motion.div 
                            key={index}
                            className={`pricingCard sticky top-[15vh] rounded-2xl overflow-hidden shadow-lg relative ${plan.highlighted ? 'border-2 border-[#7400B8] transform scale-105' : 'border border-gray-200'}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {plan.highlighted && (
                                <div className="bg-[#7400B8] text-white text-center py-2 font-medium">
                                    Most Popular
                                </div>
                            )}
                            <div className="p-8 bg-white content-center sticky top-[15vh] items-center relative group overflow-hidden">
                                {/* Gradient Background - matching hero card design */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#7400B8] to-[#9B4DCA] opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                                    <p className="text-gray-600 mb-6">{plan.description}</p>
                                    <div className="mb-6">
                                        <span className="text-5xl font-bold text-gray-800">{plan.planKey === 'free' ? '₹0' : `₹${PLAN_DEFAULTS[plan.planKey].price}`}</span>
                                        <span className="text-gray-600">/month</span>
                                    </div>
                                    <ul className="space-y-4 mb-8">
                                        {Object.entries(PLAN_DEFAULTS[plan.planKey].features).map(([feature, enabled]) => (
                                            <li key={feature} className="flex items-start">
                                                <FiCheck className="text-[#7400B8] mt-1 mr-3 flex-shrink-0" />
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        className={`w-full py-3 px-6 rounded-full font-medium transition-all duration-300 ${plan.highlighted ? 'bg-[#7400B8] text-white hover:bg-[#8B2CD9]' : 'bg-white text-[#7400B8] border-2 border-[#7400B8] hover:bg-[#7400B8] hover:text-white'
                                            
                                        }` }     
                                        onClick={() => navigate(`/user/profile?plan=${plan.planKey}`)}
                                    >
                                        {plan.buttonText}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
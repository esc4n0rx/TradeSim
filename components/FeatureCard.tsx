"use client";

import { motion } from "framer-motion";
import { DivideIcon, HomeIcon, StarIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

export const FeatureCard = ({ title, description, icon: Icon }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="glassmorphism p-6 rounded-lg relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#00f7ff]/10 to-[#6d28d9]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Icon className="w-12 h-12 text-[#00f7ff]" />
      </motion.div>
      
      <h3 className="text-xl font-bold mb-2 gradient-text">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

const features = [
  {
    title: "Divisão Inteligente",
    description: "Automatize suas operações com nossa ferramenta avançada.",
    icon: DivideIcon, 
  },
  {
    title: "Home Seguro",
    description: "Proteja suas informações com nosso sistema de segurança.",
    icon: HomeIcon, 
  },
  {
    title: "Estrelato",
    description: "Destaque-se com os melhores recursos disponíveis.",
    icon: StarIcon, 
  },
];

export default function FeaturesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
        />
      ))}
    </motion.div>
  );
}

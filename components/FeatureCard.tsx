"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart,
  DivideIcon,
  HomeIcon,
  LineChart,
  PieChart,
  StarIcon,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LineChart: LineChart,
  PieChart: PieChart,
  Activity: Activity,
  BarChart: BarChart,
  DivideIcon: DivideIcon,
  HomeIcon: HomeIcon,
  StarIcon: StarIcon,
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType | string;
}

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {

  const IconComponent: React.ElementType =
    typeof icon === "string" ? iconMap[icon] || StarIcon : icon;

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
        <IconComponent className="w-12 h-12 text-[#00f7ff]" />
      </motion.div>

      <h3 className="text-xl font-bold mb-2 gradient-text">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

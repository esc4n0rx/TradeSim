"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useUser } from "@/contexts/UserContext";




export const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center"
          >
            <TrendingUp className="w-8 h-8 text-[#00f7ff]" />
            <span className="ml-2 text-2xl font-bold gradient-text">
              TradeSim
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden md:flex items-center space-x-4"
          >
            {user ? (
              <span className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                Olá, {user.nome}
              </span>
            ) : (
              <>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#00f7ff] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#00f7ff] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Portfólio
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#00f7ff] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Mercado
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#00f7ff] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Análise
                </a>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

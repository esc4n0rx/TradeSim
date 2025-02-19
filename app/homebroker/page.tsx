'use client';

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, LineChart, DollarSign, Clock, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function HomeBroker(): JSX.Element {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100">

      <Navbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Home Broker
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Simule operações de compra e venda no mercado financeiro e teste suas estratégias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-cyan-400">Seu Portfólio</h2>
              <LineChart className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="mt-4 text-gray-400">
              Visualize o desempenho dos seus investimentos simulados.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 bg-[#00f7ff] hover:bg-[#00f7ff]/90 text-black font-bold py-2 px-4 rounded transition-colors"
            >
              Ver Detalhes
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-cyan-400">Simulação de Operações</h2>
              <DollarSign className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="mt-4 text-gray-400">
              Execute operações simuladas de compra e venda para testar suas estratégias.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 bg-[#00f7ff] hover:bg-[#00f7ff]/90 text-black font-bold py-2 px-4 rounded transition-colors"
            >
              Simular Operação
            </button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism p-8 rounded-lg text-center mt-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
            Comece sua Simulação no Home Broker
          </h2>
          <p className="text-gray-400 mb-6">
            Experimente comprar e vender ativos em um ambiente simulado para aprimorar suas estratégias de investimento.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-[#00f7ff] hover:bg-[#00f7ff]/90 text-black font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Iniciar Simulação
          </button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

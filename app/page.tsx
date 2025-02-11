"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { StockTicker } from "@/components/StockTicker";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { LoginModal } from "@/components/LoginModal";
import { RegisterModal } from "@/components/RegisterModal";

const features = [
  {
    title: "Simulação em Tempo Real",
    description:
      "Pratique trading com dados do mercado em tempo real sem riscos financeiros.",
    icon: "LineChart",
  },
  {
    title: "Portfólio Personalizado",
    description:
      "Crie e gerencie sua carteira de investimentos virtual com diversos ativos.",
    icon: "PieChart",
  },
  {
    title: "Análise Técnica",
    description:
      "Ferramentas avançadas de análise técnica para tomada de decisões.",
    icon: "Activity",
  },
  {
    title: "Dados Históricos",
    description:
      "Acesse histórico completo de preços e indicadores para análise profunda.",
    icon: "BarChart",
  },
];

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const ctaButtons = user ? (
    <button
      onClick={() => router.push("/dashboard")}
      className="bg-[#00f7ff] hover:bg-[#00f7ff]/90 text-black font-bold py-3 px-8 rounded-lg transition-colors"
    >
      Vamos Começar
    </button>
  ) : (
    <div className="mt-6 flex justify-center gap-4">
      <button
        onClick={() => setShowRegister(true)}
        className="bg-[#00f7ff] hover:bg-[#00f7ff]/90 text-black font-bold py-3 px-8 rounded-lg transition-colors"
      >
        Criar Conta Gratuita
      </button>
      <button
        onClick={() => setShowLogin(true)}
        className="border border-[#00f7ff] hover:bg-[#00f7ff]/10 text-[#00f7ff] font-bold py-3 px-8 rounded-lg transition-colors"
      >
        Login
      </button>
    </div>
  );

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Bem-vindo ao TradeSim
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Aprenda a investir com segurança usando dados reais do mercado em um
            ambiente sem riscos.
          </p>
          {ctaButtons}
        </motion.div>

        <StockTicker />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism p-8 rounded-lg text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
            Comece sua jornada no mercado financeiro
          </h2>
          <p className="text-gray-400 mb-6">
            Pratique estratégias de investimento sem arriscar seu dinheiro real.
          </p>
          {ctaButtons}
        </motion.div>
      </div>

      <Footer />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </main>
  );
}

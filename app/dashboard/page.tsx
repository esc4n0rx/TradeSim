'use client';

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Footer } from "@/components/Footer";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import {
  LineChart,
  TrendingUp,
  Wallet,
  DollarSign,
  Bitcoin,
  BarChart3,
  Clock,
  AlertTriangle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Cria o cliente do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Tipos para os ativos usados no modal de Ativos
interface StockAsset {
  symbol: string;
  name: string;
  price: number;
  change: string;
}

interface FundAsset {
  symbol: string;
  name: string;
  price: number;
  change: string;
}

interface FixedAsset {
  name: string;
  rate: string;
  duration: string;
}

interface Assets {
  stocks: StockAsset[];
  funds: FundAsset[];
  fixed: FixedAsset[];
}

// Componente Modal com transição suave
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-[#1a1a1a] rounded-lg border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-100">{title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Conteúdo do modal de Ativos
function AssetsContent() {
  const [activeFilter, setActiveFilter] = useState<keyof Assets>("stocks");
  const assets: Assets = {
    stocks: [
      { symbol: "PETR4", name: "Petrobras PN", price: 32.08, change: "+1.75%" },
      { symbol: "VALE3", name: "Vale ON", price: 68.25, change: "-0.42%" },
      { symbol: "ITUB4", name: "Itaú PN", price: 32.9, change: "+0.88%" },
    ],
    funds: [
      { symbol: "HGLG11", name: "CGHG Logística", price: 160.5, change: "+0.32%" },
      { symbol: "KNRI11", name: "Kinea Renda", price: 142.75, change: "-0.15%" },
    ],
    fixed: [
      { name: "CDB Banco XYZ", rate: "12.5% a.a.", duration: "2 anos" },
      { name: "Tesouro IPCA+", rate: "IPCA + 5.5%", duration: "2026" },
    ],
  };

  return (
    <div>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveFilter("stocks")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === "stocks" ? "bg-cyan-400 text-black" : "bg-[#242424] text-gray-400"
          }`}
        >
          Ações
        </button>
        <button
          onClick={() => setActiveFilter("funds")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === "funds" ? "bg-cyan-400 text-black" : "bg-[#242424] text-gray-400"
          }`}
        >
          Fundos
        </button>
        <button
          onClick={() => setActiveFilter("fixed")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === "fixed" ? "bg-cyan-400 text-black" : "bg-[#242424] text-gray-400"
          }`}
        >
          Renda Fixa
        </button>
      </div>
      <div className="space-y-4">
        {activeFilter === "fixed"
          ? assets.fixed.map((asset, index) => (
              <div key={index} className="bg-[#242424] p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-100">{asset.name}</h3>
                  <p className="text-sm text-gray-400">Vencimento: {asset.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-cyan-400">{asset.rate}</p>
                </div>
              </div>
            ))
          : assets[activeFilter].map((asset, index) => (
              <div key={index} className="bg-[#242424] p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-100">{asset.symbol}</h3>
                  <p className="text-sm text-gray-400">{asset.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-100">R$ {asset.price.toFixed(2)}</p>
                  <p className={`text-sm ${asset.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                    {asset.change}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

// Conteúdo do modal de Criptomoedas
function CryptoContent() {
  const cryptos = [
    { symbol: "BTC", name: "Bitcoin", price: 252480.5, change: "+2.3%" },
    { symbol: "ETH", name: "Ethereum", price: 12750.75, change: "+1.8%" },
    { symbol: "BNB", name: "Binance Coin", price: 1580.25, change: "-0.5%" },
  ];

  return (
    <div>
      <div className="space-y-4">
        {cryptos.map((crypto, index) => (
          <div key={index} className="bg-[#242424] p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-100">{crypto.symbol}</h3>
              <p className="text-sm text-gray-400">{crypto.name}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-100">R$ {crypto.price.toFixed(2)}</p>
              <p className={`text-sm ${crypto.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                {crypto.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Conteúdo do modal de Day Trade
function DaytradeContent() {
  return (
    <div className="text-center py-12">
      <Clock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2">Em Desenvolvimento</h3>
      <p className="text-gray-400">
        O módulo de Day Trade está sendo implementado e estará disponível em breve.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user, setUser } = useUser();
  const router = useRouter();

  // Remove os dados mock: busca as informações reais da conta do usuário do Supabase
  const [accountInfo, setAccountInfo] = useState<{
    saldo_investido: number;
    saldo_disponivel: number;
    saldo_bloqueado: number;
    saldo_total: number;
  } | null>(null);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<
    Array<{ symbol: string; price: string; change: string; changeColor: string }>
  >([]);

  // Busca os dados reais da conta usando o CPF do usuário
  useEffect(() => {
    async function fetchAccountInfo() {
      if (user && user.cpf) {
        const { data, error } = await supabase
          .from("user_accounts")
          .select("*")
          .eq("cpf", user.cpf)
          .limit(1)
          .single();
        if (error) {
          console.error("Erro ao buscar dados da conta:", error.message);
        } else if (data) {
          const saldo_total = Number(data.saldo_investido) + Number(data.saldo_disponivel);
          setAccountInfo({
            saldo_investido: Number(data.saldo_investido),
            saldo_disponivel: Number(data.saldo_disponivel),
            saldo_bloqueado: Number(data.saldo_bloqueado),
            saldo_total,
          });
        }
      }
    }
    fetchAccountInfo();
  }, [user]);

  useEffect(() => {
    async function fetchMarketData() {
      try {
        const res = await fetch("https://api.hgbrasil.com/finance");
        const data = await res.json();
        console.log(data);
        const currencies = data.results?.currencies;
        if (currencies) {
          const md = Object.keys(currencies)
            .filter((key) => key !== "source")
            .map((key) => {
              const curr = currencies[key];
              const variation = Number(curr.variation);
              const change = variation > 0 ? `+${variation}%` : `${variation}%`;
              const changeColor =
                variation > 0 ? "text-green-400" : variation < 0 ? "text-red-400" : "text-gray-400";
              const price = `R$ ${Number(curr.buy).toFixed(2)}`;
              return { symbol: key, price, change, changeColor };
            });
          setMarketData(md);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da API de finance:", error);
      }
    }
    fetchMarketData();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100">
      {/* Top Navigation */}
      <nav className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
              <span className="ml-2 text-xl font-bold text-cyan-400">TradeSim</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/homebroker")}
                className="px-4 py-2 bg-cyan-400 text-black rounded-lg hover:bg-cyan-500 transition-colors"
              >
                Home Broker
              </button>
              <span className="text-sm text-gray-400">Bem-vindo, {user?.nome}</span>
              <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center">
                {user?.nome ? user.nome.charAt(0) : "?"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Market Ticker */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {marketData.length > 0
              ? marketData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                    <span className="font-medium">{item.symbol}</span>
                    <span>{item.price}</span>
                    <span className={item.changeColor}>{item.change}</span>
                  </div>
                ))
              : "Carregando dados..."}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {accountInfo ? (
            <>
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400">Saldo Total</h3>
                  <Wallet className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-2xl font-bold">R$ {accountInfo.saldo_total.toLocaleString("pt-BR")}</p>
                <span className="text-green-400 text-sm">+2.5% hoje</span>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400">Saldo Investido</h3>
                  <LineChart className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-2xl font-bold">R$ {accountInfo.saldo_investido.toLocaleString("pt-BR")}</p>
                <span className="text-gray-400 text-sm">
                  {((accountInfo.saldo_investido / accountInfo.saldo_total) * 100).toFixed(1)}% do total
                </span>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400">Saldo Disponível</h3>
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-2xl font-bold">R$ {accountInfo.saldo_disponivel.toLocaleString("pt-BR")}</p>
                <span className="text-gray-400 text-sm">
                  {((accountInfo.saldo_disponivel / accountInfo.saldo_total) * 100).toFixed(1)}% do total
                </span>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400">Saldo Bloqueado</h3>
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold">R$ {accountInfo.saldo_bloqueado.toLocaleString("pt-BR")}</p>
                <span className="text-gray-400 text-sm">13.3% do total</span>
              </div>
            </>
          ) : (
            "Carregando informações da conta..."
          )}
        </div>

        {/* Trading Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setActiveModal("assets")}
            className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 hover:border-cyan-400 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold group-hover:text-cyan-400">Ativos</h3>
              <BarChart3 className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-gray-400">Gerencie sua carteira de ações e fundos de investimento</p>
          </div>

          <div
            onClick={() => setActiveModal("daytrade")}
            className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 hover:border-cyan-400 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold group-hover:text-cyan-400">Day Trade</h3>
              <Clock className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-gray-400">Realize operações de day trade com análise em tempo real</p>
          </div>

          <div
            onClick={() => setActiveModal("crypto")}
            className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 hover:border-cyan-400 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold group-hover:text-cyan-400">Cripto</h3>
              <Bitcoin className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-gray-400">Invista em criptomoedas com segurança e liquidez</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 mt-8">
          <h2 className="text-xl font-bold mb-4">Seu Perfil de Investidor</h2>
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-[#242424] rounded-lg">
              <p className="text-gray-400">Perfil</p>
              <p className="text-lg font-bold text-cyan-400">{user?.perfil_investidor}</p>
            </div>
            <div className="p-4 bg-[#242424] rounded-lg">
              <p className="text-gray-400">Experiência</p>
              <p className="text-lg font-bold text-cyan-400">{user?.experiencia_investimento || "Não definido"}</p>
            </div>
            <div className="flex-1 p-4 bg-[#242424] rounded-lg">
              <p className="text-gray-400">Objetivo</p>
              <p className="text-lg font-bold text-cyan-400">{user?.objetivo_investimento || "Não definido"}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modais com transição suave */}
      <Modal isOpen={activeModal === "assets"} onClose={() => setActiveModal(null)} title="Ativos Disponíveis">
        <AssetsContent />
      </Modal>
      <Modal isOpen={activeModal === "daytrade"} onClose={() => setActiveModal(null)} title="Day Trade">
        <DaytradeContent />
      </Modal>
      <Modal isOpen={activeModal === "crypto"} onClose={() => setActiveModal(null)} title="Criptomoedas">
        <CryptoContent />
      </Modal>

      <Footer />
    </div>
  );
}

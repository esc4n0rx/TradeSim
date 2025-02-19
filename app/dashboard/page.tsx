'use client';

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import coinList from "@/lib/coin.json";
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


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export interface StockAsset {
  stock: string; 
  name: string;
  close: number; 
  change: number; 
  volume: number;
  market_cap: number;
  logo: string;
  sector: string;
  type: string;
}

export interface CryptoAsset {
  coin: string;
  coinName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  marketCap: number;
  coinImageUrl: string;
  usedInterval: string;
  usedRange: string;
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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
function Modal({ isOpen, onClose, title, children }: ModalProps): JSX.Element {
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

interface AssetsContentProps {
  stocks: StockAsset[];
  onBuy: (asset: StockAsset) => void;
}
function AssetsContent({ stocks, onBuy }: AssetsContentProps): JSX.Element {
  const [selectedSector, setSelectedSector] = useState<string>("all");

  const filteredStocks =
    selectedSector === "all"
      ? stocks
      : stocks.filter(
          (stock) => stock.sector.toLowerCase() === selectedSector.toLowerCase()
        );

  const sectors = Array.from(new Set(stocks.map((stock) => stock.sector))).sort();

  return (
    <div>
      <div className="mb-4">
        <label className="text-gray-100 font-medium mr-2">Filtrar por setor:</label>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="p-2 bg-[#242424] text-gray-100 border border-gray-600 rounded"
        >
          <option value="all">Todos</option>
          {sectors.map((sector, index) => (
            <option key={index} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>
      <div className="max-h-96 overflow-y-auto space-y-4">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock, index) => (
            <div key={index} className="bg-[#242424] p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={stock.logo} alt={stock.name} className="w-8 h-8" />
                <div>
                  <h3 className="font-medium text-gray-100">{stock.stock}</h3>
                  <p className="text-sm text-gray-400">{stock.name}</p>
                  <p className="text-xs text-gray-400">Setor: {stock.sector}</p>
                  <p className="text-xs text-gray-400">
                    Volume: {stock.volume ? stock.volume.toLocaleString("pt-BR") : "0"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Market Cap: R$ {(stock.market_cap ?? 0).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-medium text-gray-100">R$ {stock.close.toFixed(2)}</p>
                <p
                  className={`text-sm ${
                    stock.change > 0 ? "text-green-400" : stock.change < 0 ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  {stock.change.toFixed(2)}%
                </p>
                <button
                  onClick={() => onBuy(stock)}
                  className="mt-2 px-2 py-1 bg-cyan-400 text-black text-sm rounded hover:bg-cyan-500 transition-colors"
                >
                  Comprar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Nenhum ativo encontrado.</p>
        )}
      </div>
    </div>
  );
}

interface CryptoAssetsContentProps {
  onBuy: (asset: CryptoAsset) => void;
}
function CryptoAssetsContent({ onBuy }: CryptoAssetsContentProps): JSX.Element {
  const [cryptoData, setCryptoData] = useState<CryptoAsset[]>([]);

  useEffect(() => {
    async function fetchCrypto() {
      try {
        const coins = coinList.coins.join(",");
        const res = await fetch(
          `https://brapi.dev/api/v2/crypto?coin=${coins}&currency=BRL&range=5d&interval=1d&token=${process.env.NEXT_PUBLIC_BRAPI_KEY}`
        );
        const data = await res.json();
        console.log(data);
        console.log(res);
        if (data && data.coins) {
          const mapped: CryptoAsset[] = data.coins.map((item: any) => ({
            coin: item.coin,
            coinName: item.coinName,
            regularMarketPrice: Number(item.regularMarketPrice),
            regularMarketChange: Number(item.regularMarketChange),
            regularMarketChangePercent: Number(item.regularMarketChangePercent),
            regularMarketVolume: Number(item.regularMarketVolume),
            marketCap: Number(item.marketCap),
            coinImageUrl: item.coinImageUrl,
            usedInterval: item.usedInterval,
            usedRange: item.usedRange,
          }));
          setCryptoData(mapped);
        }
      } catch (error) {
        console.error("Erro ao buscar dados de cripto:", error);
      }
    }
    fetchCrypto();
  }, []);

  return (
    <div className="max-h-96 overflow-y-auto space-y-4">
      {cryptoData.length > 0 ? (
        cryptoData.map((crypto, index) => (
          <div key={index} className="bg-[#242424] p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={crypto.coinImageUrl} alt={crypto.coinName} className="w-8 h-8" />
              <div>
                <h3 className="font-medium text-gray-100">{crypto.coin}</h3>
                <p className="text-sm text-gray-400">{crypto.coinName}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-medium text-gray-100">R$ {crypto.regularMarketPrice.toFixed(2)}</p>
              <p
                className={`text-sm ${
                  crypto.regularMarketChange > 0
                    ? "text-green-400"
                    : crypto.regularMarketChange < 0
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {crypto.regularMarketChange.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-400">
                Market Cap: R$ {crypto.marketCap.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs text-gray-400">
                Volume: {crypto.regularMarketVolume.toLocaleString("pt-BR")}
              </p>
              <button
                onClick={() => onBuy(crypto)}
                className="mt-2 px-2 py-1 bg-cyan-400 text-black text-sm rounded hover:bg-cyan-500 transition-colors"
              >
                Comprar
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">Nenhuma moeda encontrada.</p>
      )}
    </div>
  );
}

// ─── DaytradeContent ─────────────────────────────
function DaytradeContent(): JSX.Element {
  return (
    <div className="text-center py-12">
      <Clock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2">Day Trade</h3>
      <p className="text-gray-400">
        O módulo de Day Trade está em desenvolvimento e em breve estará disponível.
      </p>
    </div>
  );
}

// ─── PurchaseModal para Ações ─────────────────────────────
function PurchaseModal({
  asset,
  onClose,
  onSuccess,
}: {
  asset: StockAsset;
  onClose: () => void;
  onSuccess: () => void;
}): JSX.Element {
  const { user } = useUser();
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: user?.cpf,
          ativo: asset.stock,
          categoria: "Ação",
          quantidade: quantity,
          valor_unitario: asset.close,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Compra realizada com sucesso!");
        onSuccess();
        onClose();
      } else {
        alert("Erro na compra: " + result.error);
      }
    } catch (error: any) {
      alert("Erro: " + error.message);
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Comprar ${asset.stock}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p>Preço atual: R$ {asset.close.toFixed(2)}</p>
        </div>
        <div>
          <label className="block mb-2">Quantidade:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-2 rounded border border-gray-600 bg-[#242424] text-gray-100"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-cyan-400 text-black rounded-lg">
          {loading ? "Comprando..." : "Comprar"}
        </button>
      </form>
    </Modal>
  );
}

// ─── PurchaseModalCrypto: Modal para compra de Criptomoeda ─────────────────────────────
function PurchaseModalCrypto({
  asset,
  onClose,
  onSuccess,
}: {
  asset: CryptoAsset;
  onClose: () => void;
  onSuccess: () => void;
}): JSX.Element {
  const { user } = useUser();
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/coin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: user?.cpf,
          ativo: asset.coin,
          categoria: "Criptomoeda",
          quantidade: quantity,
          valor_unitario: asset.regularMarketPrice,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Compra realizada com sucesso!");
        onSuccess();
        onClose();
      } else {
        alert("Erro na compra: " + result.error);
      }
    } catch (error: any) {
      alert("Erro: " + error.message);
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Comprar ${asset.coin}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p>Preço atual: R$ {asset.regularMarketPrice.toFixed(2)}</p>
          <p className="text-xs text-gray-400">
            Market Cap: R$ {asset.marketCap.toLocaleString("pt-BR")}
          </p>
          <p className="text-xs text-gray-400">
            Volume: {asset.regularMarketVolume.toLocaleString("pt-BR")}
          </p>
        </div>
        <div>
          <label className="block mb-2">Quantidade:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-2 rounded border border-gray-600 bg-[#242424] text-gray-100"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-cyan-400 text-black rounded-lg">
          {loading ? "Comprando..." : "Comprar"}
        </button>
      </form>
    </Modal>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────
export default function Dashboard(): JSX.Element {
  const { user } = useUser();
  const router = useRouter();


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
  const [stocksData, setStocksData] = useState<StockAsset[]>([]);

  const [selectedAsset, setSelectedAsset] = useState<StockAsset | CryptoAsset | null>(null);

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

  useEffect(() => {
    async function fetchStocks() {
      try {
        const res = await fetch(
          `https://brapi.dev/api/quote/list?type=stock&apikey=${process.env.NEXT_PUBLIC_BRAPI_KEY}`
        );
        const data = await res.json();
        if (data && data.stocks) {
          const stocks: StockAsset[] = data.stocks.map((item: any) => ({
            stock: item.stock,
            name: item.name,
            close: item.close,
            change: Number(item.change),
            volume: item.volume,
            market_cap: item.market_cap,
            logo: item.logo,
            sector: item.sector,
            type: item.type,
          }));
          setStocksData(stocks);
        }
      } catch (error) {
        console.error("Erro ao buscar dados dos ativos:", error);
      }
    }
    if (stocksData.length === 0) {
      fetchStocks();
    }
  }, [stocksData]);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100">
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

      <Modal
        isOpen={activeModal === "assets"}
        onClose={() => setActiveModal(null)}
        title="Ativos Disponíveis"
      >
        <AssetsContent
          stocks={stocksData}
          onBuy={(asset) => {
            setSelectedAsset(asset);
            setActiveModal(null);
          }}
        />
      </Modal>
      <Modal
        isOpen={activeModal === "daytrade"}
        onClose={() => setActiveModal(null)}
        title="Day Trade"
      >
        <DaytradeContent />
      </Modal>
      <Modal
        isOpen={activeModal === "crypto"}
        onClose={() => setActiveModal(null)}
        title="Criptomoedas"
      >
        <CryptoAssetsContent
          onBuy={(asset) => {
            setSelectedAsset(asset);
            setActiveModal(null);
          }}
        />
      </Modal>

      <AnimatePresence>
        {selectedAsset && (
          "coin" in selectedAsset ? (
            <PurchaseModalCrypto
              asset={selectedAsset as CryptoAsset}
              onClose={() => setSelectedAsset(null)}
              onSuccess={async () => {
                if (user && user.cpf) {
                  const { data, error } = await supabase
                    .from("user_accounts")
                    .select("*")
                    .eq("cpf", user.cpf)
                    .limit(1)
                    .single();
                  if (!error && data) {
                    const saldo_total = Number(data.saldo_investido) + Number(data.saldo_disponivel);
                    setAccountInfo({
                      saldo_investido: Number(data.saldo_investido),
                      saldo_disponivel: Number(data.saldo_disponivel),
                      saldo_bloqueado: Number(data.saldo_bloqueado),
                      saldo_total,
                    });
                  }
                }
              }}
            />
          ) : (
            <PurchaseModal
              asset={selectedAsset as StockAsset}
              onClose={() => setSelectedAsset(null)}
              onSuccess={async () => {
                if (user && user.cpf) {
                  const { data, error } = await supabase
                    .from("user_accounts")
                    .select("*")
                    .eq("cpf", user.cpf)
                    .limit(1)
                    .single();
                  if (!error && data) {
                    const saldo_total = Number(data.saldo_investido) + Number(data.saldo_disponivel);
                    setAccountInfo({
                      saldo_investido: Number(data.saldo_investido),
                      saldo_disponivel: Number(data.saldo_disponivel),
                      saldo_bloqueado: Number(data.saldo_bloqueado),
                      saldo_total,
                    });
                  }
                }
              }}
            />
          )
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';

interface Stock {
  symbol: string;
  price: number;
  change: number;
}

const mockStocks: Stock[] = [
  { symbol: 'PETR4', price: 38.42, change: 2.5 },
  { symbol: 'VALE3', price: 68.90, change: -1.2 },
  { symbol: 'ITUB4', price: 32.15, change: 1.8 },
  { symbol: 'BBDC4', price: 15.73, change: -0.5 },
  { symbol: 'MGLU3', price: 4.21, change: 3.7 },
  { symbol: 'WEGE3', price: 36.92, change: 0.9 },
  { symbol: 'RENT3', price: 58.44, change: -2.1 },
  { symbol: 'BBAS3', price: 53.12, change: 1.4 },
];

export const StockTicker = () => {
  const [stocks, setStocks] = useState(mockStocks);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(stocks.map(stock => ({
        ...stock,
        price: +(stock.price + (Math.random() - 0.5)).toFixed(2),
        change: +(stock.change + (Math.random() - 0.5) * 0.2).toFixed(2),
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [stocks]);

  return (
    <div className="w-full glassmorphism py-4 mb-12">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView="auto"
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={5000}
        className="stock-ticker"
      >
        {stocks.map((stock) => (
          <SwiperSlide key={stock.symbol} className="!w-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 px-4"
            >
              <span className="font-bold text-[#00f7ff]">{stock.symbol}</span>
              <span className="text-white">R$ {stock.price.toFixed(2)}</span>
              <span
                className={`${
                  stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stock.change >= 0 ? '+' : ''}{stock.change}%
              </span>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
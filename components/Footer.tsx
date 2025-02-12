"use client";

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-[#00f7ff]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center mb-6"
          >
            <TrendingUp className="w-8 h-8 text-[#00f7ff]" />
            <span className="ml-2 text-2xl font-bold gradient-text">TradeSim</span>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-[#00f7ff] mb-3">Plataforma</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Portfólio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mercado</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#00f7ff] mb-3">Recursos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Análise Técnica</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Indicadores</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Relatórios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#00f7ff] mb-3">Suporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentação</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#00f7ff] mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Termos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Licença</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            <p>© 2025 TradeSim. Todos os direitos reservados.</p>
            <p className="mt-1">Simulador de investimentos para fins educacionais.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
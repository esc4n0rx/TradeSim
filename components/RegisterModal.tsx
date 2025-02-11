// components/RegisterModal.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { useUser } from "@/contexts/UserContext";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface RegisterModalProps {
  onClose: () => void;
}

export const RegisterModal = ({ onClose }: RegisterModalProps) => {
  const { setUser } = useUser();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Passo 1: Dados iniciais
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    data_nascimento: "",
    documento_identidade: "",
    // Passo 2: Informações financeiras
    renda_mensal: "",
    patrimonio_total: "",
    experiencia_investimento: "Nenhuma",
    perfil_investidor: "Conservador",
    objetivo_investimento: "",
    // Passo 3: Dados complementares
    fonte_renda: "Emprego formal",
    profissao: "",
    tempo_investimento: "Menos de 1 ano",
    comprovante_residencia: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hashedPassword = bcrypt.hashSync(formData.senha, 10);
    const payload = { ...formData, senha: hashedPassword };

    const { data, error: insertError } = await supabase
      .from("users_tradesim")
      .insert([payload])
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setUser(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 p-8 rounded-lg w-full max-w-md"
      >
        {/* Título em negrito branco */}
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Registro - Passo {step}
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <form
          onSubmit={step === 3 ? handleRegister : handleNext}
          className="space-y-4"
        >
          {step === 1 && (
            <div>
              <div>
                <label className="block text-white mb-1">Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">Senha:</label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">CPF:</label>
                <input
                  type="text"
                  name="cpf"
                  placeholder="XXX.XXX.XXX-XX"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">Telefone:</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">
                  Data de Nascimento:
                </label>
                <input
                  type="date"
                  name="data_nascimento"
                  value={formData.data_nascimento}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">
                  Documento de Identidade:
                </label>
                <input
                  type="text"
                  name="documento_identidade"
                  value={formData.documento_identidade}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div>
                <label className="block text-white mb-1">
                  Renda Mensal:
                </label>
                <input
                  type="number"
                  name="renda_mensal"
                  value={formData.renda_mensal}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">
                  Patrimônio Total:
                </label>
                <input
                  type="number"
                  name="patrimonio_total"
                  value={formData.patrimonio_total}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">
                  Experiência em Investimento:
                </label>
                <select
                  name="experiencia_investimento"
                  value={formData.experiencia_investimento}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                >
                  <option value="Nenhuma">Nenhuma</option>
                  <option value="Básica">Básica</option>
                  <option value="Intermediária">Intermediária</option>
                  <option value="Avançada">Avançada</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">
                  Perfil Investidor:
                </label>
                <select
                  name="perfil_investidor"
                  value={formData.perfil_investidor}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                >
                  <option value="Conservador">Conservador</option>
                  <option value="Moderado">Moderado</option>
                  <option value="Agressivo">Agressivo</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">
                  Objetivo de Investimento:
                </label>
                <input
                  type="text"
                  name="objetivo_investimento"
                  value={formData.objetivo_investimento}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div>
                <label className="block text-white mb-1">
                  Fonte de Renda:
                </label>
                <select
                  name="fonte_renda"
                  value={formData.fonte_renda}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                >
                  <option value="Emprego formal">Emprego formal</option>
                  <option value="Autônomo">Autônomo</option>
                  <option value="Empresário">Empresário</option>
                  <option value="Aposentado">Aposentado</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">
                  Profissão:
                </label>
                <input
                  type="text"
                  name="profissao"
                  value={formData.profissao}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">
                  Tempo de Investimento:
                </label>
                <select
                  name="tempo_investimento"
                  value={formData.tempo_investimento}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                >
                  <option value="Menos de 1 ano">Menos de 1 ano</option>
                  <option value="1-3 anos">1-3 anos</option>
                  <option value="4-6 anos">4-6 anos</option>
                  <option value="7+ anos">7+ anos</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">
                  Comprovante de Residência (URL):
                </label>
                <input
                  type="text"
                  name="comprovante_residencia"
                  value={formData.comprovante_residencia}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00f7ff]"
                />
              </div>
            </div>
          )}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={step > 1 ? handleBack : onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-700 transition-colors text-white"
            >
              {step > 1 ? "Voltar" : "Cancelar"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#00f7ff] hover:bg-[#00f7ff]/90 text-black font-bold transition-colors"
            >
              {step < 3 ? "Próximo" : "Registrar"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// app/api/coin/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// if (process.env.NODE_ENV !== 'production') {
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//   }
  

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cpf, ativo, categoria, quantidade, valor_unitario } = body;
    if (!cpf || !ativo || !categoria || !quantidade || !valor_unitario) {
      console.error("Campos obrigatórios não informados", { cpf, ativo, categoria, quantidade, valor_unitario });
      return NextResponse.json({ error: "Campos obrigatórios não informados" }, { status: 400 });
    }
    const valor_total = Number(quantidade) * Number(valor_unitario);
    console.log("Iniciando compra de criptomoeda:", { cpf, ativo, quantidade, valor_unitario, valor_total });

    // Buscar dados da conta do usuário
    const { data: accountData, error: accountError } = await supabase
      .from("user_accounts")
      .select("*")
      .eq("cpf", cpf)
      .limit(1)
      .single();
    if (accountError || !accountData) {
      console.error("Erro ao buscar dados da conta", { accountError });
      return NextResponse.json({ error: accountError?.message || "Conta não encontrada" }, { status: 400 });
    }
    if (Number(accountData.saldo_disponivel) < valor_total) {
      console.error("Saldo insuficiente", { saldo_disponivel: accountData.saldo_disponivel, valor_total });
      return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 });
    }

    // Atualizar a conta do usuário
    const newSaldoInvestido = Number(accountData.saldo_investido) + valor_total;
    const newSaldoDisponivel = Number(accountData.saldo_disponivel) - valor_total;
    const { error: updateError } = await supabase
      .from("user_accounts")
      .update({
        saldo_investido: newSaldoInvestido,
        saldo_disponivel: newSaldoDisponivel,
      })
      .eq("cpf", cpf);
    if (updateError) {
      console.error("Erro ao atualizar a conta", { updateError });
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }
    console.log("Conta atualizada:", { newSaldoInvestido, newSaldoDisponivel });

    // Buscar o registro do ativo (criptomoeda) na tabela user_assets
    const { data: coinData, error: coinError } = await supabase
      .from("user_assets")
      .select("*")
      .eq("cpf", cpf)
      .eq("ativo", ativo)
      .limit(1)
      .single();
    if (coinData) {
      console.log("Criptomoeda existente encontrada:", coinData);
      const newQuantity = Number(coinData.quantidade) + Number(quantidade);
      const newValorTotal = Number(coinData.valor_total) + valor_total;
      const { error: updateCoinError } = await supabase
        .from("user_assets")
        .update({
          quantidade: newQuantity,
          valor_total: newValorTotal,
        })
        .eq("cpf", cpf)
        .eq("ativo", ativo);
      if (updateCoinError) {
        console.error("Erro ao atualizar a criptomoeda", { updateCoinError });
        return NextResponse.json({ error: updateCoinError.message }, { status: 400 });
      }
      console.log("Criptomoeda atualizada:", { newQuantity, newValorTotal });
    } else {
      console.log("Inserindo nova criptomoeda");
      const { error: insertCoinError } = await supabase
        .from("user_assets")
        .insert([{ cpf, ativo, categoria, quantidade, valor_total }]);
      if (insertCoinError) {
        console.error("Erro ao inserir a criptomoeda", { insertCoinError });
        return NextResponse.json({ error: insertCoinError.message }, { status: 400 });
      }
      console.log("Criptomoeda inserida com sucesso");
    }
    return NextResponse.json({
      message: "Compra de criptomoeda realizada com sucesso",
      newSaldoInvestido,
      newSaldoDisponivel,
    });
  } catch (err: any) {
    console.error("Erro inesperado na rota POST de coin:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


// if (process.env.NODE_ENV !== 'production') {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  return NextResponse.json({ message: "Endpoint Finance GET" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cpf, ativo, categoria, quantidade, valor_unitario } = body;

    if (!cpf || !ativo || !categoria || !quantidade || !valor_unitario) {
      console.error("Campos obrigatórios não informados", { cpf, ativo, categoria, quantidade, valor_unitario });
      return NextResponse.json({ error: "Campos obrigatórios não informados" }, { status: 400 });
    }

    const valor_total = Number(quantidade) * Number(valor_unitario);
    console.log("Iniciando compra:", { cpf, ativo, quantidade, valor_unitario, valor_total });

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
    console.log("Dados da conta obtidos:", accountData);

    if (Number(accountData.saldo_disponivel) < valor_total) {
      console.error("Saldo insuficiente", { saldo_disponivel: accountData.saldo_disponivel, valor_total });
      return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 });
    }

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
    console.log("Conta atualizada com sucesso:", { newSaldoInvestido, newSaldoDisponivel });

    const { data: assetData, error: assetError } = await supabase
      .from("user_assets")
      .select("*")
      .eq("cpf", cpf)
      .eq("ativo", ativo)
      .limit(1)
      .single();

    if (assetData) {
      console.log("Ativo existente encontrado:", assetData);
      const newQuantity = Number(assetData.quantidade) + Number(quantidade);
      const newValorTotal = Number(assetData.valor_total) + valor_total;
      const { error: updateAssetError } = await supabase
        .from("user_assets")
        .update({
          quantidade: newQuantity,
          valor_total: newValorTotal,
        })
        .eq("cpf", cpf)
        .eq("ativo", ativo);
      if (updateAssetError) {
        console.error("Erro ao atualizar o ativo", { updateAssetError });
        return NextResponse.json({ error: updateAssetError.message }, { status: 400 });
      }
      console.log("Ativo atualizado com sucesso:", { newQuantity, newValorTotal });
    } else {
      console.log("Ativo não encontrado, inserindo novo registro");
      const { error: insertError } = await supabase
        .from("user_assets")
        .insert([{ cpf, ativo, categoria, quantidade, valor_total }]);
      if (insertError) {
        console.error("Erro ao inserir ativo", { insertError });
        return NextResponse.json({ error: insertError.message }, { status: 400 });
      }
      console.log("Ativo inserido com sucesso");
    }

    return NextResponse.json({
      message: "Compra realizada com sucesso",
      newSaldoInvestido,
      newSaldoDisponivel,
    });
  } catch (err: any) {
    console.error("Erro inesperado na rota POST de finance:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

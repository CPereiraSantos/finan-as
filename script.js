const API_URL = "https://script.google.com/macros/s/AKfycbzT33TqCjIjm8ojUWm9bCY439hx7hyp5cIfedfU0FeDZ275osfJp0DvmG_UZIDheXns/exec";

let salarioCaio = 0;
let salarioVictoria = 0;
let despesas = [];

function moeda(valor){
  return Number(valor).toLocaleString("pt-BR",{
    style:"currency",
    currency:"BRL"
  });
}

/* CONVERTE TEXTO PARA NÚMERO (aceita 69,90 / 69.90 / R$ 69,90) */
function limparNumero(valor){

  if(valor === null || valor === undefined) return 0;

  valor = valor.toString()
  .replace("R$","")
  .replace(/\s/g,"")
  .replace(/\./g,"")
  .replace(",",".")
  .trim();

  let numero = Number(valor);

  return isNaN(numero) ? 0 : numero;
}

async function carregar(){

  try{

    const req = await fetch(API_URL + "?t=" + Date.now());
    const dados = await req.json();

    despesas = dados.despesas || [];

    salarioCaio = Number(dados.salarios[0]?.salario || 0);
    salarioVictoria = Number(dados.salarios[1]?.salario || 0);

    document.getElementById("salarioCaio").value = salarioCaio;
    document.getElementById("salarioVictoria").value = salarioVictoria;

    atualizar();

  }catch(erro){
    console.log("Erro:", erro);
  }

}

function atualizar(){

  let totalSalarios = salarioCaio + salarioVictoria;

  let totalDespesas = despesas.reduce((a,b)=>{
    return a + Number(b.valor);
  },0);

  let divisao = totalDespesas / 2;
  let sobraCasa = totalSalarios - totalDespesas;

  document.getElementById("salarios").innerText = moeda(totalSalarios);
  document.getElementById("despesas").innerText = moeda(totalDespesas);
  document.getElementById("sobra").innerText = moeda(sobraCasa);
  document.getElementById("divisao").innerText = moeda(divisao);

  document.getElementById("salCaio").innerText = moeda(salarioCaio);
  document.getElementById("salVictoria").innerText = moeda(salarioVictoria);

  document.getElementById("caioSobra").innerText = moeda(salarioCaio-divisao);
  document.getElementById("vicSobra").innerText = moeda(salarioVictoria-divisao);

  let html = "";

  despesas.slice().reverse().forEach(item=>{

    html += `
<li style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #333;gap:10px;">

<div style="flex:1;">
<span>${item.descricao}</span>
</div>

<strong style="min-width:95px;text-align:right;">
${moeda(item.valor)}
</strong>

<div style="display:flex;gap:4px;flex-shrink:0;">

<button onclick="editarConta('${item.id}','${item.descricao}','${item.valor}')" class="mini-btn">
✏️
</button>

<button onclick="excluirConta('${item.id}')" class="mini-btn excluir">
🗑️
</button>

</div>

</li>
`;

  });

  document.getElementById("gastos").innerHTML = html;

}

async function salvarSalarios(){

  await fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({
      tipo:"salario",
      caio:limparNumero(document.getElementById("salarioCaio").value),
      victoria:limparNumero(document.getElementById("salarioVictoria").value)
    })
  });

  carregar();

}

async function addDespesa(){

  await fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({
      tipo:"despesa",
      descricao:document.getElementById("descricao").value,
      valor:limparNumero(document.getElementById("valor").value)
    })
  });

  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";

  carregar();

}

async function editarConta(id,nome,valor){

  let novoNome = prompt("Editar nome:", nome);
  if(novoNome === null) return;

  let novoValor = prompt("Editar valor:", valor);
  if(novoValor === null) return;

  novoValor = limparNumero(novoValor);

  if(novoValor <= 0){
    alert("Valor inválido.");
    return;
  }

  await fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({
      tipo:"editarDespesa",
      id:id,
      descricao:novoNome,
      valor:novoValor
    })
  });

  carregar();

}

async function excluirConta(id){

  if(!confirm("Deseja excluir esta conta?")) return;

  await fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({
      tipo:"excluirDespesa",
      id:id
    })
  });

  carregar();

}

window.onload = carregar;
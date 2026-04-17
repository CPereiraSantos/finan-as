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
console.log("Erro ao carregar:", erro);
}

}

function atualizar(){

let totalSalarios = salarioCaio + salarioVictoria;

let totalDespesas = despesas.reduce((total,item)=>{
return total + Number(item.valor);
},0);

let divisao = totalDespesas / 2;
let sobraCasa = totalSalarios - totalDespesas;

document.getElementById("salarios").innerText = moeda(totalSalarios);
document.getElementById("despesas").innerText = moeda(totalDespesas);
document.getElementById("sobra").innerText = moeda(sobraCasa);
document.getElementById("divisao").innerText = moeda(divisao);

document.getElementById("salCaio").innerText = moeda(salarioCaio);
document.getElementById("salVictoria").innerText = moeda(salarioVictoria);

document.getElementById("caioSobra").innerText = moeda(salarioCaio - divisao);
document.getElementById("vicSobra").innerText = moeda(salarioVictoria - divisao);

let html = "";

despesas.slice().reverse().forEach(item=>{

html += `
<li>
<span>${item.descricao}</span>

<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
<strong>${moeda(item.valor)}</strong>

<button onclick="editarConta('${item.id}','${item.descricao}','${item.valor}')" style="width:auto;padding:6px 10px;">✏️</button>

<button onclick="excluirConta('${item.id}')" style="width:auto;padding:6px 10px;background:#c62828;">🗑️</button>
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
caio:Number(document.getElementById("salarioCaio").value),
victoria:Number(document.getElementById("salarioVictoria").value)
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
valor:Number(document.getElementById("valor").value)
})
});

document.getElementById("descricao").value = "";
document.getElementById("valor").value = "";

carregar();

}

async function editarConta(id,nome,valor){

let novoNome = prompt("Editar nome da conta:", nome);
if(novoNome === null) return;

let novoValor = prompt("Editar valor:", valor);
if(novoValor === null) return;

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
tipo:"editarDespesa",
id:id,
descricao:novoNome,
valor:Number(novoValor)
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
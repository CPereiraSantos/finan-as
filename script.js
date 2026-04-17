// script.js MÊS A MÊS

const API_URL = "https://script.google.com/macros/s/AKfycbzR5t1Stifd0iVyN7U1g8KEMxzpabFekQt1TWpU3DaF-RulKWbAF9yH8BfYLuHhreDb/exec";

let salarioCaio = 0;
let salarioVictoria = 0;
let despesas = [];

function moeda(v){
return v.toLocaleString('pt-BR',{
style:'currency',
currency:'BRL'
});
}

async function carregar(){

const req = await fetch(API_URL);
const dados = await req.json();

let mes = document.getElementById("mesSelecionado").value;

despesas = [];

dados.despesas.forEach(item=>{

let data = new Date(item.data);
let mesItem = data.getMonth()+1;

if(mesItem == mes){

despesas.push({
nome:item.descricao,
valor:Number(item.valor)
});

}

});

salarioCaio = Number(dados.salarios[0].salario);
salarioVictoria = Number(dados.salarios[1].salario);

document.getElementById("salarioCaio").value = salarioCaio;
document.getElementById("salarioVictoria").value = salarioVictoria;

atualizar();

}

function atualizar(){

let totalSalarios = salarioCaio + salarioVictoria;
let totalDespesas = despesas.reduce((a,b)=>a+b.valor,0);
let divisao = totalDespesas / 2;
let sobra = totalSalarios - totalDespesas;

document.getElementById("salarios").innerText = moeda(totalSalarios);
document.getElementById("despesas").innerText = moeda(totalDespesas);
document.getElementById("sobra").innerText = moeda(sobra);
document.getElementById("divisao").innerText = moeda(divisao);

document.getElementById("caioSobra").innerText = moeda(salarioCaio-divisao);
document.getElementById("vicSobra").innerText = moeda(salarioVictoria-divisao);

let html = "";

despesas.slice().reverse().forEach(item=>{

html += `
<li>
<span>${item.nome}</span>
<strong>${moeda(item.valor)}</strong>
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

window.onload = function(){

let hoje = new Date().getMonth()+1;
document.getElementById("mesSelecionado").value = hoje;

carregar();

}
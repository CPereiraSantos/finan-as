// script.js VERSÃO 3.0 - Google Sheets integrado

const API_URL = "https://script.google.com/macros/s/AKfycbxfYn3_btzOabatuW5q1HalA--MyxHeit10hrTzij_XIRjL78MzmbxYdHS7FWcsLl4M/exec";

let salarioCaio = 3000;
let salarioVictoria = 1500;

let despesas = [];

function moeda(valor){
return valor.toLocaleString('pt-BR',{
style:'currency',
currency:'BRL'
});
}

async function carregarDados(){

try{

const resposta = await fetch(API_URL);
const dados = await resposta.json();

despesas = [];

dados.forEach(item=>{

despesas.push({
nome:item.descricao,
valor:Number(item.valor)
});

});

atualizarTela();

}catch(error){

console.log("Erro ao carregar");

}

}

function atualizarTela(){

let totalSalarios = salarioCaio + salarioVictoria;

let totalDespesas = despesas.reduce((a,b)=>a+b.valor,0);

let sobraTotal = totalSalarios - totalDespesas;

let divisao = totalDespesas / 2;

let sobraCaio = salarioCaio - divisao;
let sobraVictoria = salarioVictoria - divisao;

document.getElementById('salarios').innerText = moeda(totalSalarios);
document.getElementById('despesas').innerText = moeda(totalDespesas);
document.getElementById('sobra').innerText = moeda(sobraTotal);
document.getElementById('divisao').innerText = moeda(divisao);

document.getElementById('caioSobra').innerText = moeda(sobraCaio);
document.getElementById('vicSobra').innerText = moeda(sobraVictoria);

let lista = document.getElementById('gastos');
lista.innerHTML = '';

despesas.slice().reverse().forEach(item=>{

lista.innerHTML += `
<li>
<span>${item.nome}</span>
<strong>${moeda(item.valor)}</strong>
</li>
`;

});

}

async function addDespesa(){

let nome = document.getElementById('descricao').value;
let valor = Number(document.getElementById('valor').value);

if(nome == '' || valor <= 0){
alert('Preencha corretamente');
return;
}

const payload = {
data:new Date().toLocaleDateString('pt-BR'),
responsavel:"Casa",
descricao:nome,
categoria:"Geral",
valor:valor
};

await fetch(API_URL,{
method:'POST',
body:JSON.stringify(payload)
});

document.getElementById('descricao').value='';
document.getElementById('valor').value='';

carregarDados();

}

carregarDados();
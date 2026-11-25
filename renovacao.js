const formRenovacao = document.getElementById("formRenovacao");

const CHAVE_RENOVACOES = "droneCultivoRenovacoes";

// Exibe as solicitações cadastradas
function carregarRenovacoes() {
  const lista = document.getElementById("listaMinhasRenovacoes");

  if (!lista) return;

  const renovacoes = JSON.parse(localStorage.getItem(CHAVE_RENOVACOES) || "[]");

  lista.innerHTML = "";

  if (renovacoes.length === 0) {
    lista.textContent = "Você ainda não possui solicitações de renovação.";
    return;
  }

  renovacoes
    .slice()
    .reverse()
    .forEach(function (item) {
      const card = document.createElement("article");
      card.className = "contrato-item";

      const titulo = document.createElement("h3");
      titulo.textContent = item.propriedade;

      const responsavel = document.createElement("p");
      responsavel.textContent = "Responsável: " + item.responsavel;

      const servico = document.createElement("p");
      servico.textContent = "Serviço: " + item.servico;

      const contrato = document.createElement("p");
      contrato.textContent = "Contrato: " + item.contrato;

      const data = document.createElement("p");
      data.textContent = "Nova data desejada: " + item.data;

      const periodo = document.createElement("p");
      periodo.textContent = "Período adicional: " + item.periodo;

      const status = document.createElement("span");
      status.className = "contrato-status";
      status.textContent = "Status: " + (item.status || "Pendente");

      card.append(
        titulo,
        responsavel,
        servico,
        contrato,
        data,
        periodo,
        status,
      );

      if (item.observacoes) {
        const observacoes = document.createElement("p");
        observacoes.textContent = "Observações: " + item.observacoes;
        card.appendChild(observacoes);
      }

      lista.appendChild(card);
    });
}

// Cadastra uma nova solicitação
if (formRenovacao) {
  formRenovacao.addEventListener("submit", function (event) {
    event.preventDefault();

    const renovacao = {
      id: Date.now(),

      responsavel: document.getElementById("responsavel").value.trim(),

      propriedade: document.getElementById("propriedade").value.trim(),

      servico: document.getElementById("servico").value,

      contrato: document.getElementById("contrato").value.trim(),

      data: document.getElementById("data").value,

      periodo: document.getElementById("periodo").value,

      observacoes: document.getElementById("observacoes").value.trim(),

      status: "Pendente",

      dataSolicitacao: new Date().toISOString(),
    };

    const renovacoes = JSON.parse(
      localStorage.getItem(CHAVE_RENOVACOES) || "[]",
    );

    renovacoes.push(renovacao);

    localStorage.setItem(CHAVE_RENOVACOES, JSON.stringify(renovacoes));

    document.getElementById("mensagemRenovacao").textContent =
      "Solicitação de renovação registrada com sucesso!";

    formRenovacao.reset();

    carregarRenovacoes();
  });
}

// Carrega a lista ao abrir a página
carregarRenovacoes();

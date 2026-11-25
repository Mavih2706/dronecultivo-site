document.addEventListener("DOMContentLoaded", function () {
  // CARREGAR E SALVAR DADOS
  function carregarDados(chave) {
    try {
      return JSON.parse(localStorage.getItem(chave) || "[]");
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
      return [];
    }
  }

  function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
  }

  // ELEMENTOS DA PÁGINA
  const totalRenovacoes = document.getElementById("totalRenovacoes");
  const totalAtivos = document.getElementById("totalAtivos");
  const totalHistorico = document.getElementById("totalHistorico");
  const totalAlugueis = document.getElementById("totalAlugueis");
  const totalAlugueisResumo = document.getElementById("totalAlugueisResumo");
  const listaRenovacoes = document.getElementById("listaRenovacoes");
  const listaAlugueis = document.getElementById("listaAlugueis");

  // DADOS
  let renovacoes = carregarDados("droneCultivoRenovacoes");
  let alugueis = carregarDados("droneCultivoAlugueis");

  // ATUALIZAR STATUS
  function atualizarStatus(tipo, id, novoStatus) {
    if (tipo === "renovacao") {
      renovacoes = renovacoes.map((item) =>
        item.id === id ? { ...item, status: novoStatus } : item,
      );

      salvarDados("droneCultivoRenovacoes", renovacoes);
    }

    if (tipo === "aluguel") {
      alugueis = alugueis.map((item) =>
        item.id === id ? { ...item, status: novoStatus } : item,
      );

      salvarDados("droneCultivoAlugueis", alugueis);
    }

    renderizarPagina();
  }

  // CRIAR BOTÕES DE AÇÃO
  function criarBotoes(card, tipo, item) {
    if (item.status !== "Pendente") {
      return;
    }

    const areaBotoes = document.createElement("div");
    areaBotoes.className = "contrato-acoes";

    const botaoAprovar = document.createElement("button");
    botaoAprovar.textContent = "Aprovar";
    botaoAprovar.className = "btn-aprovar";
    botaoAprovar.type = "button";

    botaoAprovar.addEventListener("click", function () {
      atualizarStatus(tipo, item.id, "Aprovado");
    });

    const botaoRecusar = document.createElement("button");
    botaoRecusar.textContent = "Recusar";
    botaoRecusar.className = "btn-recusar";
    botaoRecusar.type = "button";

    botaoRecusar.addEventListener("click", function () {
      atualizarStatus(tipo, item.id, "Recusado");
    });

    areaBotoes.append(botaoAprovar, botaoRecusar);
    card.appendChild(areaBotoes);
  }

  // CRIAR CARD
  function criarCard(item, tipo) {
    const card = document.createElement("article");
    card.className = "contrato-item";

    const titulo = document.createElement("h3");
    titulo.textContent = item.propriedade || "Propriedade não informada";

    const status = document.createElement("span");
    status.className = "contrato-status";
    status.textContent = item.status || "Pendente";

    card.append(titulo);

    function adicionarTexto(texto) {
      const paragrafo = document.createElement("p");
      paragrafo.textContent = texto;
      card.appendChild(paragrafo);
    }

    if (tipo === "renovacao") {
      adicionarTexto("Responsável: " + (item.responsavel || "Não informado"));
      adicionarTexto("Serviço: " + (item.servico || "Não informado"));
      adicionarTexto("Contrato: " + (item.contrato || "Não informado"));
      adicionarTexto("Nova data: " + (item.data || "Não informada"));
      adicionarTexto("Período adicional: " + (item.periodo || "Não informado"));
    }

    if (tipo === "aluguel") {
      adicionarTexto("Responsável: " + (item.nome || "Não informado"));
      adicionarTexto("Localização: " + (item.localizacao || "Não informada"));
      adicionarTexto("Serviço: " + (item.servico || "Não informado"));
      adicionarTexto("Área: " + (item.area || "Não informada") + " hectares");
      adicionarTexto("Data de início: " + (item.inicio || "Não informada"));
      adicionarTexto("Período: " + (item.periodo || "Não informado"));
    }

    if (item.observacoes) {
      adicionarTexto("Observações: " + item.observacoes);
    }

    card.appendChild(status);

    criarBotoes(card, tipo, item);

    return card;
  }

  // ATUALIZAR A PÁGINA
  function renderizarPagina() {
    // CONTADORES
    const todosPedidos = [...renovacoes, ...alugueis];

    const pendentesRenovacao = renovacoes.filter(
      (item) => (item.status || "Pendente") === "Pendente",
    ).length;

    const aprovados = todosPedidos.filter(
      (item) => item.status === "Aprovado",
    ).length;

    const recusados = todosPedidos.filter(
      (item) => item.status === "Recusado",
    ).length;

    if (totalRenovacoes) {
      totalRenovacoes.textContent = pendentesRenovacao;
    }

    if (totalAtivos) {
      totalAtivos.textContent = aprovados;
    }

    if (totalHistorico) {
      totalHistorico.textContent = recusados;
    }

    if (totalAlugueis) {
      totalAlugueis.textContent = alugueis.length;
    }
    if (totalAlugueisResumo) {
      totalAlugueisResumo.textContent = alugueis.length;
    }
    // LISTA DE RENOVAÇÕES
    if (listaRenovacoes) {
      listaRenovacoes.innerHTML = "";

      if (renovacoes.length === 0) {
        listaRenovacoes.textContent =
          "Nenhuma solicitação de renovação encontrada.";
      }

      renovacoes.forEach((item) => {
        listaRenovacoes.appendChild(criarCard(item, "renovacao"));
      });
    }

    // LISTA DE ALUGUÉIS
    if (listaAlugueis) {
      listaAlugueis.innerHTML = "";

      if (alugueis.length === 0) {
        listaAlugueis.textContent = "Nenhum pedido de aluguel encontrado.";
      }

      alugueis.forEach((item) => {
        listaAlugueis.appendChild(criarCard(item, "aluguel"));
      });
    }
  }

  // INICIAR
  renderizarPagina();
});

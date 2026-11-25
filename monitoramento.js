document.addEventListener("DOMContentLoaded", function () {
  const listaAlertas = document.getElementById("listaAlertasMonitoramento");

  const botaoAtualizar = document.getElementById("botaoAtualizarMonitoramento");

  const ultimaAtualizacao = document.getElementById("ultimaAtualizacao");

  // ALERTAS DEMONSTRATIVOS
  const alertas = [
    {
      titulo: "Monitoramento concluído",
      descricao:
        "A área monitorada apresenta indicadores demonstrativos positivos.",
      tipo: "normal",
    },
    {
      titulo: "Atenção à umidade",
      descricao: "Recomenda-se verificar as condições de umidade do solo.",
      tipo: "atencao",
    },
    {
      titulo: "Análise da vegetação",
      descricao: "Acompanhe o desenvolvimento da cultura.",
      tipo: "normal",
    },
  ];

  // EXIBIR ALERTAS
  function carregarAlertas() {
    listaAlertas.innerHTML = "";

    alertas.forEach(function (alerta) {
      const card = document.createElement("article");

      card.className = "alerta-monitoramento " + alerta.tipo;

      const titulo = document.createElement("h3");
      titulo.textContent = alerta.titulo;

      const descricao = document.createElement("p");
      descricao.textContent = alerta.descricao;

      card.append(titulo, descricao);

      listaAlertas.appendChild(card);
    });
  }

  // ATUALIZAR INDICADORES DEMONSTRATIVOS
  function atualizarIndicadores() {
    const saude = 80 + Math.floor(Math.random() * 16);
    const umidade = 50 + Math.floor(Math.random() * 31);
    const temperatura = 22 + Math.floor(Math.random() * 10);

    document.getElementById("saudeVegetacao").textContent = saude + "%";

    document.getElementById("umidadeSolo").textContent = umidade + "%";

    document.getElementById("temperatura").textContent = temperatura + "°C";

    ultimaAtualizacao.textContent =
      "Última atualização demonstrativa: " + new Date().toLocaleString("pt-BR");
  }

  // BOTÃO
  botaoAtualizar.addEventListener("click", function () {
    atualizarIndicadores();
  });

  carregarAlertas();
});

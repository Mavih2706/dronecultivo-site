const CHAVE_ALERTAS = "droneCultivoAlertas";

function obterAlertas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_ALERTAS) || "[]");
  } catch (erro) {
    console.error("Erro ao carregar alertas:", erro);
    return [];
  }
}

function salvarAlertas(alertas) {
  localStorage.setItem(CHAVE_ALERTAS, JSON.stringify(alertas));
}

function carregarAlertas() {
  const alertas = obterAlertas();

  const pendentes = alertas.filter((alerta) => alerta.status !== "Resolvido");

  document.getElementById("alertasAltos").textContent = pendentes.filter(
    (a) => a.prioridade === "Alta",
  ).length;

  document.getElementById("alertasMedios").textContent = pendentes.filter(
    (a) => a.prioridade === "Média",
  ).length;

  document.getElementById("alertasBaixos").textContent = pendentes.filter(
    (a) => a.prioridade === "Baixa",
  ).length;

  exibirAlertas();
}

function exibirAlertas() {
  const lista = document.getElementById("listaAlertas");

  const filtro = document.getElementById("filtroPrioridade").value;

  const alertas = obterAlertas();

  let filtrados = alertas;

  if (filtro === "Resolvido") {
    filtrados = alertas.filter((alerta) => alerta.status === "Resolvido");
  } else if (filtro !== "todos") {
    filtrados = alertas.filter(
      (alerta) => alerta.prioridade === filtro && alerta.status !== "Resolvido",
    );
  } else {
    filtrados = alertas.filter((alerta) => alerta.status !== "Resolvido");
  }

  lista.innerHTML = "";

  if (filtrados.length === 0) {
    lista.textContent = "Nenhum alerta encontrado.";
    return;
  }

  filtrados
    .slice()
    .reverse()
    .forEach(function (alerta) {
      const card = document.createElement("article");
      card.className = "alerta-card";

      const titulo = document.createElement("h3");
      titulo.textContent = alerta.propriedade;

      const descricao = document.createElement("p");
      descricao.textContent = alerta.descricao;

      const data = document.createElement("p");
      data.textContent = "Data: " + alerta.data;

      const prioridade = document.createElement("span");
      prioridade.className =
        "alerta-prioridade " + alerta.prioridade.toLowerCase();

      prioridade.textContent = "Prioridade: " + alerta.prioridade;

      const status = document.createElement("p");
      status.textContent = "Status: " + alerta.status;

      card.append(titulo, descricao, data, prioridade, status);

      if (alerta.status !== "Resolvido") {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "btn-resolver";
        botao.textContent = "Marcar como resolvido";

        botao.addEventListener("click", function () {
          resolverAlerta(alerta.id);
        });

        card.appendChild(botao);
      }

      lista.appendChild(card);
    });
}

function resolverAlerta(id) {
  const alertas = obterAlertas();

  const alerta = alertas.find((item) => item.id === id);

  if (!alerta) return;

  alerta.status = "Resolvido";

  salvarAlertas(alertas);

  carregarAlertas();
}

// Atualiza os alertas ao mudar o filtro
document
  .getElementById("filtroPrioridade")
  .addEventListener("change", exibirAlertas);

// Inicializa a página
carregarAlertas();

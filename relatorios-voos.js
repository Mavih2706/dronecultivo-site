const CHAVE_VOOS_RELATORIO = "droneCultivoVoos";

function obterVoosRelatorio() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_VOOS_RELATORIO) || "[]");
  } catch (erro) {
    console.error("Erro ao carregar relatórios:", erro);
    return [];
  }
}

function formatarDataRelatorio(data) {
  if (!data) return "Não informada";

  const partes = data.split("-");

  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function criarTextoRelatorio(texto) {
  const p = document.createElement("p");
  p.textContent = texto;
  return p;
}

function criarCardRelatorio(voo) {
  const card = document.createElement("article");
  card.className = "voo-card";

  const titulo = document.createElement("h3");
  titulo.textContent = voo.propriedade || "Propriedade não informada";

  const status = document.createElement("span");
  status.className =
    voo.status === "Realizado" ? "voo-status realizado" : "voo-status agendado";

  status.textContent = voo.status || "Sem status";

  card.append(
    titulo,
    status,
    criarTextoRelatorio("Responsável: " + (voo.responsavel || "Não informado")),
    criarTextoRelatorio("Drone: " + (voo.drone || "Não informado")),
    criarTextoRelatorio("Operação: " + (voo.servico || "Não informado")),
    criarTextoRelatorio("Data: " + formatarDataRelatorio(voo.data)),
    criarTextoRelatorio("Área: " + (voo.area || "0") + " hectares"),
  );

  if (voo.observacoes) {
    card.appendChild(criarTextoRelatorio("Observações: " + voo.observacoes));
  }

  return card;
}

function atualizarRelatorios() {
  const voos = obterVoosRelatorio();

  const agendados = voos.filter((voo) => voo.status === "Agendado");

  const realizados = voos.filter((voo) => voo.status === "Realizado");

  const areaTotal = realizados.reduce((total, voo) => {
    const area = Number(String(voo.area || "0").replace(",", "."));

    return total + (Number.isFinite(area) ? area : 0);
  }, 0);

  document.getElementById("totalVoosRelatorio").textContent = voos.length;

  document.getElementById("totalAgendadosRelatorio").textContent =
    agendados.length;

  document.getElementById("totalRealizadosRelatorio").textContent =
    realizados.length;

  document.getElementById("areaTotalRelatorio").textContent =
    areaTotal.toLocaleString("pt-BR") + " hectares";

  document.getElementById("ultimaAtualizacaoRelatorio").textContent =
    "Última consulta: " + new Date().toLocaleString("pt-BR");

  aplicarFiltrosRelatorio();
}

function aplicarFiltrosRelatorio() {
  const voos = obterVoosRelatorio();

  const pesquisa = document
    .getElementById("pesquisaRelatorio")
    .value.toLowerCase()
    .trim();

  const statusSelecionado = document.getElementById("statusRelatorio").value;

  const filtrados = voos.filter((voo) => {
    const texto = [voo.propriedade, voo.responsavel, voo.drone, voo.servico]
      .join(" ")
      .toLowerCase();

    const correspondePesquisa = texto.includes(pesquisa);

    const correspondeStatus =
      statusSelecionado === "Todos" || voo.status === statusSelecionado;

    return correspondePesquisa && correspondeStatus;
  });

  const realizados = filtrados.filter((voo) => voo.status === "Realizado");

  const agendados = filtrados.filter((voo) => voo.status === "Agendado");

  const listaRealizados = document.getElementById(
    "listaVoosRealizadosRelatorio",
  );

  const listaAgendados = document.getElementById("listaVoosAgendadosRelatorio");

  listaRealizados.innerHTML = "";
  listaAgendados.innerHTML = "";

  document.getElementById("resultadoRelatorio").textContent =
    `${filtrados.length} voo(s) encontrado(s).`;

  if (realizados.length === 0) {
    listaRealizados.textContent = "Nenhum voo realizado encontrado.";
  } else {
    realizados.forEach((voo) => {
      listaRealizados.appendChild(criarCardRelatorio(voo));
    });
  }

  if (agendados.length === 0) {
    listaAgendados.textContent = "Nenhum voo agendado encontrado.";
  } else {
    agendados.forEach((voo) => {
      listaAgendados.appendChild(criarCardRelatorio(voo));
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  atualizarRelatorios();

  document
    .getElementById("pesquisaRelatorio")
    .addEventListener("input", aplicarFiltrosRelatorio);

  document
    .getElementById("statusRelatorio")
    .addEventListener("change", aplicarFiltrosRelatorio);

  document
    .getElementById("botaoAtualizarRelatorio")
    .addEventListener("click", atualizarRelatorios);

  document
    .getElementById("botaoImprimirRelatorio")
    .addEventListener("click", function () {
      window.print();
    });
});

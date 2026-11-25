const CHAVE_VOOS = "droneCultivoVoos";

const formVoo = document.getElementById("formVoo");

function obterVoos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_VOOS) || "[]");
  } catch (erro) {
    console.error("Erro ao carregar voos:", erro);
    return [];
  }
}

function salvarVoos(voos) {
  localStorage.setItem(CHAVE_VOOS, JSON.stringify(voos));
}

function criarParagrafo(texto) {
  const p = document.createElement("p");
  p.textContent = texto;
  return p;
}

function formatarData(data) {
  if (!data) return "Não informada";

  const partes = data.split("-");
  if (partes.length !== 3) return data;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Cria os filtros automaticamente
function criarFiltros() {
  if (document.getElementById("filtroVoos")) return;

  const area = document.createElement("section");
  area.className = "empresa-modulos filtro-relatorios-voos";
  area.innerHTML = `
        <h2>Consultar relatórios de voos</h2>

        <input
            type="search"
            id="filtroVoos"
            placeholder="Pesquisar propriedade, drone ou responsável..."
        >

        <select id="filtroStatus">
            <option value="Todos">Todos os status</option>
            <option value="Agendado">Agendados</option>
            <option value="Realizado">Realizados</option>
        </select>

        <p id="resultadoFiltro"></p>
        <p id="areaTotalVoos"></p>
    `;

  const lista = document.querySelector(".voos-lista");

  if (lista) {
    lista.parentNode.insertBefore(area, lista);
  }

  document.getElementById("filtroVoos").addEventListener("input", carregarVoos);

  document
    .getElementById("filtroStatus")
    .addEventListener("change", carregarVoos);
}

function carregarVoos() {
  const voos = obterVoos();

  const agendados = voos.filter((voo) => voo.status === "Agendado");
  const realizados = voos.filter((voo) => voo.status === "Realizado");

  const pesquisa = (
    document.getElementById("filtroVoos")?.value || ""
  ).toLowerCase();

  const statusSelecionado =
    document.getElementById("filtroStatus")?.value || "Todos";

  const filtrados = voos.filter((voo) => {
    const texto = [voo.propriedade, voo.responsavel, voo.drone, voo.servico]
      .join(" ")
      .toLowerCase();

    const correspondePesquisa = texto.includes(pesquisa);

    const correspondeStatus =
      statusSelecionado === "Todos" || voo.status === statusSelecionado;

    return correspondePesquisa && correspondeStatus;
  });

  const filtradosAgendados = filtrados.filter(
    (voo) => voo.status === "Agendado",
  );

  const filtradosRealizados = filtrados.filter(
    (voo) => voo.status === "Realizado",
  );

  document.getElementById("totalAgendamentos").textContent = agendados.length;

  document.getElementById("totalRealizados").textContent = realizados.length;

  document.getElementById("totalVoos").textContent = voos.length;

  const areaTotal = realizados.reduce(
    (total, voo) => total + (Number(voo.area) || 0),
    0,
  );

  document.getElementById("areaTotalVoos").textContent =
    `Área total atendida em voos realizados: ${areaTotal.toLocaleString("pt-BR")} hectares`;

  document.getElementById("resultadoFiltro").textContent =
    `${filtrados.length} voo(s) encontrado(s).`;

  const listaAgendamentos = document.getElementById("listaAgendamentos");

  const listaRealizados = document.getElementById("listaRealizados");

  listaAgendamentos.innerHTML = "";
  listaRealizados.innerHTML = "";

  if (filtradosAgendados.length === 0) {
    listaAgendamentos.textContent = "Nenhum voo agendado encontrado.";
  }

  if (filtradosRealizados.length === 0) {
    listaRealizados.textContent = "Nenhum voo realizado encontrado.";
  }

  filtradosAgendados.forEach((voo) => {
    listaAgendamentos.appendChild(criarCardVoo(voo));
  });

  filtradosRealizados.forEach((voo) => {
    listaRealizados.appendChild(criarCardVoo(voo));
  });
}

function criarCardVoo(voo) {
  const card = document.createElement("article");
  card.className = "voo-card";

  const titulo = document.createElement("h3");
  titulo.textContent = voo.propriedade;

  const status = document.createElement("span");
  status.className =
    voo.status === "Realizado" ? "voo-status realizado" : "voo-status agendado";

  status.textContent = voo.status;

  card.append(
    titulo,
    status,
    criarParagrafo("Responsável: " + voo.responsavel),
    criarParagrafo("Drone: " + voo.drone),
    criarParagrafo("Operação: " + voo.servico),
    criarParagrafo("Data: " + formatarData(voo.data)),
    criarParagrafo("Área: " + voo.area + " hectares"),
  );

  if (voo.observacoes) {
    card.appendChild(criarParagrafo("Observações: " + voo.observacoes));
  }

  if (voo.status === "Agendado") {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "btn-realizado";
    botao.textContent = "Marcar como realizado";

    botao.addEventListener("click", () => {
      atualizarStatus(voo.id);
    });

    card.appendChild(botao);
  }

  return card;
}

function atualizarStatus(id) {
  const voos = obterVoos();

  const voo = voos.find((item) => item.id === id);

  if (!voo) return;

  voo.status = "Realizado";

  salvarVoos(voos);
  carregarVoos();
}

// Cadastro de novo voo
if (formVoo) {
  formVoo.addEventListener("submit", function (event) {
    event.preventDefault();

    const voo = {
      id: Date.now(),
      propriedade: document.getElementById("propriedade").value.trim(),
      responsavel: document.getElementById("responsavel").value.trim(),
      drone: document.getElementById("drone").value,
      servico: document.getElementById("servico").value,
      data: document.getElementById("dataVoo").value,
      area: document.getElementById("area").value,
      observacoes: document.getElementById("observacoesVoo").value.trim(),
      status: "Agendado",
      dataCadastro: new Date().toISOString(),
    };

    const voos = obterVoos();

    voos.push(voo);

    salvarVoos(voos);

    document.getElementById("mensagemVoo").textContent =
      "Voo agendado com sucesso!";

    formVoo.reset();

    carregarVoos();
  });
}

// Inicialização
criarFiltros();
carregarVoos();

const CHAVE_ANALISES = "droneCultivoAnalises";

function obterAnalises() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_ANALISES) || "[]");
  } catch (erro) {
    console.error("Erro ao carregar análises:", erro);
    return [];
  }
}

function salvarAnalises(analises) {
  localStorage.setItem(CHAVE_ANALISES, JSON.stringify(analises));
}

function atualizarIndicadores() {
  const analises = obterAnalises();

  document.getElementById("totalImagens").textContent = analises.reduce(
    (total, item) => total + item.imagens,
    0,
  );

  document.getElementById("totalDeteccoes").textContent = analises.reduce(
    (total, item) => total + item.deteccoes,
    0,
  );

  if (analises.length === 0) {
    document.getElementById("confiancaMedia").textContent = "--";
    return;
  }

  const media =
    analises.reduce((total, item) => total + item.confianca, 0) /
    analises.length;

  document.getElementById("confiancaMedia").textContent =
    media.toFixed(1).replace(".", ",") + "%";
}

function criarAreaAnalise() {
  if (document.getElementById("formAnalise")) return;

  const area = document.createElement("section");
  area.className = "empresa-modulos area-analise-ia";

  area.innerHTML = `
        <h2>Nova análise agrícola</h2>

        <form id="formAnalise" class="form-propriedade">

            <label for="propriedadeIA">Nome da propriedade</label>
            <input
                type="text"
                id="propriedadeIA"
                placeholder="Digite o nome da propriedade"
                required
            >

            <label for="dataAnalise">Data da análise</label>
            <input type="date" id="dataAnalise" required>

            <label for="imagensIA">Quantidade de imagens analisadas</label>
            <input
                type="number"
                id="imagensIA"
                min="1"
                placeholder="Ex: 50"
                required
            >

            <label for="deteccoesIA">Ocorrências identificadas</label>
            <input
                type="number"
                id="deteccoesIA"
                min="0"
                placeholder="Ex: 5"
                required
            >

            <label for="confiancaIA">Confiança da detecção (%)</label>
            <input
                type="number"
                id="confiancaIA"
                min="0"
                max="100"
                step="0.1"
                placeholder="Ex: 92"
                required
            >

            <label for="observacaoIA">Observações e recomendações</label>
            <textarea
                id="observacaoIA"
                rows="4"
                placeholder="Descreva as ocorrências observadas..."
            ></textarea>

            <button type="submit">Registrar análise</button>

            <p id="mensagemIA"></p>
        </form>
    `;

  const aviso = document.querySelector(".aviso-ia");

  if (aviso) {
    aviso.parentNode.insertBefore(area, aviso);
  }
}

function criarHistorico() {
  if (document.getElementById("listaAnalises")) return;

  const area = document.createElement("section");
  area.className = "empresa-modulos historico-ia";

  area.innerHTML = `
        <h2>Histórico de análises</h2>
        <div id="listaAnalises"></div>
    `;

  const aviso = document.querySelector(".aviso-ia");

  if (aviso) {
    aviso.parentNode.insertBefore(area, aviso);
  }
}

function carregarHistorico() {
  const lista = document.getElementById("listaAnalises");
  const analises = obterAnalises();

  lista.innerHTML = "";

  if (analises.length === 0) {
    lista.textContent = "Nenhuma análise registrada.";
    return;
  }

  analises
    .slice()
    .reverse()
    .forEach((item) => {
      const card = document.createElement("article");
      card.className = "voo-card";

      const titulo = document.createElement("h3");
      titulo.textContent = item.propriedade;

      const data = item.data.split("-");
      const dataFormatada =
        data.length === 3 ? `${data[2]}/${data[1]}/${data[0]}` : item.data;

      const detalhes = [
        `Data: ${dataFormatada}`,
        `Imagens analisadas: ${item.imagens}`,
        `Ocorrências identificadas: ${item.deteccoes}`,
        `Confiança informada: ${item.confianca}%`,
        `Observações: ${item.observacoes || "Nenhuma"}`,
      ];

      card.appendChild(titulo);

      detalhes.forEach((texto) => {
        const p = document.createElement("p");
        p.textContent = texto;
        card.appendChild(p);
      });

      lista.appendChild(card);
    });
}

function registrarAnalise(event) {
  event.preventDefault();

  const analise = {
    id: Date.now(),
    propriedade: document.getElementById("propriedadeIA").value.trim(),
    data: document.getElementById("dataAnalise").value,
    imagens: Number(document.getElementById("imagensIA").value),
    deteccoes: Number(document.getElementById("deteccoesIA").value),
    confianca: Number(document.getElementById("confiancaIA").value),
    observacoes: document.getElementById("observacaoIA").value.trim(),
  };

  if (
    !analise.propriedade ||
    analise.imagens < 1 ||
    analise.deteccoes < 0 ||
    analise.confianca < 0 ||
    analise.confianca > 100
  ) {
    document.getElementById("mensagemIA").textContent =
      "Confira os dados informados.";
    return;
  }

  const analises = obterAnalises();
  analises.push(analise);

  salvarAnalises(analises);

  document.getElementById("mensagemIA").textContent =
    "Análise registrada com sucesso!";

  event.target.reset();

  atualizarIndicadores();
  carregarHistorico();
}

document.addEventListener("DOMContentLoaded", function () {
  criarAreaAnalise();
  criarHistorico();

  document
    .getElementById("formAnalise")
    .addEventListener("submit", registrarAnalise);

  atualizarIndicadores();
  carregarHistorico();
});

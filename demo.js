// DRONECULTIVO - SISTEMA DE DEMONSTRAÇÃO

const CHAVE_DEMO = "dronecultivo_demo_v2";

function obterDadosDemo() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_DEMO);

    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);

      if (!Array.isArray(dados.propriedades)) {
        dados.propriedades = [];
      }

      return dados;
    }
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }

  const dadosIniciais = {
    fazendeiros: [
      {
        nome: "João Silva",
        propriedade: "Fazenda Verde",
        cidade: "São Paulo",
      },
      {
        nome: "Carlos Oliveira",
        propriedade: "Fazenda Esperança",
        cidade: "Campinas",
      },
    ],
    drones: [
      { nome: "Drone 01", status: "Disponível" },
      { nome: "Drone 02", status: "Em operação" },
      { nome: "Drone 03", status: "Manutenção" },
    ],
    propriedades: [],
    alertas: [
      {
        tipo: "Possível presença de pragas",
        propriedade: "Fazenda Verde",
      },
      {
        tipo: "Possível falha na plantação",
        propriedade: "Fazenda Esperança",
      },
    ],
  };

  salvarDadosDemo(dadosIniciais);
  return dadosIniciais;
}

function salvarDadosDemo(dados) {
  localStorage.setItem(CHAVE_DEMO, JSON.stringify(dados));
}

function cadastrarPropriedade(propriedade) {
  const dados = obterDadosDemo();

  propriedade.id = Date.now();

  dados.propriedades.push(propriedade);

  salvarDadosDemo(dados);
}

function excluirPropriedade(id) {
  const dados = obterDadosDemo();

  dados.propriedades = dados.propriedades.filter(
    (propriedade) => propriedade.id !== id,
  );

  salvarDadosDemo(dados);
}

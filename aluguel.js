document.addEventListener("DOMContentLoaded", function () {
  const formAluguel = document.getElementById("formAluguel");

  if (formAluguel) {
    formAluguel.addEventListener("submit", function (event) {
      event.preventDefault();

      const aluguel = {
        id: Date.now(),
        nome: document.getElementById("nome").value.trim(),
        propriedade: document.getElementById("propriedade").value.trim(),
        localizacao: document.getElementById("localizacao").value.trim(),
        servico: document.getElementById("servico").value,
        area: document.getElementById("area").value,
        inicio: document.getElementById("inicio").value,
        periodo: document.getElementById("periodo").value,
        observacoes: document.getElementById("observacoes").value.trim(),
        status: "Pendente",
        dataSolicitacao: new Date().toISOString(),
      };

      const chave = "droneCultivoAlugueis";

      let alugueis = [];

      try {
        alugueis = JSON.parse(localStorage.getItem(chave) || "[]");
      } catch (erro) {
        console.error("Erro ao carregar aluguéis:", erro);
      }

      alugueis.push(aluguel);

      localStorage.setItem(chave, JSON.stringify(alugueis));

      document.getElementById("mensagemAluguel").textContent =
        "Solicitação de aluguel enviada com sucesso!";

      formAluguel.reset();
    });
  }
});

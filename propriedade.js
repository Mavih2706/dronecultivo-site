document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formPropriedade");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const propriedade = {
      id: Date.now(),
      nome: document.getElementById("nome").value.trim(),
      proprietario: document.getElementById("proprietario").value.trim(),
      localizacao: document.getElementById("localizacao").value.trim(),
      tamanho: document.getElementById("tamanho").value,
      cultivo: document.getElementById("cultivo").value,
    };

    try {
      cadastrarPropriedade(propriedade);

      document.getElementById("mensagemPropriedade").textContent =
        "Propriedade cadastrada com sucesso!";

      form.reset();
    } catch (erro) {
      console.error("Erro ao cadastrar propriedade:", erro);

      document.getElementById("mensagemPropriedade").textContent =
        "Não foi possível cadastrar a propriedade.";
    }
  });
});

console.log("DroneCultivo iniciado com sucesso!");

document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", () => {
    console.log("Navegação:", link.textContent);
  });
});

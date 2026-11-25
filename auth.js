const CHAVE_USUARIOS = "droneCultivoUsuarios";
const CHAVE_SESSAO = "droneCultivoSessao";

// Recupera os usuários cadastrados
function obterUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
  } catch {
    return [];
  }
}

// Salva os usuários
function salvarUsuarios(usuarios) {
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

// Criptografa a senha para a demonstração
async function gerarHash(senha, salt) {
  const encoder = new TextEncoder();

  const chave = await crypto.subtle.importKey(
    "raw",
    encoder.encode(senha),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const resultado = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 120000,
      hash: "SHA-256",
    },
    chave,
    256,
  );

  return Array.from(new Uint8Array(resultado))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Gera o salt da senha
function gerarSalt() {
  const salt = crypto.getRandomValues(new Uint8Array(16));

  return Array.from(salt)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Converte o salt para bytes
function saltParaBytes(salt) {
  return new Uint8Array(salt.match(/.{2}/g).map((byte) => parseInt(byte, 16)));
}

// Direciona o usuário conforme o tipo de conta
function redirecionarUsuario(usuario) {
  const destino =
    usuario.tipo === "fazendeiro" ? "fazendeiro.html" : "empresa.html";

  window.location.assign(new URL(destino, window.location.href).href);
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const parametros = new URLSearchParams(window.location.search);

  if (parametros.get("cadastro") === "sucesso") {
    document.getElementById("mensagem").textContent =
      "Conta criada com sucesso! Faça seu login.";

    document.getElementById("email").value = parametros.get("email") || "";
  }

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();

    const senha = document.getElementById("senha").value;

    const mensagem = document.getElementById("mensagem");

    try {
      const usuarios = obterUsuarios();

      const usuario = usuarios.find((item) => item.email === email);

      if (!usuario) {
        mensagem.textContent = "E-mail ou senha incorretos.";
        return;
      }

      const hash = await gerarHash(senha, saltParaBytes(usuario.salt));

      if (hash !== usuario.senhaHash) {
        mensagem.textContent = "E-mail ou senha incorretos.";
        return;
      }

      const sessao = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      };

      localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));

      redirecionarUsuario(usuario);
    } catch (erro) {
      console.error(erro);
      mensagem.textContent =
        "Não foi possível realizar o login. Tente novamente.";
    }
  });
}

// CADASTRO
const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {
  cadastroForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();

    const email = document.getElementById("email").value.trim().toLowerCase();

    const senha = document.getElementById("senha").value;

    const tipo = document.getElementById("tipo").value;

    const mensagem = document.getElementById("mensagem");

    try {
      if (!nome || !email || !senha || !tipo) {
        mensagem.textContent = "Preencha todos os campos.";
        return;
      }

      if (senha.length < 6) {
        mensagem.textContent = "A senha precisa ter pelo menos 6 caracteres.";
        return;
      }

      if (!["fazendeiro", "empresa"].includes(tipo)) {
        mensagem.textContent = "Selecione um tipo de conta válido.";
        return;
      }

      const usuarios = obterUsuarios();

      const emailExiste = usuarios.some((usuario) => usuario.email === email);

      if (emailExiste) {
        mensagem.textContent = "Este e-mail já está cadastrado.";
        return;
      }

      const salt = gerarSalt();

      const senhaHash = await gerarHash(senha, saltParaBytes(salt));

      const novoUsuario = {
        id: Date.now(),
        nome,
        email,
        senhaHash,
        salt,
        tipo,
        dataCadastro: new Date().toISOString(),
      };

      usuarios.push(novoUsuario);
      salvarUsuarios(usuarios);

      const sessao = {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipo: novoUsuario.tipo,
      };

      localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));

      redirecionarUsuario(novoUsuario);
    } catch (erro) {
      console.error(erro);
      mensagem.textContent = "Não foi possível criar a conta. Tente novamente.";
    }
  });
}

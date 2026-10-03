// =====================================================
// 3DM — PORTAL CINEMATOGRÁFICO DAS MEMÓRIAS
// =====================================================

const API_URL = "http://localhost:3000";

// =====================================================
// ELEMENTOS
// =====================================================

const searchInput = document.getElementById("name-search");

const searchResults = document.getElementById("search-results");

const tributeModal = document.getElementById("tribute-modal");

const lockScreen = document.getElementById("tribute-lock-screen");

const memoryLock = document.getElementById("memory-lock");

const lockPersonName = document.getElementById("lock-person-name");

const passwordInput = document.getElementById("tribute-password");

const passwordSubmit = document.getElementById("password-submit");

const passwordError = document.getElementById("password-error");

const tributeCancel = document.getElementById("tribute-cancel");

const tributeMemory = document.getElementById("tribute-memory");

const tributeClose = document.getElementById("tribute-close");

const tributeImage = document.getElementById("tribute-image");

const tributeTitle = document.getElementById("tribute-title");

const tributeMessage = document.getElementById("tribute-message");

const tributeFooter = document.getElementById("tribute-footer");

const particlesContainer = document.getElementById("memory-particles");

// =====================================================
// PESSOA ATUAL
// =====================================================

let pessoaSelecionada = null;

// =====================================================
// CRIAR PARTÍCULAS
// =====================================================

function criarParticulas() {
  particlesContainer.innerHTML = "";

  const quantidade = 90;

  for (let i = 0; i < quantidade; i++) {
    const particle = document.createElement("span");

    particle.className = "memory-particle";

    const x = Math.random() * 100;

    const y = Math.random() * 100;

    const duration = 4 + Math.random() * 7;

    const delay = Math.random() * 6;

    const moveX = (Math.random() - 0.5) * 150;

    const explodeX = (Math.random() - 0.5) * 900;

    const explodeY = (Math.random() - 0.5) * 600;

    particle.style.left = `${x}%`;

    particle.style.top = `${y}%`;

    particle.style.setProperty("--duration", `${duration}s`);

    particle.style.setProperty("--delay", `${delay}s`);

    particle.style.setProperty("--move-x", `${moveX}px`);

    particle.style.setProperty("--explode-x", `${explodeX}px`);

    particle.style.setProperty("--explode-y", `${explodeY}px`);

    particlesContainer.appendChild(particle);
  }
}

// =====================================================
// BUSCAR NOMES
// =====================================================

async function carregarNomes() {
  try {
    const resposta = await fetch(`${API_URL}/api/homenagens`);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar homenagens.");
    }

    return await resposta.json();
  } catch (erro) {
    console.error(erro);

    searchResults.innerHTML = `
      <div class="search-empty">
        Não foi possível carregar as lembranças.
      </div>
    `;

    return [];
  }
}

// =====================================================
// PESQUISAR
// =====================================================

async function pesquisarHomenagens() {
  const termo = searchInput.value.trim().toLowerCase();

  searchResults.innerHTML = "";

  if (!termo) {
    return;
  }

  const pessoas = await carregarNomes();

  const encontrados = pessoas.filter((pessoa) =>
    pessoa.nome.toLowerCase().includes(termo),
  );

  if (encontrados.length === 0) {
    searchResults.innerHTML = `
      <div class="search-empty">
        Não encontrei nenhuma lembrança com esse nome.
      </div>
    `;

    return;
  }

  encontrados.forEach((pessoa) => {
    const resultado = document.createElement("button");

    resultado.type = "button";

    resultado.className = "search-result";

    resultado.innerHTML = `

        <div class="search-result-info">

          <span class="search-result-icon">
            ✦
          </span>

          <div>

            <span class="search-result-name">
              ${pessoa.nome}
            </span>

            <span class="search-result-hint">
              Existe uma lembrança esperando por você
            </span>

          </div>

        </div>

        <span class="search-result-arrow">
          →
        </span>

      `;

    resultado.addEventListener("click", () => iniciarPortal(pessoa));

    searchResults.appendChild(resultado);
  });
}

// =====================================================
// INICIAR PORTAL
// =====================================================

function iniciarPortal(pessoa) {
  pessoaSelecionada = pessoa;

  lockPersonName.textContent = pessoa.nome;

  passwordInput.value = "";

  passwordError.textContent = "";

  lockScreen.classList.remove("unlocking");

  memoryLock.classList.remove("unlocked");

  memoryLock.classList.remove("shake");

  tributeMemory.classList.remove("revealed");

  tributeModal.classList.add("open");

  tributeModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  criarParticulas();

  setTimeout(() => {
    passwordInput.focus();
  }, 500);
}

// =====================================================
// TENTAR ABRIR
// =====================================================

async function tentarAbrir() {
  if (!pessoaSelecionada) {
    return;
  }

  const senha = passwordInput.value.trim();

  if (!senha) {
    passwordError.textContent = "Digite a senha para continuar.";

    memoryLock.classList.remove("shake");

    void memoryLock.offsetWidth;

    memoryLock.classList.add("shake");

    return;
  }

  passwordError.textContent = "Verificando...";

  try {
    const resposta = await fetch(
      `${API_URL}/api/homenagens/${pessoaSelecionada.id}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          senha: senha,
        }),
      },
    );

    const dados = await resposta.json();

    // =========================================
    // SENHA ERRADA
    // =========================================

    if (!resposta.ok) {
      passwordError.textContent = "Essa senha não abre esta lembrança.";

      memoryLock.classList.remove("shake");

      void memoryLock.offsetWidth;

      memoryLock.classList.add("shake");

      passwordInput.select();

      return;
    }

    // =========================================
    // SENHA CORRETA
    // =========================================

    passwordError.textContent = "";

    desbloquearMemoria(dados);
  } catch (erro) {
    console.error(erro);

    passwordError.textContent = "Não foi possível conectar ao servidor.";
  }
}

// =====================================================
// DESBLOQUEAR MEMÓRIA
// =====================================================

function desbloquearMemoria(dados) {
  // -----------------------------------------
  // PREPARAR CONTEÚDO
  // -----------------------------------------

  tributeTitle.textContent = dados.nome;

  tributeMessage.textContent = dados.mensagem;

  tributeFooter.textContent = dados.legenda || "3DM · O que fica";

  if (dados.foto) {
    tributeImage.src = `img/homenagens/${dados.foto}`;

    tributeImage.alt = `Foto da homenagem de ${dados.nome}`;
  }

  // -----------------------------------------
  // COMEÇA A ANIMAÇÃO
  // -----------------------------------------

  memoryLock.classList.add("unlocked");

  // -----------------------------------------
  // EXPLOSÃO DAS PARTÍCULAS
  // -----------------------------------------

  setTimeout(() => {
    particlesContainer.classList.add("explode");
  }, 250);

  // -----------------------------------------
  // TELA DO CADEADO DESAPARECE
  // -----------------------------------------

  setTimeout(() => {
    lockScreen.classList.add("unlocking");
  }, 500);

  // -----------------------------------------
  // MEMÓRIA APARECE
  // -----------------------------------------

  setTimeout(() => {
    tributeMemory.classList.add("revealed");
  }, 1000);
}

// =====================================================
// FECHAR PORTAL
// =====================================================

function fecharPortal() {
  tributeModal.classList.remove("open");

  tributeModal.setAttribute("aria-hidden", "true");

  tributeMemory.classList.remove("revealed");

  lockScreen.classList.remove("unlocking");

  memoryLock.classList.remove("unlocked");

  particlesContainer.classList.remove("explode");

  document.body.style.overflow = "";

  pessoaSelecionada = null;
}

// =====================================================
// VOLTAR
// =====================================================

tributeCancel.addEventListener("click", fecharPortal);

tributeClose.addEventListener("click", fecharPortal);

// =====================================================
// ABRIR COM BOTÃO
// =====================================================

passwordSubmit.addEventListener("click", tentarAbrir);

// =====================================================
// ENTER NA SENHA
// =====================================================

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    tentarAbrir();
  }
});

// =====================================================
// ESC
// =====================================================

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && tributeModal.classList.contains("open")) {
    fecharPortal();
  }
});

// =====================================================
// CTRL + K
// =====================================================

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();

    searchInput.focus();

    searchInput.select();
  }
});

// =====================================================
// PESQUISA
// =====================================================

searchInput.addEventListener("input", pesquisarHomenagens);

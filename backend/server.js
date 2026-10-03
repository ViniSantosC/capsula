const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// CARREGAR AS HOMENAGENS
// ==========================================

const arquivoHomenagens = path.join(__dirname, "homenagens.json");

function carregarHomenagens() {
  const dados = fs.readFileSync(arquivoHomenagens, "utf8");
  return JSON.parse(dados);
}

// ==========================================
// BUSCAR NOMES
// ==========================================

app.get("/api/homenagens", (req, res) => {
  const homenagens = carregarHomenagens();

  const nomesPublicos = homenagens.map((pessoa) => ({
    id: pessoa.id,
    nome: pessoa.nome,
  }));

  res.json(nomesPublicos);
});

// ==========================================
// ABRIR UMA HOMENAGEM
// ==========================================

app.post("/api/homenagens/:id", (req, res) => {
  const { id } = req.params;
  const { senha } = req.body;

  const homenagens = carregarHomenagens();

  const pessoa = homenagens.find((item) => item.id === id);

  if (!pessoa) {
    return res.status(404).json({
      erro: "Homenagem não encontrada.",
    });
  }

  // ========================================
  // VERIFICAR SENHA
  // ========================================

  if (senha !== pessoa.senha) {
    return res.status(401).json({
      erro: "Senha incorreta.",
    });
  }

  // ========================================
  // SÓ AGORA DEVOLVEMOS OS DADOS PRIVADOS
  // ========================================

  res.json({
    nome: pessoa.nome,
    foto: pessoa.foto,
    mensagem: pessoa.mensagem,
    legenda: pessoa.legenda,
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(`
  ======================================
       3DM — SERVIDOR INICIADO
  ======================================

  http://localhost:${PORT}

  ======================================
  `);
});

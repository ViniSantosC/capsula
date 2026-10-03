// Seleciona a única estrutura global de zoom da página
const fotoAmpliada = document.querySelector(".foto-ampliada");
const imagemAmpliada = document.querySelector(".foto-ampliada img");
const fecharFoto = document.querySelector(".fechar-foto");

// Seleciona todos os blocos de álbuns da página
const albuns = document.querySelectorAll(".bloco-album");

albuns.forEach((album) => {
  const btnAbrir = album.querySelector(".abrir-galeria");
  const btnFechar = album.querySelector(".fechar-galeria");
  const overlay = album.querySelector(".galeria-overlay");
  const fotos = album.querySelectorAll(".foto-item");

  // Abre apenas a galeria do álbum correspondente
  if (btnAbrir && overlay) {
    btnAbrir.addEventListener("click", () => {
      overlay.classList.add("aberta");
    });
  }

  // Fecha apenas a galeria do álbum correspondente
  if (btnFechar && overlay) {
    btnFechar.addEventListener("click", () => {
      overlay.classList.remove("aberta");
    });
  }

  // Gerencia o clique em cada miniatura deste álbum específico
  fotos.forEach((foto) => {
    foto.addEventListener("click", () => {
      const imagem = foto.querySelector("img");
      const posicao = foto.getBoundingClientRect();

      imagemAmpliada.src = imagem.src;
      fotoAmpliada.classList.add("aberta");

      // Define a posição inicial com base na miniatura clicada
      imagemAmpliada.style.left = `${posicao.left}px`;
      imagemAmpliada.style.top = `${posicao.top}px`;
      imagemAmpliada.style.width = `${posicao.width}px`;
      imagemAmpliada.style.height = `${posicao.height}px`;

      // Executa o efeito de expansão suave
      setTimeout(() => {
        imagemAmpliada.style.left = "5%";
        imagemAmpliada.style.top = "7%";
        imagemAmpliada.style.width = "90%";
        imagemAmpliada.style.height = "86%";
        imagemAmpliada.style.opacity = "1";
      }, 50);
    });
  });
});

// Fecha o zoom da foto limpando as propriedades
fecharFoto.addEventListener("click", () => {
  fotoAmpliada.classList.remove("aberta");
  imagemAmpliada.style.left = "";
  imagemAmpliada.style.top = "";
  imagemAmpliada.style.width = "";
  imagemAmpliada.style.height = "";
  imagemAmpliada.style.opacity = "";
});

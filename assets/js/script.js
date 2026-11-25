document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const linksMenu = document.querySelectorAll(".menu a");
  const linksMenuPrincipal = document.querySelectorAll(
    ".menu ul li a:not(.btn-contato)",
  );
  const linksTopo = document.querySelectorAll('a[href="#home"]');
  const botaoVoltarTopo = document.querySelector(".voltar-topo");
  const secoes = document.querySelectorAll("main section[id]");
  const itensAnimados = document.querySelectorAll(
    ".card-pilar, .card-servico, .item-adicional, .faixa-personalizado, .cartao-endereco",
  );
  const prefereMenosMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const definirLinkAtivo = (id) => {
    linksMenuPrincipal.forEach((a) => {
      const corresponde = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("ativo", corresponde);
    });
  };

  // 1. Garante rolagem suave ao topo em todos os links #home (menu, logos e botão flutuante)
  linksTopo.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (menuToggle) menuToggle.checked = false;

      if (window.location.hash !== "#home") {
        history.pushState(null, "", "#home");
      }

      definirLinkAtivo("home");
      window.scrollTo({
        top: 0,
        behavior: prefereMenosMovimento ? "auto" : "smooth",
      });
    });
  });

  // 2. Fecha o menu mobile e atualiza o estado ativo ao clicar nos demais links
  linksMenu.forEach((link) => {
    link.addEventListener("click", () => {
      if (menuToggle) menuToggle.checked = false;

      const href = link.getAttribute("href");
      if (href && href.startsWith("#") && href !== "#home") {
        definirLinkAtivo(href.slice(1));
      }
    });
  });

  // 3. Controla a visibilidade do botão "Voltar ao topo"
  const atualizarBotaoTopo = () => {
    if (!botaoVoltarTopo) return;
    botaoVoltarTopo.classList.toggle("visivel", window.scrollY > 400);
  };

  // 4. Sincroniza o link ativo no menu conforme a rolagem estabiliza
  let timerFimScroll = null;
  let rolagemProgramatica = false;

  linksMenuPrincipal.forEach((link) => {
    link.addEventListener("click", () => {
      rolagemProgramatica = true;
    });
  });

  const atualizarLinkAtivoNoScroll = () => {
    if (rolagemProgramatica) return;

    if (window.scrollY < 150) {
      definirLinkAtivo("home");
      return;
    }

    const offsetHeader = 110;
    let secaoAtualId = "home";

    secoes.forEach((secao) => {
      const id = secao.getAttribute("id");
      if (id && secao.getBoundingClientRect().top <= offsetHeader) {
        secaoAtualId = id;
      }
    });

    definirLinkAtivo(secaoAtualId);
  };

  window.addEventListener(
    "scroll",
    () => {
      atualizarBotaoTopo();
      atualizarLinkAtivoNoScroll();

      clearTimeout(timerFimScroll);
      timerFimScroll = setTimeout(() => {
        rolagemProgramatica = false;
        atualizarLinkAtivoNoScroll();
      }, 120);
    },
    { passive: true },
  );

  atualizarBotaoTopo();
  atualizarLinkAtivoNoScroll();

  // 5. Revelação suave ao rolar (respeitando preferência por menos movimento)
  if (
    !prefereMenosMovimento &&
    itensAnimados.length > 0 &&
    "IntersectionObserver" in window
  ) {
    document.body.classList.add("js-animacoes-ativas");

    const observadorItens = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("revelado");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    itensAnimados.forEach((item) => observadorItens.observe(item));
  }
});

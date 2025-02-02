document.addEventListener('DOMContentLoaded', function () {
    const button = document.querySelector('.voltarTopo');
    
    // Esconde o botão inicialmente
    button.style.display = 'none';
    
    // Evento de rolagem
    window.addEventListener('scroll', function () {
      if (window.scrollY > 200) { // Mostra o botão se rolar mais de 100px
        button.style.display = 'block';
      } else { // Esconde o botão se voltar para o topo
        button.style.display = 'none';
    }
    }); 
    // Evento de clique para voltar ao topo
    button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});  
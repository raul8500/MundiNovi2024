function toggleMenu() {
  document.getElementById('menu').classList.toggle('active');
}

let posicionOpiniones = 0;

function moverCarrusel(direccion) {
  const contenedor = document.getElementById('contenedorOpiniones');
  const card = contenedor.querySelector('.card-opinion');
  const cardWidth = card.offsetWidth + 40; // 40 = gap
  const visibleCards = 3;

  const maxScroll = (contenedor.children.length - visibleCards) * cardWidth;

  posicionOpiniones += direccion * cardWidth;

  if (posicionOpiniones < 0) posicionOpiniones = 0;
  if (posicionOpiniones > maxScroll) posicionOpiniones = maxScroll;

  contenedor.style.transform = `translateX(-${posicionOpiniones}px)`;
}

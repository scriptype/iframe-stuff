const button = document.getElementById('reAnimate')
button.onclick = () => {
  init();
  clearInterval(interval);
}
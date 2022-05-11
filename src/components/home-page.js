var cotton = document.querySelector('#cottonBtn');
cotton.addEventListener('click', (e) => {
  sessionStorage.setItem('filter', '1');
});
var micro = document.querySelector('#microBtn');
micro.addEventListener('click', (e) => {
  console.log('microbtn');

  sessionStorage.setItem('filter', '2');
  location.replace('../components/product-catalog.html');
});
var flannel = document.querySelector('#flannelBtn');
flannel.addEventListener('click', (e) => {
  sessionStorage.setItem('filter', '3');
});
var satin = document.querySelector('#satinBtn');
satin.addEventListener('click', (e) => {
  sessionStorage.setItem('filter', '4');
});
var jersey = document.querySelector('#jerseyBtn');
jersey.addEventListener('click', (e) => {
  sessionStorage.setItem('filter', '5');
});

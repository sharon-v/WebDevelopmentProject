fetch('../components/footer.html')
  .then((res) => res.text())
  .then((text) => {
    const oldelem = document.querySelector('script#replace_with_footer');
    const newelem = document.createElement('div');
    newelem.innerHTML = text;
    oldelem.parentNode.replaceChild(newelem, oldelem);
  });

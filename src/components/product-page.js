import { dbShoppingCart, dbProducts } from '../firebase/data.js';

function changeValues(element, url, Pname, Pdescription, pPrice, pSale, psku) {
    element.removeAttribute('hidden')
    let Proname = element.querySelector('#sheetsName');
    Proname.innerHTML = Pname;
    let Prodescription = element.querySelector('#proDescription');
    Prodescription.innerHTML = Pdescription;
    let price = element.querySelector('#proPrice');
    price.innerHTML = pPrice + "₪";
    let sale = element.querySelector('#proSale');
    if (pSale == "") {
        sale.innerHTML = "no sale";
    }
    else {
        sale.innerHTML = pSale + "₪";
    }
    let sku = element.querySelector('#proSku');
    console.log(psku);
    sku.innerHTML = psku;

    // show the image product

    // document.querySelector('#imageProd').style.backgroundImage = `url(${url})`;
    // let imageProd = element.querySelector('#imageProd');
    // imageProd.src = url;



    // dont forget add to shooping cart lisener

    return element;
}


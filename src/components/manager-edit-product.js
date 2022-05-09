import { dbProducts } from '../firebase/data.js';

/* code to displaying picture in add/edit new product page */
const image_input = document.querySelector('#image-input');

image_input.addEventListener('change', function () {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const uploaded_image = reader.result;
        document.querySelector('#display-image').style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
});
/* end - code to displaying picture in add/edit new product page */

console.log('enter');

document.addEventListener('DOMContentLoaded', () => {
    console.log('in');
    var btn = document.getElementById('button');
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('clicked on Add product');
        const Pname = document.getElementById('edit_sheets_name').value;
        const description = document.getElementById('edit_sheets_description').value;
        const price = document.getElementById('edit_sheets_price').value;
        const sale = document.getElementById('edit_sheets_sale').value;
        const sku = document.getElementById('edit_sheets_sku').value;
        const size90x200 = document.getElementById('quantity_90x200').value;
        const size120x200 = document.getElementById('quantity_120x200').value;
        const size160x200 = document.getElementById('quantity_160x200').value;
        const size180x200 = document.getElementById('quantity_180x200').value;
        const fabric = document.getElementById('fabric_sheets').value;
        const isJustLandedCbChecked = document.getElementById('formCheck-1').isCbChecked;
        const isFewLeftCbChecked = document.getElementById('formCheck-2').isCbChecked;

        // changeValues(Pname, description, price, sale, sku, size90x200, size120x200, size160x200, size180x200, fabric, isJustLandedCbChecked, isFewLeftCbChecked);
    });
});

document.querySelector('#spinner').style.visibility = 'visible';

initialization();
function initialization() {
    var prodName = sessionStorage.getItem('Pname');
    dbProducts.where("Pname", "==", prodName).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            editElement(doc.data().Pname, doc.data().description, doc.data().price, doc.data().sale, doc.data().sku, doc.data().size90x200, doc.data().size120x200, doc.data().size160x200, doc.data().size180x200, doc.data().fabric, doc.data().isJustLandedCbChecked, doc.data().isFewLeftCbChecked);
        });
    })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

function editElement(Pname, description, price, sale, sku, size90x200, size120x200, size160x200, size180x200, fabric, isJustLandedCbChecked, isFewLeftCbChecked) {
    let ele = document.querySelector('#product')
    ele = changeValues(ele, Pname, description, price, sale, sku, size90x200, size120x200, size160x200, size180x200, fabric, isJustLandedCbChecked, isFewLeftCbChecked)
    ele.style.visibility = "visible";
}

function changeValues(Pname, description, price, sale, sku, size90x200, size120x200, size160x200, size180x200, fabric, isJustLandedCbChecked, isFewLeftCbChecked) {
    element.removeAttribute('hidden')
    let Proname = element.querySelector('#edit_sheets_name');
    Proname.innerHTML = Pname;
    let Prodescription = element.querySelector('#edit_sheets_description');
    Prodescription.innerHTML = description;
    let proprice = element.querySelector('#edit_sheets_price');
    proprice.innerHTML = price;
    let sale = element.querySelector('#edit_sheets_sale');
    sale.innerHTML = sale;
    let sku = element.querySelector('#edit_sheets_sku');
    sku.innerHTML = sku;
    let prosize90x200 = element.querySelector('#quantity_90x200');
    prosize90x200.innerHTML = size90x200;
    let prosize120x200 = element.querySelector('#quantity_120x200');
    prosize120x200.innerHTML = size120x200;
    let prosize160x200 = element.querySelector('#quantity_160x200');
    prosize160x200.innerHTML = size160x200;
    let prosize180x200 = element.querySelector('#quantity_180x200');
    prosize180x200.innerHTML = size180x200;


    // let imageProd = element.querySelector('#imageProd');
    // imageProd.src = url;

    return element;
}



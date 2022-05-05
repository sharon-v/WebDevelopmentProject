import { dbProducts } from '../firebase/data.js';

/* code to displaying picture in add/edit new product page */
const image_input = document.querySelector('#image-input');

image_input.addEventListener('change', function() {
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
        const isOnSaleCbChecked = document.getElementById('formCheck-2').isCbChecked;
        //add picture

        console.log(Pname);
        console.log(description);
        console.log(price);
        console.log(sale);
        console.log(sku);
        console.log(size90x200);
        console.log(size120x200);
        console.log(size160x200);
        console.log(size180x200);
        console.log(isJustLandedCbChecked);
        console.log(isOnSaleCbChecked);
        console.log(fabric);
    });
});


function changeValues(Pname, description, price, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked,isOnSaleCbChecked, fabric, ImagesRef, sale){
    console.log(Pname);
    console.log(description);
    console.log(price);
    console.log(sale);
    console.log(sku);
    console.log(size90x200);
    console.log(size120x200);
    console.log(size160x200);
    console.log(size180x200);
    console.log(isJustLandedCbChecked);
    console.log(isOnSaleCbChecked);
    console.log(fabric);

    element.removeAttribute('hidden')
    let Number = element.querySelector('#orderNumber');
    Number.innerHTML = orderNumber;
    let orderDate = element.querySelector('#orderDate');
    orderDate.innerHTML = new Intl.DateTimeFormat('en-GB').format(date.toDate());
    let buyerName = element.querySelector('#buyerName');
    
    //get product by sku
    dbProducts.where("sku", "==", sku).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            sku.innerHTML = String(doc.data().Pname);
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    let amount = element.querySelector('#orderAmount');
    amount.innerHTML = totalAmount.toFixed(2);
    let selectOp = element.querySelector('#selectOp');
    let currentTime = Date.now();
    let differ = Date.now() - date.toDate() ;
    let Difference_In_hours =Math.ceil(differ / (1000 * 3600 * 24));
    if (Difference_In_hours > 1){
        selectOp.disabled = false;
    }
    else{
        selectOp.disabled = true;
    }
    selectOp.addEventListener('change', () => {
        if(selectOp.options[ selectOp.selectedIndex ].value == 2){
            //needs to update the order status
        }
    })
    var orderPage = element.querySelector('#orderPage');
    orderPage.addEventListener('click', () => {
        sessionStorage.setItem('orderNumber', orderNumber); //moving parameters to order summery page
        location.replace('../components/order-summary.html');
    })
    return element;
}
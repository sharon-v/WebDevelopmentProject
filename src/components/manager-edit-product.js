import {
    dbProducts
} from '../firebase/data.js';

console.log('enter');

document.addEventListener('DOMContentLoaded', () => {
    console.log('in');

    var btn = document.getElementById('button');
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('clicked on Add product');
        const Pname = document.getElementById('edit_product_name').value;
        const description = document.getElementById('edit_product_description').value;
        const price = document.getElementById('edit_product_price').value;
        const sale = document.getElementById('edit_product_sale').value;
        const sku = document.getElementById('edit_product_sku').value;
        const size90x200 = document.getElementById('product_page_quantity_90x200').value;
        const size120x200 = document.getElementById('product_page_quantity_120x200').value;
        const size160x200 = document.getElementById('product_page_quantity_160x200').value;
        const size180x200 = document.getElementById('product_page_quantity_180x200').value;
        const hashtags = document.getElementById('hashtags').value;
        const fabric = document.getElementById('Fabric').value;


        const is90x200CbChecked = document.getElementById('edit_product_90x200').isCbChecked;
        const is120x200CbChecked = document.getElementById('edit_product_120x200').isCbChecked;
        const is160x200CbChecked = document.getElementById('edit_product_160x200').isCbChecked;
        const is180x200CbChecked = document.getElementById('edit_product_180x200').isCbChecked;
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
        console.log(is90x200CbChecked);
        console.log(is120x200CbChecked);
        console.log(is160x200CbChecked);
        console.log(is180x200CbChecked);
        console.log(isJustLandedCbChecked);
        console.log(isOnSaleCbChecked);
        console.log(hashtags);
        console.log(fabric);

    });
});
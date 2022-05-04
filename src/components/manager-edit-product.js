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


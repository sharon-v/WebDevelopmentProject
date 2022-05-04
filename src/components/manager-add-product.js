import { dbProducts, storageRef } from '../firebase/data.js';

/* code fo displaying picture in add/edit new product page */
const image_input = document.querySelector('#image-input');

image_input.addEventListener('change', function() {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const uploaded_image = reader.result;
        document.querySelector('#display-image').style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('in');
    var btn = document.getElementById('add_product');
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('clicked on Add product');
        const Pname = document.getElementById('add_sheets_name').value;
        const description = document.getElementById('add_sheets_description').value;
        const price = document.getElementById('add_sheets_price').value;
        const sale = document.getElementById('add_sheets_sale').value;
        const size90x200 = document.getElementById('quantity_90x200').value;
        const size120x200 = document.getElementById('quantity_120x200').value;
        const size160x200 = document.getElementById('quantity_160x200').value;
        const size180x200 = document.getElementById('quantity_180x200').value;
        const fabric = document.getElementById('add_fabric_select').value;
        const isJustLandedCbChecked = document.getElementById('formCheck-1').isCbChecked;
        const isOnSaleCbChecked = document.getElementById('formCheck-2').isCbChecked;

        const storgeRef = storageRef.child(Pname + '.jpg');
        const ImagesRef = storageRef.child('images/' + Pname + '.jpg');

        console.log(Pname);
        console.log(description);
        console.log(price);
        console.log(sale);
        console.log(size90x200);
        console.log(size120x200);
        console.log(size160x200);
        console.log(size180x200);
        console.log(isJustLandedCbChecked);
        console.log(isOnSaleCbChecked);
        console.log(fabric);
        console.log(ImagesRef);

        addProduct(
            Pname,
            description,
            price,
            sale,
            size90x200,
            size120x200,
            size160x200,
            size180x200,
            isJustLandedCbChecked,
            isOnSaleCbChecked,
            fabric,
            ImagesRef
        );
    });
});

function addProduct(
    Pname,
    description,
    price,
    sale,
    size90x200,
    size120x200,
    size160x200,
    size180x200,
    isJustLandedCbChecked,
    isOnSaleCbChecked,
    fabric,
    ImagesRef
) {
    var sku;
    dbProducts
        .doc(Pname)
        .set({
            sku: dbProducts
                .collection('...')
                .get()
                .then((snap) => {
                    size = snap.size; // will return the collection size
                }),
            Pname: Pname,
            description: description,
            price: price,
            sale: sale,
            size90x200: size90x200,
            size120x200: size120x200,
            size160x200: size160x200,
            size180x200: size180x200,
            isJustLandedCbChecked: isJustLandedCbChecked,
            isOnSaleCbChecked,
            isOnSaleCbChecked,
            fabric: fabric,
            ImagesRef: ImagesRef,
        })
        .then(() => {
            console.log('Document successfully');
            location.replace('manager-manage-items.html');
        })
        .catch((error) => {
            console.error('Error writing document: ', error);
            console.log('fail');
            var errorMessage = error.message;
            alert(errorMessage);
        });
}
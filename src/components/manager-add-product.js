import { dbProducts, storageRef } from '../firebase/data.js';

/* code fo displaying picture in add/edit new product page */
const image_input = document.querySelector('#image-input');

image_input.addEventListener('change', function () {
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
        const isJustLandedCbChecked = document.getElementById('formCheck-1').checked;
        const isOnSaleCbChecked = document.getElementById('formCheck-2').checked;


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
            fabric
        );
    });
});

function uploadImage(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isOnSaleCbChecked, fabric, sku) {
    const ref = firebase.storage().ref();
    const file = document.querySelector("#image-input").files[0];
    const name = 'images/' + Pname + '.jpg' + file.name;
    const metadata = {
        contentType: file.type
    };
    const task = ref.child(name).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log(url);
            const image = document.querySelector("#image-input")
            image.src = url;
            writeProductToDB(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isOnSaleCbChecked, fabric, sku, url);
        })
        .catch(console.error);
}

function addProduct(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isOnSaleCbChecked, fabric) {
    var sku = new Date().getTime();
    dbProducts.get().then((snap) => {
        sku = snap.size + 1 + sku;
        console.log('size ' + sku);
        uploadImage(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isOnSaleCbChecked, fabric, sku);

    });
}

function writeProductToDB(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isOnSaleCbChecked, fabric, sku, url) {
    dbProducts.doc(Pname).set({
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
        sku: sku,
        imageUrl: url
    }).then(() => {
        console.log('Document successfully added');
        location.replace('../components/manager-manage-items.html');
    })
        .catch((error) => {
            console.error('Error writing document: ', error);
            console.log('fail');
            var errorMessage = error.message;
            alert(errorMessage);
        });

}
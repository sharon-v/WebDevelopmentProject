import {
    dbProducts,
    storage
} from '../firebase/data.js';

const loader = document.querySelector('#modal');
loader.style.display = 'block';

var productName = sessionStorage.getItem('Pname');
console.log(productName);

dbProducts.doc(productName).get().then((doc) => {
    if (doc.exists) {
        insertData(doc.id, doc.data().description, doc.data().price, doc.data().sale, doc.data().sku, doc.data().imageUrl, doc.data().size90x200,
            doc.data().size120x200, doc.data().size160x200, doc.data().size180x200, doc.data().fabric, doc.data().isFewLeftCbChecked, doc.data().isJustLandedCbChecked);
    } else {
        alert("Cannot find the wanted product");
        console.log("No such document!");
    }
});



function insertData(name, description, price, sale, sku, imageUrl, size90x200, size120x200, size160x200, size180x200, fabric, isFewLeftCbChecked, isJustLandedCbChecked) {
    document.getElementById('edit_sheets_name').value = name;
    document.getElementById('edit_sheets_description').innerHTML = description;
    document.getElementById('edit_sheets_price').value = price.toFixed(2);
    document.getElementById('edit_sheets_sale').value = sale;
    document.getElementById('edit_sheets_sku').value = sku;
    document.getElementById('quantity_90x200').value = size90x200;
    document.getElementById('quantity_120x200').value = size120x200;
    document.getElementById('quantity_160x200').value = size160x200;
    document.getElementById('quantity_180x200').value = size180x200;
    document.getElementById('fabric_sheets').value = fabric;
    document.getElementById('justLanded').checked = isJustLandedCbChecked;
    document.getElementById('fewLeft').checked = isFewLeftCbChecked;
    document.getElementById('display-image').src = imageUrl;
    document.querySelector('#form').removeAttribute('hidden');
    loader.style.display = 'none';


}
//needed
function uploadImage(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric) {
    const ref = storage.ref();
    const file = document.querySelector("#image-input").files[0];
    console.log(file);
    console.log(file != undefined);
    if (file != undefined) {
        const name = 'images/' + Pname + '.jpg';
        const metadata = {
            contentType: file.type
        };
        const task = ref.child(name).put(file, metadata);
        task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                console.log(url);
                const image = document.querySelector("#image-input");
                image.src = url;
                setProductOnDB(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric, url);
            })
            .catch(console.error);
    } else {
        setProductOnDB(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric, null);
    }
}

// not finish need to set the info not create new in db
function setProductOnDB(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric, url) {

    dbProducts.doc(Pname).update({
            Pname: Pname,
            description: description,
            price: price,
            sale: sale,
            size90x200: size90x200,
            size120x200: size120x200,
            size160x200: size160x200,
            size180x200: size180x200,
            isJustLandedCbChecked: isJustLandedCbChecked,
            isFewLeftCbChecked: isFewLeftCbChecked,
            fabric: fabric,
        }).then(() => {
            if (url != null) {
                dbProducts.doc(Pname).update({
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
            } else {
                console.log('Document successfully added');
                location.replace('../components/manager-manage-items.html');
            }
        })
        .catch((error) => {
            console.error('Error writing document: ', error);
            console.log('fail');
            var errorMessage = error.message;
            alert(errorMessage);
        });


}

// finish
function CheckingRestrictions(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, ImageRef, isJustLandedCbChecked, isFewLeftCbChecked, fabric) {
    dbProducts.doc(Pname).get().then((doc) => {
        if (doc.exists) {
            if (Pname.length == 0) {
                alert("You must enter product name");
                return;
            }
            if (description.length == 0) {
                alert("You must enter product description");
                return;
            }
            if (price.length == 0 || price < 0) {
                alert("You must enter product price larger than zero");
                return;
            }
            if (sale < 0 || sale > price) {
                alert("The discount price must be smaller than the original price, and larger than zero");
                return;
            }
            if (onlyNumbers(size90x200) == false || onlyNumbers(size120x200) == false || onlyNumbers(size160x200) == false || onlyNumbers(size180x200) == false) {
                alert("You must enter integer quantity");
                return;
            }
            if (size90x200 < 0 || size120x200 < 0 || size160x200 < 0 || size180x200 < 0) {
                alert("You must enter quantity larger than zero");
                return;
            }
            uploadImage(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric)

        } else {
            alert("The product isnt in the list");

        }
    });
}

function onlyNumbers(str) {
    return /^[0-9]+$/.test(str);
}
//finish
document.addEventListener('DOMContentLoaded', () => {
    var btn = document.getElementById('saveProd');
    btn.addEventListener('click', (e) => {
        loader.style.display = 'block';


        e.preventDefault();
        var Pname = document.getElementById('edit_sheets_name').value;
        var description = document.getElementById('edit_sheets_description').value;
        var price = parseFloat(document.getElementById('edit_sheets_price').value);
        var sale = document.getElementById('edit_sheets_sale').value;
        if (sale != "")
            sale = parseFloat(sale);
        var size90x200 = document.getElementById('quantity_90x200').value;
        var size120x200 = document.getElementById('quantity_120x200').value;
        var size160x200 = document.getElementById('quantity_160x200').value;
        var size180x200 = document.getElementById('quantity_180x200').value;
        var fabric = document.getElementById('fabric_sheets').value;
        var isJustLandedCbChecked = document.getElementById('justLanded').checked;
        var isFewLeftCbChecked = document.getElementById('fewLeft').checked;
        const ImageRef = document.getElementById('image-input').value;

        CheckingRestrictions(Pname,
            description,
            price,
            sale,
            size90x200,
            size120x200,
            size160x200,
            size180x200,
            ImageRef, isJustLandedCbChecked, isFewLeftCbChecked,
            fabric);

        loader.style.display = 'none';


    });
});




const image_input = document.querySelector('#image-input');

image_input.addEventListener('change', function () {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const uploaded_image = reader.result;
        console.log(uploaded_image);
        document.querySelector('#display-image').src = uploaded_image;
    });
    reader.readAsDataURL(this.files[0]);
});
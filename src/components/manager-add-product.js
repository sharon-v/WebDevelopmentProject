import { dbProducts, storage } from '../firebase/data.js';

const image_input = document.querySelector('#image-input');
const loader = document.querySelector('#modal');

image_input.addEventListener('change', function () {
    loader.style.display = 'block';
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const uploaded_image = reader.result;
        console.log(uploaded_image);
        document.querySelector('#display-image').style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
    loader.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('in');
    var btn = document.getElementById('add_product');
    btn.addEventListener('click', (e) => {
        loader.style.display = 'block';
        e.preventDefault();
        console.log('clicked on Add product');
        const Pname = document.getElementById('add_sheets_name').value;
        const description = document.getElementById('add_sheets_description').value;
        const price = parseFloat(document.getElementById('add_sheets_price').value);
        var sale = document.getElementById('add_sheets_sale').value;
        if (sale != "")
            sale = parseFloat(sale);
        else {
            sale = 0;
        }
        const size90x200 = document.getElementById('quantity_90x200').value;
        const size120x200 = document.getElementById('quantity_120x200').value;
        const size160x200 = document.getElementById('quantity_160x200').value;
        const size180x200 = document.getElementById('quantity_180x200').value;
        const fabric = document.getElementById('add_fabric_select').value;
        const isJustLandedCbChecked = document.getElementById('formCheck-1').checked;
        const isFewLeftCbChecked = document.getElementById('formCheck-2').checked;
        const ImageRef = document.getElementById('image-input').value;


        console.log(Pname);
        console.log(description);
        console.log(price);
        console.log(sale);
        console.log(size90x200);
        console.log(size120x200);
        console.log(size160x200);
        console.log(size180x200);
        console.log(isJustLandedCbChecked);
        console.log(isFewLeftCbChecked);
        console.log(fabric);

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
    });
    loader.style.display = 'none';

});

function CheckingRestrictions(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, ImageRef, isJustLandedCbChecked, isFewLeftCbChecked, fabric) {
    if(Pname == '')
    {
        alert("please enter product name");
        loader.style.display = 'none';
        return;
    }
    dbProducts.doc(Pname).get().then((doc) => {
        if (doc.exists) {
            alert("This name is alredy exist");
            loader.style.display = 'none';
            return;
        }
        else {
            if (Pname.length == 0) {
                alert("You must enter product name");
                loader.style.display = 'none';
                return;
            }
            if (description.length == 0) {
                alert("You must enter product description");
                loader.style.display = 'none';
                return;
            }
            if (price.length == 0 || price < 0) {
                alert("You must enter product price larger than zero");
                loader.style.display = 'none';
                return;
            }
            if (sale < 0 || sale > price) {
                alert("The discount price must be smaller than the original price, and larger than zero");
                loader.style.display = 'none';
                return;
            }
            if (onlyNumbers(size90x200) == false || onlyNumbers(size120x200) == false || onlyNumbers(size160x200) == false || onlyNumbers(size180x200) == false) {
                alert("You must enter integer quantity");
                loader.style.display = 'none';
                return;
            }
            if (size90x200 < 0 || size120x200 < 0 || size160x200 < 0 || size180x200 < 0) {
                alert("You must enter quantity larger than zero");
                loader.style.display = 'none';
                return;
            }
            if (ImageRef.length == 0) {
                alert("You must enter product Image");
                loader.style.display = 'none';
                return;
            }
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
                isFewLeftCbChecked,
                fabric
            );
        }

    });

}
function onlyNumbers(str) {
    return /^[0-9]+$/.test(str);
}



function uploadImage(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric, sku) {
    const ref = storage.ref();
    const file = document.querySelector("#image-input").files[0];
    const name = 'images/' + Pname + '.jpg';
    // spinner.style.display='inline';
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
            // spinner.style.display = 'none';
            writeProductToDB(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric, sku, url);
        })
        .catch(console.error);
}

function addProduct(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric) {
    var sku = new Date().getTime();
    dbProducts.get().then((snap) => {
        sku = snap.size + 1 + sku;
        console.log('size ' + sku);
        uploadImage(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric, sku);
    });
}

function writeProductToDB(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric, sku, url) {
    // spinner.style.display='inline';

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
        isFewLeftCbChecked: isFewLeftCbChecked,
        fabric: fabric,
        sku: sku,
        imageUrl: url,
        amountSold: 0
    }).then(() => {
        // spinner.style.display = 'none';
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
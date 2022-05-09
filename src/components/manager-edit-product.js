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
// אני חושבת שעדיף אותם גלובלי
const Pname = document.getElementById('edit_sheets_name').value;
const description = document.getElementById('edit_sheets_description').value;
const price = document.getElementById('edit_sheets_price').value;
const sale = document.getElementById('edit_sheets_sale').value;
const size90x200 = document.getElementById('quantity_90x200').value;
const size120x200 = document.getElementById('quantity_120x200').value;
const size160x200 = document.getElementById('quantity_160x200').value;
const size180x200 = document.getElementById('quantity_180x200').value;
const fabric = document.getElementById('fabric_sheets').value;
const isJustLandedCbChecked = document.getElementById('formCheck-1').isCbChecked;
const isFewLeftCbChecked = document.getElementById('formCheck-2').isCbChecked;
const ImageRef = document.getElementById('image-input').value;
//needed
function uploadImage(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric) {
    const ref = firebase.storage().ref();
    const file = document.querySelector("#image-input").files[0];
    const name = 'images/' + Pname + '.jpg';
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
            setProductOnDB(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric, url);
        })
        .catch(console.error);
}

// not finish need to set the info not create new in db
function setProductOnDB(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric, url) {
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

// finish
function CheckingRestrictions(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, ImageRef) {
    dbProducts.doc(Pname).get().then((doc) => {
        console.log('hey');
        if (doc.exists) {
            alert("This name is alredy exist");
            return false;
        }
        else {
            if (Pname.length == 0) {
                alert("You must enter product name");
                return false;
            }
            if (description.length == 0) {
                alert("You must enter product description");
                return false;
            }
            if (price.length == 0 || price < 0) {
                alert("You must enter product price larger than zero");
                return false;
            }
            if (sale < 0 || sale > price) {
                alert("The discount price must be smaller than the original price, and larger than zero");
                return false;
            }
            if (size90x200 < 0 || size120x200 < 0 || size160x200 < 0 || size180x200 < 0) {
                alert("You must enter quantity larger than zero");
                return false;
            }
            if (ImageRef.length == 0) {
                alert("You must enter product Image");
                return false;
            }

        }
    });
    return true;
}

//finish
document.addEventListener('DOMContentLoaded', () => {
    var btn = document.getElementById('addProd');
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (CheckingRestrictions(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, ImageRef) == true)
            uploadImage(Pname, description, price, sale, size90x200, size120x200, size160x200, size180x200, isJustLandedCbChecked, isFewLeftCbChecked, fabric)
    });
});

document.querySelector('#spinner').style.visibility = 'visible';
// dont knoe of need
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
// not finish
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



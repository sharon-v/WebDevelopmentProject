import { dbProducts, storage } from '../firebase/data.js'

document.querySelector('#spinner').style.visibility = 'visible';

initialization();
function initialization() {
    dbProducts.get().then((querySnapshot) => {
        var counter = 0;
        querySnapshot.forEach((doc) => {
            counter = counter + 1;
            if (counter == 1) {
                editElement(doc.data().imageUrl, doc.data().Pname, doc.data().price, doc.data().sale, doc.data().sku);
                // console.log("edit " + doc.data().price);
                document.querySelector('#product').style.visibility = 'visible';
            }
            else {
                addElement(doc.data().imageUrl, doc.data().Pname, doc.data().price, doc.data().sale, doc.data().sku);
                // console.log("add " + doc.data().price);
                document.querySelector('#product').style.visibility = 'visible';
            }
        });
        if (counter == 0) {
            deleteFirst();
        }
        document.querySelector('#spinner').style.display = 'none';
    });
}


var searchButtton = document.querySelector('#searchButton');
var searchInput = document.querySelector('#searchInput');
searchButtton.addEventListener('click', () => {
    filterByProductId();
})

searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        // code for enter
        filterByProductId();

    }
});

function filterByProductId() {
    document.querySelector('#spinner').style.display = 'inline';
    if (searchInput.value.length > 0) {
        var container = document.querySelector('#products_list');
        removeAllChildNodes(container);
        dbProducts.doc(searchInput.value).get().then((doc) => {
            if (doc.exists) {
                editElement(doc.data().imageUrl, doc.data().Pname, doc.data().price, doc.data().sale, doc.data().sku);
                document.querySelector('#spinner').style.display = 'none';
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    else {
        document.querySelector('#spinner').style.visibility = 'visible';
        initialization();
    }
}


function editElement(url, Pname, price, sale, sku) {
    let ele = document.querySelector('#product')
    ele = changeValues(ele, url, Pname, price, sale, sku)
    ele.style.visibility = "visible";
}

function changeValues(element, urlName, Pname, proPrice, pSale, psku) {
    element.removeAttribute('hidden')
    let Proname = element.querySelector('#Pname');
    Proname.innerHTML = Pname;
    let price = element.querySelector('#price');
    price.innerHTML = proPrice + "₪";
    let sale = element.querySelector('#sale');
    if (pSale == "") {
        sale.innerHTML = "no sale";
    }
    else {
        sale.innerHTML = pSale + "₪";
    }
    let sku = element.querySelector('#sku');
    console.log(psku);
    sku.innerHTML = psku;
    let imageProd = element.querySelector('#imageProd');
    console.log(urlName);
    imageProd.src = urlName;

    const editProduct = element.querySelector('#editButton');
    editProduct.addEventListener('click', () => {
        sessionStorage.setItem('Pname', Pname);
        location.replace('../components/manager-edit-product.html');
    });

    const deleteProduct = element.querySelector('#deleteButton');
    deleteProduct.addEventListener('click', () => {
        document.querySelector('#spinner').style.display = 'inline';
        dbProducts.doc(Pname).delete().then(() => {
            console.log("Document successfully deleted!");
            removeAllChildNodes(document.getElementById("products_list"));
            initialization();
            // TODO: try to delete image from storage
            // storage.doc(Pname + '.jpg').delete().then(() => {
            //     console.log("Image successfully deleted!");
            // }).catch((error) => {
            //     console.error("Error removing document: ", error);
            // });
        }).catch((error) => {
            alert("Cannot delete the wanted product");
            console.error("Error removing document: ", error);
        });
    });

    return element;
}

function addElement(url, Pname, price, sale, sku) {
    console.log("add element " + price);
    let ele = document.querySelector('#product')
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, url, Pname, price, sale, sku)
    let currentDiv = document.getElementById("products_list");
    currentDiv.appendChild(newElement);
    newElement.style.visibility = "visible";
}

function deleteFirst() {
    let elem = document.getElementById("product");
    elem.remove();
    let par = document.createElement("h2");
    par.innerHTML = "No products :("
    par.style = "color: var(--bs-pink) ;text-align:center"
    let currentDiv = document.getElementById("products_list");
    currentDiv.appendChild(par);
}

function removeAllChildNodes(parent) {
    document.getElementById('spinner').style.display = 'inline';
    while (parent.children.length > 1) {
        console.log("delete");
        parent.removeChild(parent.lastChild);
    }
}

function downloadImage(path, img)
{
    // Create a reference to the file we want to download
    var starsRef = storage.ref().child(path);

// Get the download URL
    starsRef.getDownloadURL().then((url) => {
        img.src = url;
    })
    .catch((error) => {
        switch (error.code) {
            case 'storage/object-not-found':
            // File doesn't exist
            break;
            case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
            case 'storage/canceled':
            // User canceled the upload
            break;

            // ...
            case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
    });
}
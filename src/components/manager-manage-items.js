import {
    dbProducts,
    fbAuth
} from '../firebase/data.js'

// document.querySelector('#spinner').style.visibility = 'visible';
const loader = document.querySelector('#modal');
loader.style.display = 'block';


initialization();

function initialization() {
    dbProducts.get().then((querySnapshot) => {
        var counter = 0;
        querySnapshot.forEach((doc) => {
            counter = counter + 1;
            addElement(doc.data().imageUrl, doc.data().Pname, doc.data().price, doc.data().sale, doc.data().sku);
        });
        if (counter == 0) {
            deleteFirst();
        }
        // document.querySelector('#spinner').style.display = 'none';
        loader.style.display = 'none';

    });
}



var searchButtton = document.querySelector('#searchButton');
var searchInput = document.querySelector('#searchInput');
searchButtton.addEventListener('click', () => {
    searchByInput();
});
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchByInput();
    }
});

function searchByInput() {
    // document.querySelector('#spinner').style.display = 'inline';
    loader.style.display = 'block';

    if (searchInput.value.length > 0) {
        const container = document.querySelector('#products_list');
        removeAllChildNodes(container);
        console.log(searchInput.value);
        dbProducts.doc(searchInput.value).get().then((doc) => {
            if (doc.exists) {
                addElement(doc.data().imageUrl, doc.data().Pname, doc.data().price, doc.data().sale, doc.data().sku);
                // document.querySelector('#spinner').style.display = 'none';
                loader.style.display = 'none';

                return;
            } else {
                dbProducts.where('sku', '==', parseInt(searchInput.value)).get().then((querySnapshot) => {
                    if (querySnapshot.docs.length > 0) {
                        var res = querySnapshot.docs[0];
                        addElement(res.data().imageUrl, res.data().Pname, res.data().price, res.data().sale, res.data().sku);
                        // document.querySelector('#spinner').style.display = 'none';
                        loader.style.display = 'none';

                    } else {
                        // document.querySelector('#products_list').lastElementChild.style.display = 'none';
                        // document.querySelector('#spinner').style.display = 'none';
                        loader.style.display = 'none';

                        deleteFirst();
                    }
                }).catch((error) => {
                    console.log('Error getting documents: ', error);
                });
            }
        }).catch((error) => {
            console.log('Error getting document:', error);
        });

    } else {
        removeAllChildNodes(document.querySelector('#products_list'));
        // document.querySelector('#products_list').lastElementChild.style.display = 'inline';
        // document.querySelector('#spinner').style.visibility = 'visible';
        loader.style.display = 'block';

        initialization();
    }
}


function changeValues(element, urlName, Pname, proPrice, pSale, psku) {
    element.removeAttribute('hidden');
    let Proname = element.querySelector('#Pname');
    Proname.innerHTML = Pname;
    let price = element.querySelector('#price');
    price.innerHTML = proPrice.toFixed(2) + "₪";
    let sale = element.querySelector('#sale');
    if (pSale == "") {
        sale.innerHTML = "no sale";
    } else {
        sale.innerHTML = parseFloat(pSale).toFixed(2) + "₪";
    }
    let sku = element.querySelector('#sku');
    console.log(psku);
    sku.innerHTML = psku;
    let imageProd = element.querySelector('#imageProd');
    console.log(urlName);
    imageProd.src = urlName;

    const editProduct = element.querySelector('#editButton');
    editProduct.addEventListener('click', () => {
        console.log("clicked");
        sessionStorage.setItem('Pname', Pname);
        location.replace('../components/manager-edit-product.html');
    });

    const deleteProduct = element.querySelector('#deleteButton');
    deleteProduct.addEventListener('click', () => {
        console.log("clicked2");

        // document.querySelector('#spinner').style.display = 'inline';
        loader.style.display = 'block';

        dbProducts.doc(Pname).delete().then(() => {
            console.log("Document successfully deleted!");
            removeAllChildNodes(document.getElementById("products_list"));
            initialization();
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    });
    return element;
}

function addElement(url, Pname, price, sale, sku) {
    console.log("add element " + price);
    let ele = document.querySelector('#product');
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, url, Pname, price, sale, sku);
    let currentDiv = document.getElementById("products_list");
    currentDiv.appendChild(newElement);
}

function deleteFirst() {
    // let elem = document.getElementById("product");
    // elem.remove();
    let par = document.createElement("h2");
    par.innerHTML = "No products :("
    par.style = "color: var(--bs-pink) ;text-align:center"
    let currentDiv = document.getElementById("products_list");
    currentDiv.appendChild(par);
}

function removeAllChildNodes(parent) {
    // document.getElementById('spinner').style.display = 'inline';
    loader.style.display = 'block';

    console.log("parent.children.length " + parent.children.length);
    while (parent.children.length > 1) {
        parent.removeChild(parent.lastChild);
    }
}

const nav_profile_btn = document.getElementById('profile_btn');
nav_profile_btn.addEventListener('click', () => {
    fbAuth.onAuthStateChanged((user) => {
        console.log(user.email);
        sessionStorage.setItem('email', user.email);
        location.replace('profile.html');
    });
});
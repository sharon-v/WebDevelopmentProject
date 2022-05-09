import { dbProducts } from '../firebase/data.js'

document.querySelector('#spinner').style.visibility = 'visible';

initialization();
function initialization() {
    dbProducts.get().then((querySnapshot) => {
        var counter = 0;
        querySnapshot.forEach((doc) => {
            counter = counter + 1;
            if (counter == 1) {
                editElement(doc.data().Pname, doc.data().price, doc.data().sku);
                console.log("edit " + doc.data().price);
                document.querySelector('#product').style.visibility = 'visible';
            }
            else {
                addElement(doc.data().Pname, doc.data().price, doc.data().sku);
                console.log("add " + doc.data().price);
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
                editElement(doc.data().Pname, doc.data().price, doc.data().sku);
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


function editElement(Pname, price, sku) {
    let ele = document.querySelector('#product')
    ele = changeValues(ele, Pname, price, sku)
    ele.style.visibility = "visible";
}

function changeValues(element, Pname, proPrice, psku) {
    element.removeAttribute('hidden')
    let Proname = element.querySelector('#Pname');
    Proname.innerHTML = Pname;
    let price = element.querySelector('#price');
    price.innerHTML = proPrice;
    let sku = element.querySelector('#sku');
    sku.innerHTML = psku;

    const editProduct = document.getElementById('editButton');
    editProduct.addEventListener('click', () => {
        sessionStorage.setItem('Pname', Pname);
        location.replace('../components/manager-edit-product.html');
    })
    return element;
}

function addElement(Pname, price, sku) {
    console.log("add element " + price);
    let ele = document.querySelector('#product')
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, Pname, price, sku)
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
    if (parent.children.length > 1) {
        for (var i = 0; i < parent.children.length; i++) {
            parent.children[i].remove();
        }
    }


}
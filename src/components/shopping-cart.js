import { fbAuth, dbShoppingCart, dbProducts } from '../firebase/data.js'

var userShoppingCart = [];
initialization();
var firstProductAdded = false;
let totalItems = 0;
let totalAmount = 0;
const subTotal = document.getElementById('subTotal');
const items = document.getElementById('totalItems');


function initialization() {
    fbAuth.onAuthStateChanged((user) => {
        dbShoppingCart.doc(user.email).get().then((querySnapshot) => {
            if (querySnapshot.exists) {
                userShoppingCart = querySnapshot.data().productList;
                for (let i = 0; i < userShoppingCart.length; ++i) {
                    console.log(userShoppingCart[i].productId);
                    dbProducts.doc(userShoppingCart[i].name).get().then((product) => {
                        if (product.exists) {

                            console.log('product name', product.id);
                            console.log('product sku', product.data().sku);
                            console.log('product price', product.data().price);
                            console.log('product quantity', userShoppingCart[i].quantity);
                            console.log('product size', userShoppingCart[i].size);
                            console.log('product url', product.data().imageUrl);

                            if (i == 0) {
                                editElement(product.id, product.data().sku, product.data().price, userShoppingCart[i].quantity, product.data().imageUrl, userShoppingCart[i].size);
                            }
                            else {
                                addElement(product.id, product.data().sku, product.price, userShoppingCart[i].quantity, product.data().imageUrl, userShoppingCart[i].size);
                            }
                            editOrderSummary(product.data().totalItems, doc.data().totalAmount);
                        }
                        else {
                            console.log
                            editOrderSummary(doc.data().totalItems, doc.data().totalAmount);
                            spinner.style.display = 'none';
                        }
                    })
                }
            }
        })
    })
}

function editElement(name, SKU, price, quantity, url, size) {
    let ele = document.querySelector('#product');
    ele = changeValues(ele, name, SKU, price, quantity, url, size);
}

function changeValues(element, Name, SKU, price, quantity, url, size) {
    element.removeAttribute('hidden');
    let productName = element.querySelector('#productName');
    productName.innerHTML = Name;
    let sku = element.querySelector('#productSKU');
    sku.innerHTML = SKU;
    let productPrice = element.querySelector('#productPrice');
    productPrice.innerHTML = price + '₪';
    let productQuantity = element.querySelector('#productQuantity');
    productQuantity.innerHTML = quantity;
    let productSize = element.querySelector('#productSize');
    productSize.innerHTML = size;
    // let totalproductPrice = element.querySelector('#totalproductPrice');
    // totalproductPrice.innerHTML = (price * quantity) + '₪';
    //TODO: add image ref
    return element;
}

function addElement(Name, SKU, price, quantity, url, size) {
    let ele = document.querySelector('#product');
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, Name, SKU, price, quantity, url);
    let currentDiv = document.getElementById("productsList");
    currentDiv.appendChild(newElement);
}

function editOrderDetails(firstName, lastName, street, streetNumber, apartmentNumber, city, postalCode, phoneNumber, shippingDate, shippingHours, notes) {
    var element = document.querySelector('#orderDetails');
    element.removeAttribute('hidden');
    element.querySelector('#fullName').innerHTML = firstName + " " + lastName;
    if (apartmentNumber == "") {
        element.querySelector('#address').innerHTML = street + " " + streetNumber + ", " + city;
    }
    else {
        element.querySelector('#address').innerHTML = street + " " + streetNumber + "/" + apartmentNumber + ", " + city;
    }
    element.querySelector('#postalCode').innerHTML = postalCode;
    element.querySelector('#phoneNumber').innerHTML = phoneNumber;
    element.querySelector('#shippingDate').innerHTML = shippingDate;
    element.querySelector('#shippingHours').innerHTML = shippingHours;
    if (notes == "")
        element.querySelector('#notes').innerHTML = 'The costumer didn`t enter any notes';
    else
        element.querySelector('#notes').innerHTML = notes;
}

function editOrderSummary(quantity, price) {
    var element = document.querySelector('#orderSummary');
    element.removeAttribute('hidden');
    element.querySelector('#totalOrder').innerHTML = price;
    element.querySelector('#totalproducts').innerHTML = quantity;
    element.querySelector('#totalPrice').innerHTML = price;

}


// create that the amount of product the user want to add is available in the stock
function checkStock() {

}
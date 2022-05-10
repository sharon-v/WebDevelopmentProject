import { fbAuth, dbShoppingCart, dbProducts } from '../firebase/data.js'

var userShoppingCart = [];
initialization();
const subTotal = document.querySelector('#subTotal');
const totalPrice = document.querySelector('#totalPrice');

// var firstProductAdded = false;


function initialization() {
    fbAuth.onAuthStateChanged((user) => {
        dbShoppingCart.doc(user.email).get().then((querySnapshot) => {
            if (querySnapshot.exists) {
                var totalAmount = 0;
                userShoppingCart = querySnapshot.data().productList;
                for (let i = 0; i < userShoppingCart.length; ++i) {
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
                                addElement(product.id, product.data().sku, product.data().price, userShoppingCart[i].quantity, product.data().imageUrl, userShoppingCart[i].size);
                            }
                            totalAmount += product.data().price * userShoppingCart[i].quantity;
                            if (i == userShoppingCart.length - 1) {
                                // let subTotal = document.querySelector('#subTotal');
                                subTotal.innerHTML = totalAmount + '₪';
                                // let totalPrice = document.querySelector('#totalPrice');
                                totalPrice.innerHTML = totalAmount + '₪';
                                console.log('added last product', totalAmount);
                            }
                        }
                        else {
                            alert('The product', userShoppingCart[i].name, 'is not available anymore');
                            console.log('The product', userShoppingCart[i].name, 'is not available anymore');
                        }
                    })
                }
            }
            else {
                // need to present a message on the screen
                alert('Shopping cart is empty');
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
    productQuantity.value = quantity;

    // add a listener for when the customer wants to update the quantity of a product in the shopping cart
    productQuantity.addEventListener('input', () => {
        updateQuantityInShppingCart(productName, productQuantity);
    });

    let productSize = element.querySelector('#productSize');
    productSize.innerHTML = size;
    let productPicture = element.querySelector('#productPicture');
    productPicture.src = url;
    return element;
}

function addElement(Name, SKU, price, quantity, url, size) {
    let ele = document.querySelector('#product');
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, Name, SKU, price, quantity, url, size);
    let currentDiv = document.getElementById("items");
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


/* function */
// function updateQuantityInShppingCart(productName, productQuantity) {
//     if (productQuantity.value == 0) {
//         // need to delete the product from shopping cart and update the stock
//     }
//     else if (productQuantity.value < 0) {
//         alert('can not change the quantity of a product to a negative number');

//     }
//     // alert('Horray! Someone wrote "' + productName.innerHTML + '"!');

// }

// create that the amount of product the user want to add is available in the stock
function checkStock() {

}
import { fbAuth, dbShoppingCart, dbProducts } from '../firebase/data.js'

var userShoppingCart = [];
initialization();
var userConnected = null;
const subTotal = document.querySelector('#subTotal');
const totalPrice = document.querySelector('#totalPrice');
const totalQuantity = document.querySelector('#totalQuantity');
var totalAmount = 0;
var quantity = 0;

document.getElementById('checkout').addEventListener('click', (e) => {
    location.replace('payment.html');
});

function initialization() {
    fbAuth.onAuthStateChanged((user) => {
        userConnected = user;
        dbShoppingCart.doc(user.email).get().then((querySnapshot) => {
            if (querySnapshot.exists) {
                totalAmount = 0;
                quantity = 0;
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
                            let finalPrice = 0;
                            if (product.data().sale == "") {
                                finalPrice = product.data().price;
                            }
                            else {
                                finalPrice = product.data().sale;
                            }

                            if (i == 0) {
                                editElement(product.id, product.data().sku, finalPrice, userShoppingCart[i].quantity, product.data().imageUrl, userShoppingCart[i].size);
                            }
                            else {
                                addElement(product.id, product.data().sku, finalPrice, userShoppingCart[i].quantity, product.data().imageUrl, userShoppingCart[i].size);
                            }
                            quantity += parseInt(userShoppingCart[i].quantity);
                            totalAmount += finalPrice * userShoppingCart[i].quantity;
                            if (i == userShoppingCart.length - 1) {
                                subTotal.innerHTML = totalAmount.toFixed(2) + '₪';
                                totalPrice.innerHTML = totalAmount.toFixed(2) + '₪';
                                totalQuantity.innerHTML = quantity;
                                console.log('added last product', totalAmount.toFixed(2));
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
                deleteFirst();
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
    productPrice.innerHTML = price.toFixed(2) + '₪';
    let productQuantity = element.querySelector('#productQuantity');
    productQuantity.value = quantity;

    // add a listener for when the customer wants to update the quantity of a product in the shopping cart
    productQuantity.addEventListener('input', () => {
        updateQuantityInShoppingCart(productName, productQuantity, element, size);
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


/* function */
function updateQuantityInShoppingCart(productName, productQuantity, element, productSize) {
    if (productQuantity.value >= 0) {
        // need to delete the product from shopping cart and update the stock
        updateProductInTheShoppingCart(productName, productSize, productQuantity, element)
    }
    else if (productQuantity.value < 0 || onlyNumbers(String(productQuantity.value)) == false) {
        changedQuantityToInvalid(productName, productQuantity);
    }
}

function updateProductInTheShoppingCart(productName, productSize, productQuantity, element) {
    console.log('in updateProductInTheShoppingCart');
    userShoppingCart = [];
    let quantityToRemove = 0;
    dbShoppingCart.doc(userConnected.email).get().then((querySnapshot) => {
        if (querySnapshot.exists) {
            totalAmount = 0;
            quantity = 0;
            let shoppingCart = querySnapshot.data().productList;
            for (let i = 0; i < shoppingCart.length; ++i) {
                console.log('shopping cart length:', shoppingCart.length);
                dbProducts.doc(shoppingCart[i].name).get().then((product) => {
                    if (product.exists) {
                        let finalPrice = 0;
                        if (product.data().sale == "") {
                            finalPrice = product.data().price;
                        }
                        else {
                            finalPrice = product.data().sale;
                        }
                        if (product.id != productName.innerHTML) {
                            userShoppingCart.push(shoppingCart[i]);
                            quantity += parseInt(userShoppingCart[i].quantity);
                            totalAmount += finalPrice * userShoppingCart[i].quantity;
                        }
                        else {
                            console.log('found the product in the product collection');
                            quantityToRemove = parseInt(productQuantity.value) - parseInt(shoppingCart[i].quantity);
                            console.log('quantity to remove:', quantityToRemove);
                            if (productQuantity.value > 0) {
                                let temp = shoppingCart[i];
                                temp.quantity = parseInt(productQuantity.value);
                                userShoppingCart.push(temp);
                                quantity += parseInt(userShoppingCart[i].quantity);
                                totalAmount += finalPrice * userShoppingCart[i].quantity;
                            }
                        }
                        if (product.data().sale == "") {
                            finalPrice = product.data().price;
                        }
                        else {
                            finalPrice = product.data().sale;
                        }
                    }
                    else {
                        // maybe delete the product from the list
                        alert('The product', shoppingCart[i].name, 'is not available anymore');
                        console.log('The product', shoppingCart[i].name, 'is not available anymore');
                    }
                    if (i == shoppingCart.length - 1) {
                        console.log('last product in the cart:', shoppingCart[i].name);
                        updateShoppingCart(userConnected.email, userShoppingCart, element, productSize, productName, quantityToRemove, productQuantity);
                    }
                })
            }
        }
        else {
            // need to present a message on the screen
            alert('Shopping cart is empty');
        }
    })
}

function changedQuantityToInvalid(productName, productQuantity) {
    alert('Invalid quantity');
    dbShoppingCart.doc(userConnected.email).get().then((querySnapshot) => {
        if (querySnapshot.exists) {
            let shoppingCart = querySnapshot.data().productList;
            for (let i = 0; i < shoppingCart.length; ++i) {
                dbProducts.doc(shoppingCart[i].name).get().then((product) => {
                    if (product.exists) {
                        if (product.id == productName) {
                            productQuantity.value = shoppingCart[i].quantity;
                        }
                    }
                    else {
                        // maybe delete the product from the list
                        alert('The product', shoppingCart[i].name, 'is not available anymore');
                        console.log('The product', shoppingCart[i].name, 'is not available anymore');
                    }
                })
            }
        }
        else {
            // need to present a message on the screen
            alert('Shopping cart is empty');
            location.replace('shopping-cart.html');   // refresh the page
        }
    })
}


function updateShoppingCart(userEmail, productsList, element, size, productName, quantityToRemove, productQuantity) {
    console.log('in updateShoppingCart');
    console.log('productsList length:', productsList.length);
    if (productsList.length == 0) { // need to delete the document from the collection
        console.log('shopping cart is empty');
        dbShoppingCart.doc(userEmail).delete().then(() => {
            console.log("Shopping cart deleted");
            subTotal.innerHTML = totalAmount.toFixed(2) + '₪';
            totalPrice.innerHTML = totalAmount.toFixed(2) + '₪';
            totalQuantity.innerHTML = quantity;
            updateProductStockInTheDB(size, productName.innerHTML, quantityToRemove, true);
            deleteFirst();
            // let currentDiv = document.getElementById("items");
            // currentDiv.removeChild(element);
        }).catch((error) => {
            console.error("failed to delete the shopping cart: ", error);
        });
    }
    else {
        console.log('shopping cart is not empty');
        console.log('cart: ', productsList);
        updateProductStockInTheDB(userEmail, productsList, element, size, productName, quantityToRemove, productQuantity);
    }
}

function updateProductStockInTheDB(userEmail, productsList, element, size, productName, quantityToRemove, productQuantity) {
    console.log('in updateProductStockInTheDB the product name is:', productName);
    console.log('in updateProductStockInTheDB the product size is:', size);
    console.log('quantity to remove: ', quantityToRemove);
    console.log('cart: ', productsList);

    dbProducts.doc(productName).get().then((product) => {
        if (product.exists) {
            if (size == '120 x 200') {
                if (product.data().size120x200 >= quantityToRemove) {
                    console.log('can remove', quantityToRemove, 'from size 120 x 200');
                    dbProducts.doc(productName).update({
                        size120x200: parseInt(product.data().size120x200) - parseInt(quantityToRemove),
                    })
                        .then(() => {
                            console.log("The product's quantity was updated in the db");
                            writeShoppingCartToTheDB(userEmail, productsList, element, size, productName, quantityToRemove, productQuantity);
                        })
                        .catch((error) => {
                            console.error("Error updating the product's quantity in the db: ", error);
                        });
                }
                else {
                    changedQuantityToInvalid(productName, productQuantity);
                }
            }
            else if (size == '160 x 200') {
                if (product.data().size160x200 >= quantityToRemove) {
                    console.log('can remove', quantityToRemove, 'from size 160 x 200');
                    dbProducts.doc(productName).update({
                        size160x200: parseInt(product.data().size160x200) - parseInt(quantityToRemove),
                    })
                        .then(() => {
                            console.log("The product's quantity was updated in the db");
                            writeShoppingCartToTheDB(userEmail, productsList, element, size, productName, quantityToRemove, productQuantity);
                        })
                        .catch((error) => {
                            console.error("Error updating the product's quantity in the db: ", error);
                        });
                }
                else {
                    changedQuantityToInvalid(productName, productQuantity);
                }
            }
            else if (size == '180 x 200') {
                if (product.data().size180x200 >= quantityToRemove) {
                    console.log('can remove', quantityToRemove, 'from size 180 x 200');
                    dbProducts.doc(productName).update({
                        size180x200: parseInt(product.data().size180x200) - parseInt(quantityToRemove),
                    })
                        .then(() => {
                            console.log("The product's quantity was updated in the db");
                            writeShoppingCartToTheDB(userEmail, productsList, element, size, productName, quantityToRemove, productQuantity);

                        })
                        .catch((error) => {
                            console.error("Error updating the product's quantity in the db: ", error);
                        });
                }
                else {
                    changedQuantityToInvalid(productName, productQuantity);
                }
            }
            else if (size == '90 x 200') {
                if (product.data().size90x200 >= quantityToRemove) {
                    console.log('can remove', quantityToRemove, 'from size 90 x 200');
                    dbProducts.doc(productName).update({
                        size90x200: parseInt(product.data().size90x200) - parseInt(quantityToRemove),
                    })
                        .then(() => {
                            console.log("The product's quantity was updated in the db");
                            writeShoppingCartToTheDB(userEmail, productsList, element, size, productName, quantityToRemove, productQuantity);
                        })
                        .catch((error) => {
                            console.error("Error updating the product's quantity in the db: ", error);
                        });
                }
                else {
                    changedQuantityToInvalid(productName, productQuantity);
                }
            }
        }
        else {
            // maybe deletshoppingCarte the product from the list
            // alert('The product is not available anymore');
            console.log('The product is not available anymore');
        }
    })
}

function writeShoppingCartToTheDB(userEmail, productsList, element, size, productName, quantityToRemove, productQuantity) {
    console.log('in writeShoppindCartToTheDB');
    console.log('cart: ', productsList);
    dbShoppingCart.doc(userEmail).set({
        productList: productsList,
    })
        .then(() => {
            if (productQuantity.value == 0) {
                console.log('deleted the product from the cart');
                let currentDiv = document.getElementById("items");
                currentDiv.removeChild(element);
            }
            subTotal.innerHTML = totalAmount.toFixed(2) + '₪';
            totalPrice.innerHTML = totalAmount.toFixed(2) + '₪';
            totalQuantity.innerHTML = quantity;
        })
        .catch((error) => {
            // success in saving the user to Auth but failed to save him in the collection
            // so we need to delete user from authentication
            alert('failed to delete the product from the shopping cart,', error.message);
        });
}

function onlyNumbers(str) {
    return /^[0-9]+$/.test(str);
}

function deleteFirst() {
    let elem = document.getElementById("product");
    elem.remove();
    let par = document.createElement("h2");
    par.innerHTML = "The shopping cart is empty :("
    par.style = "color: var(--bs-pink) ;text-align:center"
    let currentDiv = document.getElementById("items");
    currentDiv.appendChild(par);
}




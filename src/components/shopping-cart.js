import { fbAuth, dbShoppingCart, dbProducts } from '../firebase/data.js'

var userShoppingCart = [];
initialization();
var userConnected = null;
const subTotal = document.querySelector('#subTotal');
const totalPrice = document.querySelector('#totalPrice');
const totalQuantity = document.querySelector('#totalQuantity');
var totalAmount = 0;
var quantity = 0;
var isFirstInTheCart = true;

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
                if (userShoppingCart.length == 0) {
                    deleteFirst();
                    return;
                }
                for (let i = 0; i < userShoppingCart.length; ++i) {
                    dbProducts.doc(userShoppingCart[i].name).get().then((product) => {
                        if (product.exists) {
                            // the product still exist in the products list
                            console.log("in initialization, found the product in the products list");
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

                            console.log
                            if (isFirstInTheCart == true) {
                                console.log('in first in the cart');
                                editElement(product.id, product.data().sku, finalPrice, userShoppingCart[i].quantity, product.data().imageUrl, userShoppingCart[i].size);
                            }
                            else {
                                addElement(product.id, product.data().sku, finalPrice, userShoppingCart[i].quantity, product.data().imageUrl, userShoppingCart[i].size);
                            }
                            isFirstInTheCart = false;
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
                            console.log('The product', userShoppingCart[i].name, 'is not available anymore');
                            alert('The product ' + userShoppingCart[i].name + ' is not available anymore');
                            deleteProFromShoppingCart(userShoppingCart[i].name);
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
    console.log('editing current element');
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

    element.querySelector('#trashBtn').addEventListener('click', (e) => {
        e.preventDefault();
        productQuantity.value = '0';
        updateQuantityInShoppingCart(productName, productQuantity, element, size);
    });

    let productSize = element.querySelector('#productSize');
    productSize.innerHTML = size;
    let productPicture = element.querySelector('#productPicture');
    productPicture.src = url;
    return element;
}

function addElement(Name, SKU, price, quantity, url, size) {
    console.log('adding new element');
    let ele = document.querySelector('#product');
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, Name, SKU, price, quantity, url, size);
    let currentDiv = document.getElementById("items");
    currentDiv.appendChild(newElement);
}


/* function */
function updateQuantityInShoppingCart(productName, productQuantity, element, productSize) {
    // disabling changing the rest of the fields when a user changed the field of a product
    let quantityField = element.querySelector('#productQuantity');
    quantityField.disabled = true;
    if (productQuantity.value < 0 || onlyNumbers(String(productQuantity.value)) == false) {
        // invalid quantity
        console.log('changes to invalid quantity');
        changedQuantityToInvalid(productName, productQuantity, element, productSize);
    }
    else if (productQuantity.value >= 0) {
        updateProductInTheShoppingCart(productName, productSize, productQuantity, element)
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
                        if ((product.id != productName.innerHTML) || shoppingCart[i].size != productSize) {
                            userShoppingCart.push(shoppingCart[i]);
                            quantity += parseInt(shoppingCart[i].quantity);
                            totalAmount += finalPrice * shoppingCart[i].quantity;
                        }
                        else {
                            console.log('found the product in the product collection');
                            quantityToRemove = parseInt(productQuantity.value) - parseInt(shoppingCart[i].quantity);
                            console.log('quantity to remove:', quantityToRemove);
                            if (productQuantity.value > 0) {
                                let temp = shoppingCart[i];
                                temp.quantity = parseInt(productQuantity.value);
                                userShoppingCart.push(temp);
                                quantity += parseInt(temp.quantity);
                                totalAmount += finalPrice * parseInt(temp.quantity);
                            }
                        }
                    }
                    else {
                        console.log('The product', userShoppingCart[i].name, 'is not available anymore');
                        alert('The product ' + userShoppingCart[i].name + ' is not available anymore');
                        deleteProFromShoppingCart(userShoppingCart[i].name);
                    }
                    if (i == shoppingCart.length - 1) {
                        console.log('last product in the cart:', shoppingCart[i].name);
                        console.log('total: ', totalAmount, quantity);
                        updateShoppingCart(userConnected.email, userShoppingCart, element, productSize, productName, quantityToRemove, productQuantity);
                    }
                })
            }
        }
        else {
            // need to present a message on the screen
            let quantityField = element.querySelector('#productQuantity');
            quantityField.disabled = false;
            deleteFirst();
            console.log('Shopping cart is empty');
        }
    })
}

function changedQuantityToInvalid(productName, productQuantity, element, productSize) {
    alert('Invalid quantity');
    console.log('user connected', userConnected.email);
    dbShoppingCart.doc(userConnected.email).get().then((querySnapshot) => {
        if (querySnapshot.exists) {
            let quantityField = element.querySelector('#productQuantity');
            quantityField.disabled = false;
            let shoppingCart = querySnapshot.data().productList;
            for (let i = 0; i < shoppingCart.length; ++i) {
                dbProducts.doc(shoppingCart[i].name).get().then((product) => {
                    if (product.exists) {
                        if (product.id == productName.innerHTML && shoppingCart[i].size == productSize) {
                            console.log('in invalid quantity, the cuurent quantity in the cart is:', shoppingCart[i].quantity);
                            productQuantity.value = shoppingCart[i].quantity;
                        }
                    }
                    else {
                        console.log('The product', userShoppingCart[i].name, 'is not available anymore');
                        alert('The product ' + userShoppingCart[i].name + ' is not available anymore');
                        deleteProFromShoppingCart(userShoppingCart[i].name);
                    }
                })
            }
        }
        else {
            // need to present a message on the screen
            console.log('could not open the shopping cart');
            let quantityField = element.querySelector('#productQuantity');
            quantityField.disabled = false;
            deleteFirst();
            location.replace('cart.html');   // refresh the page
        }
    })
}


function updateShoppingCart(userEmail, productsList, element, size, productName, quantityToRemove, productQuantity) {
    console.log('in updateShoppingCart');
    console.log('productsList length:', productsList.length);
    console.log('connected email:', userEmail);
    if (productsList.length == 0) { // need to delete the document from the collection
        console.log('shopping cart is empty');
        let quantityField = element.querySelector('#productQuantity');
        quantityField.disabled = false;
        dbShoppingCart.doc(userConnected.email).delete().then(() => {
            console.log("Shopping cart deleted");
            subTotal.innerHTML = totalAmount.toFixed(2) + '₪';
            totalPrice.innerHTML = totalAmount.toFixed(2) + '₪';
            totalQuantity.innerHTML = quantity;
            updateProductStockInTheDB(userEmail, productsList, element, size, productName, quantityToRemove, productQuantity);
            deleteFirst();
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
    console.log('in updateProductStockInTheDB the product name is:', productName.innerHTML);
    console.log('in updateProductStockInTheDB the product size is:', size);
    console.log('quantity to remove: ', quantityToRemove);
    console.log('cart: ', productsList);

    dbProducts.doc(productName.innerHTML).get().then((product) => {
        if (product.exists) {
            let quantityField = element.querySelector('#productQuantity');
            quantityField.disabled = false;
            if (size == '120 x 200') {
                if (product.data().size120x200 >= quantityToRemove) {
                    console.log('can remove', quantityToRemove, 'from size 120 x 200');
                    dbProducts.doc(productName.innerHTML).update({
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
                    changedQuantityToInvalid(productName, productQuantity, element, size);
                }
            }
            else if (size == '160 x 200') {
                if (product.data().size160x200 >= quantityToRemove) {
                    console.log('can remove', quantityToRemove, 'from size 160 x 200');
                    dbProducts.doc(productName.innerHTML).update({
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
                    changedQuantityToInvalid(productName, productQuantity, element, size);
                }
            }
            else if (size == '180 x 200') {
                if (product.data().size180x200 >= quantityToRemove) {
                    console.log('can remove', quantityToRemove, 'from size 180 x 200');
                    dbProducts.doc(productName.innerHTML).update({
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
                    changedQuantityToInvalid(productName, productQuantity, element, size);
                }
            }
            else if (size == '90 x 200') {
                if (product.data().size90x200 >= quantityToRemove) {
                    console.log('can remove', quantityToRemove, 'from size 90 x 200');
                    dbProducts.doc(productName.innerHTML).update({
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
                    changedQuantityToInvalid(productName, productQuantity, element, size);
                }
            }
        }
        else {
            // The product does not exist in the collection anymore
            // maybe delete the product from the list
            let quantityField = element.querySelector('#productQuantity');
            quantityField.disabled = false;
            alert('The product', shoppingCart[i].name, 'is not available anymore');
            console.log('The product', shoppingCart[i].name, 'is not available anymore');
        }
    })
}

function writeShoppingCartToTheDB(userEmail, productsList, element, size, productName, quantityToRemove, productQuantity) {
    console.log('in writeShoppindCartToTheDB');
    console.log('cart: ', productsList);
    if (productsList.length == 0) {
        return;
    }
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

function deleteProFromShoppingCart(productName) {
    fbAuth.onAuthStateChanged((user) => {
        userConnected = user;
        let cart = []
        dbShoppingCart.doc(user.email).get().then((querySnapshot) => {
            let shoppingCart = querySnapshot.data().productList;
            for (let i = 0; i < shoppingCart.length; ++i) {
                if (shoppingCart[i].name != productName) {
                    cart.push(userShoppingCart[i]);
                }
            }
            dbShoppingCart.doc(user.email).set({
                productList: cart,
            })
                .then(() => {
                    console.log('succeded in deleting the unvalid product in the cart');
                    if (cart.length == 0) {
                        location.replace('cart.html');
                    }
                })
                .catch((error) => {
                    alert('failed to delete the product from the shopping cart,', error.message);
                });

        });
    });
}

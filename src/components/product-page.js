import { fbAuth, dbWishList ,dbShoppingCart, dbProducts } from '../firebase/data.js';
import {CustomerNavbar} from '../components/navbar.js'

const productName = sessionStorage.getItem('Pname');
var connectedUser;
dbProducts.doc(productName).get().then((doc) => {
    if (doc.exists) 
    {
        initialization(doc.id, doc.data().imageUrl, doc.data().description, doc.data().price, doc.data().sale, doc.data().sku, doc.data().isFewLeftCbChecked,
        doc.data().isJustLandedCbChecked, doc.data().size90x200, doc.data().size120x200, doc.data().size160x200, doc.data().size180x200);
        document.querySelector('#product').removeAttribute('hidden');
        document.querySelector('#spinner').style.display = 'none';
    } else 
    {
        alert("The product isn`t in the database");
        console.log("No such document!");
    }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

function initialization(name, url, description, price, sale, sku, FewLeftCbChecked, JustLandedCbChecked, size90x200, size120x200, size160x200, size180x200) {
    document.querySelector('#sheetsName').innerHTML = name;
    document.querySelector('#proDescription').innerHTML = description;
    let productPrice = document.querySelector('#prodPrice');
    productPrice.innerHTML = price.toFixed(2) + "₪";
    let productsale = document.querySelector('#prodSale');
    if (sale == "") {
        productsale.innerHTML = "";
    }
    else {
        productPrice.style="text-decoration: line-through";
        productsale.innerHTML = sale.toFixed(2) + "₪";
    }
    document.querySelector('#prodSku').innerHTML = sku;
    document.getElementById('productImage').src = url;
    const wishListBtn = document.querySelector('#wishListBtn');
    wishListBtn.style.backgroundImage = 'url("../assets/icons/heart-icon.svg")';
    fbAuth.onAuthStateChanged((user) => {
        connectedUser = user;
        dbWishList.doc(user.email).get().then((querySnapshot) => {
            if(querySnapshot.exists)
            {
                const userwWishList = querySnapshot.data().productArr;
                for(let i = 0 ; i< userwWishList.length ; ++i)
                {
                    if(userwWishList[i] == productName){
                        wishListBtn.style.backgroundImage = 'url("../assets/icons/black-heart.svg")';
                    }
                }
            }
            else
            {
                wishListBtn.style.backgroundImage = 'url("../assets/icons/heart-icon.svg")';
            }
        })
    })
    if(FewLeftCbChecked == false)
        document.querySelector('#fewLeft').style.display = 'none';
    if(JustLandedCbChecked == false)
        document.querySelector('#justLanded').style.display = 'none';
    if(parseInt(size90x200) == 0  && parseInt(size120x200) == 0 && parseInt(size160x200) == 0 && parseInt(size180x200) == 0){
        document.querySelector('#outOfStock').style.display = 'inline';
        document.querySelector('#fewLeft').style.display = 'none';
        document.querySelector('#addToCartBtn').disabled = true;
        document.querySelector('#bedSizeOptions').disabled = true;
        document.querySelector('#quantity').disabled = true;
    }
}

var heartBtn =document.querySelector('#wishListBtn'); 
heartBtn.addEventListener('click', () => {
    dbWishList.doc(connectedUser.email).get().then((querySnapshot) => {
        if(querySnapshot.exists)
        {
            if (heartBtn.style.backgroundImage == 'url("../assets/icons/heart-icon.svg")') {
                // if heart is empty
                heartBtn.style.backgroundImage = 'url("../assets/icons/black-heart.svg")';
                dbWishList.doc(connectedUser.email).update({
                    productArr: firebase.firestore.FieldValue.arrayUnion(productName)
                })
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            }
            else
            {
                 // if heart is full
                heartBtn.style.backgroundImage = "url('../assets/icons/heart-icon.svg')";
                dbWishList.doc(connectedUser.email).update({
                    productArr: firebase.firestore.FieldValue.arrayRemove(productName)
                })
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            }                
        }
        else
        {
           //if the user dont have wish list
           dbWishList.doc(connectedUser.email).set({
                productArr: firebase.firestore.FieldValue.arrayUnion(productName)
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }
    })
    

    
});

var addToCart =document.querySelector('#addToCartBtn'); 
addToCart.addEventListener('click', () => {
    const sizeOptions =document.querySelector('#bedSizeOptions'); 
    const quantity =document.querySelector('#quantity'); 
    if(sizeOptions.value == 0)
    {
        alert("Plaese choose bed size");
    }
    else
    {
    dbProducts.doc(productName).get().then((doc) => {
        if (doc.exists) 
        {
            var sizeQuantity;
            if(sizeOptions.options[sizeOptions.selectedIndex].value == 1)
            {
                sizeQuantity = parseInt(doc.data().size90x200);
            }
            else if(sizeOptions.options[sizeOptions.selectedIndex].value == 2)
            {
                sizeQuantity = parseInt(doc.data().size120x200);
            }
            else if(sizeOptions.options[sizeOptions.selectedIndex].value == 3)
            {
                sizeQuantity = parseInt(doc.data().size160x200);
            }
            else if(sizeOptions.options[sizeOptions.selectedIndex].value == 4)
            {
                sizeQuantity = parseInt(doc.data().size180x200);
            }
            console.log(sizeQuantity);
            console.log(quantity.value);

            //check if the wanted quantity is valid
            if(quantity.value < 1)
            {
                alert("Invalid quantity");
            }
            else if(quantity.value > sizeQuantity)
            {
                alert("The quantity you want is not avialible, please try again.\nThe availiable quantity for that size is " + sizeQuantity);
            }
            else
            {
                dbShoppingCart.doc(connectedUser.email).get().then((querySnapshot) => {
                    if(querySnapshot.exists) //if the user have document in the shopping cart
                    {
                        var flag = false;
                        var ListOfPro = querySnapshot.data().productList;
                        for(var i=0; i < ListOfPro.length; ++i) 
                        {
                            console.log(ListOfPro.length);
                            if((ListOfPro)[i]["name"] == productName && (ListOfPro)[i]["size"] == sizeOptions.options[sizeOptions.selectedIndex].text)
                            {   //if the product is allready in the db
                                flag = true;
                                ListOfPro[i]["quantity"] = (parseInt(ListOfPro[i]["quantity"]) + parseInt(quantity.value)).toString();
                                dbShoppingCart.doc(connectedUser.email).update({
                                    productList: ListOfPro
                                }).then(() => {
                                    console.log("The product's quantity was updated in the db");
                                    updateSizeQuantity(sizeOptions.options[sizeOptions.selectedIndex].value, sizeQuantity, quantity);
                                    console.log("Document successfully written!");
                                })
                                .catch((error) => {
                                    console.error("Error updating the product's quantity in the db: ", error);
                                });
                                break;
                            }
                        }
                        if(flag == false)
                        {
                            addNewProductToShoppingCart(sizeOptions, connectedUser, sizeQuantity, doc.data().imageUrl, doc.data().sku);
                        }
                    }
                    else
                    {
                        //if the user dont have document in the shopping cart
                        dbShoppingCart.doc(connectedUser.email).set({
                            productList: firebase.firestore.FieldValue.arrayUnion({
                                name:productName,
                                quantity:(quantity.value).toString(),
                                size:sizeOptions.options[sizeOptions.selectedIndex].text
                            })
                        })
                        .then(() => {
                            CustomerNavbar(connectedUser.email);
                            // location.replace('product-page.html');
                            updateSizeQuantity(sizeOptions.options[sizeOptions.selectedIndex].value, sizeQuantity, quantity);
                            console.log("Document successfully written!");
                        })
                        .catch((error) => {
                            console.error("Error writing document: ", error);
                        });
                    }
                })
            }
        } 
        else 
        {
            console.log("The product is not exist");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
})


function updateSizeQuantity(size, sizeQuantity, quantity)
{
    if(size == 1)
    {
        dbProducts.doc(productName).update({
            size90x200: (sizeQuantity - quantity.value).toString()
        })
        .then(() => {
            
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });    
    }
    else if(size == 2)
    {
        dbProducts.doc(productName).update({
            size120x200: (sizeQuantity - quantity.value).toString()
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });    
    }
    else if(size == 3)
    {
        dbProducts.doc(productName).update({
            size160x200: (sizeQuantity - quantity.value).toString()
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });    
    }
    else if(size == 4)
    {
        dbProducts.doc(productName).update({
            size180x200: (sizeQuantity - quantity.value).toString()
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });    
    }
    
}

function addNewProductToShoppingCart(sizeOptions, user, sizeQuantity, proUrl, sku)
{
    console.log(productName);
    console.log(quantity.value);
    console.log(sizeOptions.options[sizeOptions.selectedIndex].text);
    dbShoppingCart.doc(user.email).update({
        productList: firebase.firestore.FieldValue.arrayUnion({
            name:productName,
            quantity:(quantity.value).toString(),
            size:sizeOptions.options[sizeOptions.selectedIndex].text,
            url: proUrl,
            SKU: sku
        })
    })
    .then(() => {   
        CustomerNavbar(connectedUser.email);
        updateSizeQuantity(sizeOptions.options[sizeOptions.selectedIndex].value, sizeQuantity, quantity);
        //update the quantity of the shopping cart in the nav bar
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}
import { fbAuth, dbWishList ,dbShoppingCart, dbProducts } from '../firebase/data.js';

// const productName = sessionStorage.getItem('Pname');
const productName ='pro9';
dbProducts.doc(productName).get().then((doc) => {
    if (doc.exists) 
    {
        initialization(doc.id, doc.data().imageUrl, doc.data().description, doc.data().price, doc.data().sale, doc.data().sku);
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

function initialization(name, url, description, price, sale, sku) {
    document.querySelector('#sheetsName').innerHTML = name;
    document.querySelector('#proDescription').innerHTML = description;
    let productPrice = document.querySelector('#prodPrice');
    productPrice.innerHTML = price + "₪";
    let productsale = document.querySelector('#prodSale');
    if (sale == "") {
        productsale.innerHTML = "";
    }
    else {
        productPrice.style="text-decoration: line-through";
        productsale.innerHTML = sale + "₪";
    }
    document.querySelector('#prodSku').innerHTML = sku;
    document.getElementById('productImage').src = url;
    const wishListBtn = document.querySelector('#wishListBtn');
    wishListBtn.style.backgroundImage = 'url("../assets/icons/heart-icon.svg")';
    fbAuth.onAuthStateChanged((user) => {
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
}

var heartBtn =document.querySelector('#wishListBtn'); 
heartBtn.addEventListener('click', () => {
    fbAuth.onAuthStateChanged((user) => {
        dbWishList.doc(user.email).get().then((querySnapshot) => {
            if(querySnapshot.exists)
            {
                if (heartBtn.style.backgroundImage == 'url("../assets/icons/heart-icon.svg")') {
                    // if heart is empty
                    heartBtn.style.backgroundImage = 'url("../assets/icons/black-heart.svg")';
                    dbWishList.doc(user.email).update({
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
                    dbWishList.doc(user.email).update({
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
               dbWishList.doc(user.email).set({
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
    })
    

    
});

var addToCart =document.querySelector('#addToCartBtn'); 
addToCart.addEventListener('click', () => {
    var sizeOptions =document.querySelector('#bedSizeOptions'); 
    if(sizeOptions.value == 0)
    {
        alert("Plaese choose bed size");
    }
    else
    {
        fbAuth.onAuthStateChanged((user) => {
            dbShoppingCart.doc(user.email).get().then((querySnapshot) => {
                if(querySnapshot.exists)
                {
                    dbShoppingCart.doc(user.email).update({
                        productList: firebase.firestore.FieldValue.arrayUnion(productName)
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
                  
                }
            })
        })
        
    }

    

})
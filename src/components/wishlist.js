import { dbProducts, dbWishList, fbAuth } from '../firebase/data.js';

const spinner = document.querySelector('#spinner');
spinner.style.visibility='visible';

initialization();

// function initialization() {
//   dbProducts.get().then((querySnapshot) => {
//     var counter = 0;
//     querySnapshot.forEach((doc) => {
//       if (!isProductInWishlist(doc.data().Pname)) {
//         console.log('pname= ', doc.data().Pname);
//         console.log('item not in wishlist');
//         return null;
//       }

//       counter = counter + 1;
//       if (counter == 1) {
//         editElement(
//           doc.data().Pname,
//           doc.data().sku,
//           doc.data().price,
//           doc.data().sale,
//           doc.data().imageUrl,
//           doc.data().size90x200,
//           doc.data().size120x200,
//           doc.data().size160x200,
//           doc.data().size180x200,
//           doc.data().isFewLeftCbChecked,
//           doc.data().isJustLandedCbChecked
//         );

//         document.querySelector('#product').style.visibility = 'visible';
//       } else {
//         addElement(
//           doc.data().Pname,
//           doc.data().sku,
//           doc.data().price,
//           doc.data().sale,
//           doc.data().imageUrl,
//           doc.data().size90x200,
//           doc.data().size120x200,
//           doc.data().size160x200,
//           doc.data().size180x200,
//           doc.data().isFewLeftCbChecked,
//           doc.data().isJustLandedCbChecked
//         );

//         document.querySelector('#product').style.visibility = 'visible';
//       }
//     });
//     if (counter == 0) {
//       //delete the first element if there are no products
//       deleteFirst();
//     }
//     // document.querySelector('#spinner').style.display = 'none';
//   });
// }

// function editElement(pName, sku, price, sale, url, s90, s120, s160, s180, fl, jl) {
//   let ele = document.querySelector('#product');
//   if(numOfInit == 1)
//   {
//     ele = changeValues(ele, pName, sku, price, sale, url, s90, s120, s160, s180, fl, jl, ONE);
//   }
//   else
//   {
//     ele = changeValues(ele, pName, sku, price, sale, url, s90, s120, s160, s180, fl, jl, ZERO);
//   }
// }

function changeValues(element, pName, sku, price, sale, url, s90, s120, s160, s180, fl, jl, num) {
  
  // change heart btn to empty and remove element from wishlist collection
  var heart = 'url("../assets/icons/heart-icon.svg")';
  var blackHeart = 'url("../assets/icons/black-heart.svg")';

  // check if item is in wishlist
  let heartBtn = element.querySelector('#heart_btn');
  heartBtn.style.backgroundImage = blackHeart;

  // if (!isProductInWishlist(pName)) {
  //   console.log('pname= ', pName);
  //   console.log('item not in wishlist');
  //   return null;
  // }

  element.removeAttribute('hidden');

  // sheets name
  let productName = element.querySelector('#product_name');
  productName.addEventListener('click', () => {
    sessionStorage.setItem('Pname', pName);
    location.replace('../components/product-page.html');
  });
  productName.style.fontSize = '20px';
  productName.innerHTML = pName;

  // sku
  let productSKU = element.querySelector('#product_sku');
  sessionStorage.setItem('productSKU', sku);
  productSKU.style.fontSize = '11px';
  productSKU.innerHTML = 'SKU ' + sku;

  // price and sale
  let productPrice = element.querySelector('#product_price');
  let productSale = element.querySelector('#product_sale');

  if (sale == 0) {
    // make price not striked through and make sale invisible
    productPrice.style.textDecoration = 'none';
    productSale.style.visibility = 'hidden';
  } else {
    productPrice.style = 'text-decoration: line-through';
    productSale.style.visibility = 'visible';
  }
  productPrice.innerHTML = price.toFixed(2) + ' ₪';
  productSale.innerHTML = sale.toFixed(2) + ' ₪';

  productSale.style.fontWeight = 'bold';

  // get image
  let productImage = element.querySelector('#product_image');
  productImage.src = url;

  // listen to heartBtn
  heartBtn.addEventListener('click', () => {
    console.log("clickded");
    fbAuth.onAuthStateChanged((user) => {
      heartBtn.style.backgroundImage = heart;
        dbWishList
          .doc(user.email)
          .update({
            productArr: firebase.firestore.FieldValue.arrayRemove(pName),
          })
          .then(() => {
            console.log('from full to not - Document successfully written!');
            spinner.style.display = 'inline';
            document.getElementById('wishlist').display='none';
            removeAllChildNodes(document.getElementById("wishlist"));
            //reloaded the page
            initialization();
          })
          .catch((error) => {
            console.error('Error writing document: ', error);
          });
    });
  });


  let justLanded = element.querySelector('#just_landed');
  if (jl) {
    justLanded.style.display = 'hidden';
  }

  let outOfStock = element.querySelector('#out_of_stock');
  let fewLeft = element.querySelector('#few_left');

  if (parseInt(s90) == 0 && parseInt(s120) == 0 && parseInt(s160) == 0 && parseInt(s180) == 0) {
    outOfStock.style.display = 'hidden';
    fewLeft.style.display = 'none';
  }

  if (fl) {
    fewLeft.style.display = 'hidden';
    outOfStock.style.display = 'none';
  }

  // isProductInWishlist(pName, heartBtn);

  return element;
}

function addElement(pName, sku, price, sale, url, s90, s120, s160, s180, fl, jl) {
  let ele = document.querySelector('#product');
  let newElement = ele.cloneNode(true);
  newElement = changeValues(
    newElement,
    pName,
    sku,
    price,
    sale,
    url,
    s90,
    s120,
    s160,
    s180,
    fl,
    jl
  );
  let currentDiv = document.getElementById('wishlist');
  currentDiv.appendChild(newElement);
}

function deleteFirst() {
  let elem = document.getElementById('product');
  elem.style.display = 'none';
  let par = document.createElement('h2');
  par.innerHTML = 'No products found :(';
  par.style = 'color: var(--bs-pink) ;text-align:center';
  let currentDiv = document.getElementById('wishlist');
  currentDiv.appendChild(par);
  return par;
}

function removeAllChildNodes(parent) {
  document.getElementById('spinner').style.display='inline';
  while (parent.children.length > 1) {
    console.log('delete');
    parent.removeChild(parent.lastChild);
  }
}

//////////////////////////////////////////////////////
function initialization() {
  fbAuth.onAuthStateChanged((user) => {
    dbWishList
      .doc(user.email)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.exists) {
          let myWishlist = querySnapshot.data().productArr;
          if (myWishlist.length == 0) {
            deleteFirst();
            spinner.style.display = 'none';
            return;
          }
          console.log('mywishlist = ', myWishlist);
          myWishlist.forEach((name) => {
            dbProducts
              .doc(name)
              .get()
              .then((product) => {
                if (product.exists) {
                  // the product still exist in the products list
                  console.log('in initialization, found the product in the products list');
                  console.log('product name', product.id);

                  addElement(
                        product.data().Pname,
                        product.data().sku,
                        product.data().price,
                        product.data().sale,
                        product.data().imageUrl,
                        product.data().size90x200,
                        product.data().size120x200,
                        product.data().size160x200,
                        product.data().size180x200,
                        product.data().isFewLeftCbChecked,
                        product.data().isJustLandedCbChecked
                      );

                  // if (counter == 1) {
                  //   console.log('in first in the cart');
                  //   editElement(
                  //     product.data().Pname,
                  //     product.data().sku,
                  //     product.data().price,
                  //     product.data().sale,
                  //     product.data().imageUrl,
                  //     product.data().size90x200,
                  //     product.data().size120x200,
                  //     product.data().size160x200,
                  //     product.data().size180x200,
                  //     product.data().isFewLeftCbChecked,
                  //     product.data().isJustLandedCbChecked
                  //   );
                  //   document.querySelector('#product').style.visibility = 'visible';
                  // } else {
                  //   addElement(
                  //     product.data().Pname,
                  //     product.data().sku,
                  //     product.data().price,
                  //     product.data().sale,
                  //     product.data().imageUrl,
                  //     product.data().size90x200,
                  //     product.data().size120x200,
                  //     product.data().size160x200,
                  //     product.data().size180x200,
                  //     product.data().isFewLeftCbChecked,
                  //     product.data().isJustLandedCbChecked
                  //   );
                  //   document.querySelector('#product').style.visibility = 'visible';
                  // }
                  document.getElementById('wishlist').display='inline';
                  spinner.style.display = 'none';

                } else {
                  console.log('The product', name, 'is not available anymore');
                  alert('The product ' + name + ' is not available anymore');
                  deleteProFromwidbWishList(name);
                }
              });
          });
          spinner.style.display = 'none';
        }
        else{
          spinner.style.display = 'none';
          deleteFirst();
        }
      });
  });
}
//////////////////////////////////////////////////////

// function isProductInWishlist(pName) {
//   // get user email
//   fbAuth.onAuthStateChanged((user) => {
//     // checks if the product is in this wishlist
//     dbWishList
//       .doc(user.email)
//       .get()
//       .then((querySnapshot) => {
//         if (querySnapshot.exists) {
//           let myWishlist = querySnapshot.data().productArr;
//           console.log('mywishlist = ', myWishlist);
//           myWishlist.forEach((name) => {
//             console.log('comaper names + ', pName);
//             if (name == pName) {
//               // it is in wishlist so we make the heart full on first display
//               console.log('pname= ', pName, 'compare name= ', name);
//               // heartBtn.style.backgroundImage = 'url("../assets/icons/black-heart.svg")';
//               // return to finish looking since there can only be one match
//               return true;
//             }
//           });
//           return false;
//         } else {
//           console.log('no snapshot');
//         }
//       });
//   });
// }

import {
  dbProducts,
  dbWishList,
  fbAuth
} from '../firebase/data.js';

document.querySelector('#spinner').style.visibility = 'visible';

initialization();

function initialization() {
  dbProducts.get().then((querySnapshot) => {
    var counter = 0;
    querySnapshot.forEach((doc) => {
      counter = counter + 1;
      if (counter == 1) {
        editElement(
          doc.data().Pname,
          doc.data().sku,
          doc.data().price,
          doc.data().sale,
          doc.data().imageUrl
        );
        document.querySelector('#product').style.visibility = 'visible';
      } else {
        addElement(
          doc.data().Pname,
          doc.data().sku,
          doc.data().price,
          doc.data().sale,
          doc.data().imageUrl
        );
        document.querySelector('#product').style.visibility = 'visible';
      }
    });
    if (counter == 0) {
      //delete the first element if there are no products
      deleteFirst();
    }
    document.querySelector('#spinner').style.display = 'none';
  });
}

// seearching
var searchButtton = document.querySelector('#catalog_search_btn');
var searchInput = document.querySelector('#catalog_search_input');
// listen to search button if pressed
searchButtton.addEventListener('click', () => {
  console.log('pressed enter in search icon');

  searchByInput(); // implement for name and SKU
});
// listen to search bar if enter is pressed
searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    // code for enter
    console.log('pressed enter in search bar');

    searchByInput();
  }
});

// filtering
var filterCombo = document.querySelector('#filter_combo');
filterCombo.addEventListener('change', (e) => {
  // make sort combo empty 
  sortCombo.value = 0;

  console.log("sort val = ", sortCombo.value)
  removeAllChildNodes(document.getElementById('catalog_list'));
  let res = filterCombo.options[filterCombo.selectedIndex].value;
  var field;
  var value;
  var cond;
  console.log("res = ", res)
  if (res == 0) {
    initialization();
    return;
  } else if (res == 1) {
    // california king
    field = 'size180x200';
    value = '0';
    cond = "!=";
  } else if (res == 2) {
    // king
    field = 'size160x200';
    value = '0';
    cond = "!=";
  } else if (res == 3) {
    // queen
    field = 'size120x200';
    value = '0';
    cond = "!=";
  } else if (res == 4) {
    // twin
    field = 'size90x200';
    value = '0';
    cond = "!=";
  } else if (res == 5) {
    // cotton
    field = 'fabric';
    value = '1';
    cond = "==";
  } else if (res == 6) {
    // microfiber
    field = 'fabric';
    value = '2';
    cond = "==";
  } else if (res == 7) {
    // flannel
    field = 'fabric';
    value = '3';
    cond = "==";
  } else if (res == 8) {
    // satin
    field = 'fabric';
    value = '4';
    cond = "==";
  } else if (res == 9) {
    // jersey
    field = 'fabric';
    value = '5';
    cond = "==";
  } else if (res == 10) {
    // just landed
    field = 'isJustLandedCbChecked';
    value = true;
    cond = "==";
  } else {
    //few left
    field = 'isFewLeftCbChecked';
    value = true;
    cond = "==";
  }
  let elem = document.getElementById('product');
  elem.style.display = 'inline';

  dbProducts.where(field, cond, value).get().then((querySnapshot) => {
      var counter = 0;
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());

        counter = counter + 1;
        if (counter == 1) {

          editElement(
            doc.data().Pname,
            doc.data().sku,
            doc.data().price,
            doc.data().sale,
            doc.data().imageUrl
          );
          document.querySelector('#spinner').style.display = 'none';
        } else {
          addElement(
            doc.data().Pname,
            doc.data().sku,
            doc.data().price,
            doc.data().sale,
            doc.data().imageUrl
          );
          document.querySelector('#spinner').style.display = 'none';

        }
      })
      if (counter == 0) {
        deleteFirst();
      }


    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

});

//sorting
var sortCombo = document.querySelector('#sort_combo');
sortCombo.addEventListener('change', (e) => {
  // make filter combo empty
  filterCombo.value = 0;

  let res = sortCombo.options[sortCombo.selectedIndex].value;
  let order;
  console.log("res = ", res)
  if (res == 0) {
    initialization();
    return;
  } else if (res == 1) {
    order = 'asc';
  } else {
    order = 'desc';

  }


  dbProducts.orderBy('price', order).get().then((querySnapshot) => {
    removeAllChildNodes(document.getElementById('catalog_list'));
    var counter = 0;
    querySnapshot.forEach((doc) => {

      console.log(doc.id, " => ", doc.data());

      counter = counter + 1;
      if (counter == 1) {

        editElement(
          doc.data().Pname,
          doc.data().sku,
          doc.data().price,
          doc.data().sale,
          doc.data().imageUrl
        );
        document.querySelector('#spinner').style.display = 'none';
      } else {
        addElement(
          doc.data().Pname,
          doc.data().sku,
          doc.data().price,
          doc.data().sale,
          doc.data().imageUrl
        );
        document.querySelector('#spinner').style.display = 'none';
      }
    })
    if (counter == 0) {
      deleteFirst();
    }
  }).catch((error) => {
    console.log('Error getting documents: ', error);
  });
});


function searchByInput() {
  document.querySelector('#spinner').style.display = 'inline';
  // reset combos
  sortCombo.value = 0;
  filterCombo.value = 0;

  if (searchInput.value.length > 0) {
    console.log('entered filter with -> ', searchInput.value);

    const container = document.querySelector('#catalog_list');
    removeAllChildNodes(container);
    dbProducts
      .doc(searchInput.value)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // name search
          console.log('entered name search');
          editElement(
            doc.data().Pname,
            doc.data().sku,
            doc.data().price,
            doc.data().sale,
            doc.data().imageUrl
          );
          return;

        } else {
          // SKU search
          console.log(searchInput.value);

          dbProducts
            .where('sku', '==', parseInt(searchInput.value))
            .get()
            .then((querySnapshot) => {
              console.log('entered sku search 1');
              // console.log(querySnapshot.docs[0].data());
              if (querySnapshot.docs.length > 0) {
                let res = querySnapshot.docs[0];
                console.log('entered sku search 2');
                editElement(
                  res.data().Pname,
                  res.data().sku,
                  res.data().price,
                  res.data().sale,
                  res.data().imageUrl
                );
                document.querySelector('#spinner').style.display = 'none';
              } else {
                console.log('no products');
                document.querySelector('#catalog_list').lastElementChild.style.display = 'none';
                // document.querySelector('#noOrderMessage').style.display = 'none';
                document.querySelector('#spinner').style.visibility = 'visible';
              }
            })
            .catch((error) => {
              console.log('Error getting documents: ', error);
            });


        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });

  } else {
    // container.lastElementChild.style.display = 'none';

    document.querySelector('#catalog_list').lastElementChild.style.display = 'inline';
    // document.querySelector('#noOrderMessage').style.display = 'none';
    console.log('no products');
    document.querySelector('#spinner').style.visibility = 'visible';
    initialization();
  }
}

function editElement(pName, sku, price, sale, url) {
  let ele = document.querySelector('#product');
  ele = changeValues(ele, pName, sku, price, sale, url);
  // ele.style.visibility = 'visible';
}

function changeValues(element, pName, sku, price, sale, url) {
  element.removeAttribute('hidden');

  // sheets name
  let productName = element.querySelector('#product_name');
  productName.addEventListener('click', () => {
    sessionStorage.setItem('Pname', pName);
    location.replace('../components/product-page.html')
  })
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
  }
  productPrice.innerHTML = price.toFixed(2) + ' ₪';
  productSale.innerHTML = sale.toFixed(2) + ' ₪';
  productSale.style.fontWeight = 'bold';

  // get image
  let productImage = element.querySelector('#product_image');
  productImage.src = url;

  // change heart btn to full and add element to wishlist collection
  var heart = 'url("../assets/icons/heart-icon.svg")';
  var blackHeart = 'url("../assets/icons/black-heart.svg")';

  let heartBtn = element.querySelector('#heart_btn');
  heartBtn.style.backgroundImage = heart;

  //   // listen to heart button if pressed
  //   heartBtn.addEventListener('click', () => {
  //     if (heartBtn.style.backgroundImage == heart) {
  //       // if heart is empty
  //       heartBtn.style.backgroundImage = blackHeart;
  //       // add to wishlist - need to implement  ///////////////////////////////////

  //     } else {
  //       // if heart is full
  //       heartBtn.style.backgroundImage = "url('../assets/icons/heart-icon.svg')";
  //       // remove from wishlist - need to implement ///////////////////////////////
  //     }
  //   });

  //   // check if item is in wishlist and if it is change heart btn to full
  //   isProductInWishlist(pName, heartBtn);
  //   return element;
  // }

  heartBtn.addEventListener('click', () => {
      fbAuth.onAuthStateChanged((user) => {
        dbWishList.doc(user.email).get().then((querySnapshot) => {
          if (querySnapshot.exists) {
            if (heartBtn.style.backgroundImage == heart) {
              // if heart is empty
              heartBtn.style.backgroundImage = blackHeart;
              dbWishList.doc(user.email).update({
                  productArr: firebase.firestore.FieldValue.arrayUnion(productName)
                })
                .then(() => {
                  console.log("Document successfully written!");
                })
                .catch((error) => {
                  console.error("Error writing document: ", error);
                });
            } else {
              // if heart is full
              heartBtn.style.backgroundImage = heart;
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
          } else {
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
    }


  )
  return element;
}

function addElement(pName, sku, price, sale, url) {
  let ele = document.querySelector('#product');
  let newElement = ele.cloneNode(true);
  newElement = changeValues(newElement, pName, sku, price, sale, url);
  let currentDiv = document.getElementById('catalog_list');
  currentDiv.appendChild(newElement);
  newElement.style.visibility = 'visible';
}

function deleteFirst() {
  let elem = document.getElementById('product');
  elem.style.display = 'none';
  let par = document.createElement('h2');
  par.innerHTML = 'No products found :(';
  par.style = 'color: var(--bs-pink) ;text-align:center';
  let currentDiv = document.getElementById('catalog_list');
  currentDiv.appendChild(par);
}

function removeAllChildNodes(parent) {
  while (parent.children.length > 1) {
    console.log('delete');
    parent.removeChild(parent.lastChild);
  }
}

function isProductInWishlist(pName, heartBtn) {
  // get user email
  fbAuth.onAuthStateChanged((user) => {
    // checks if the product is in this wishlist
    dbWishList
      .doc(user.email)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.exists) {
          let myWishlist = querySnapshot.data().productArr;
          myWishlist.forEach((name) => {
            if (name == pName) {
              // it is in wishlist so we make the heart full on first display
              heartBtn.style.backgroundImage = 'url("../assets/icons/black-heart.svg")';
              return false;
            }
          });
        } else {
          console.log('no snapshot');
        }
      });
  });
}
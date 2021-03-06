import {
  dbProducts,
  dbWishList,
  fbAuth
} from '../firebase/data.js';

// document.querySelector('#spinner').style.visibility = 'visible';
const loader = document.querySelector('#modal');
loader.style.display = 'block';

initialization(sessionStorage.getItem('filter'));

function initialization(filterNum) {
  console.log('filter = ', filterNum);
  if (filterNum != '0') {
    filter('fabric', '==', filterNum);
  } else {
    document.getElementById("filter_combo").selectedIndex = 0;
    removeAllChildNodes(document.getElementById('catalog_list'));
    dbProducts.get().then((querySnapshot) => {
      var counter = 0;
      querySnapshot.forEach((doc) => {
        counter = counter + 1;
        addElement(
          doc.data().Pname,
          doc.data().sku,
          doc.data().price,
          doc.data().sale,
          doc.data().imageUrl,
          doc.data().size90x200,
          doc.data().size120x200,
          doc.data().size160x200,
          doc.data().size180x200,
          doc.data().isFewLeftCbChecked,
          doc.data().isJustLandedCbChecked
        );
      });
      if (counter == 0) {
        //delete the first element if there are no products
        deleteFirst();
      }
      // document.querySelector('#spinner').style.display = 'none';
      loader.style.display = 'none';

    });
  }
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

var allProd = document.querySelector('#all_prod');
allProd.addEventListener('click', (e) => {
  initialization('0');
});
var cottonProd = document.querySelector('#cotton_prod');
cottonProd.addEventListener('click', (e) => {
  filter('fabric', '==', '1');
});
var microProd = document.querySelector('#micro_prod');
microProd.addEventListener('click', (e) => {
  filter('fabric', '==', '2');
});
var flannelProd = document.querySelector('#flannel_prod');
flannelProd.addEventListener('click', (e) => {
  filter('fabric', '==', '3');
});
var satinProd = document.querySelector('#satin_prod');
satinProd.addEventListener('click', (e) => {
  filter('fabric', '==', '4');
});
var jerseyProd = document.querySelector('#jersey_prod');
jerseyProd.addEventListener('click', (e) => {
  filter('fabric', '==', '5');
});

function filter(field, cond, value) {
  if(field =='fabric')
  {
    document.getElementById("filter_combo").selectedIndex = parseInt(value) +4;
  }
  document.querySelector('#sort_combo').value = 0;


  dbProducts
    .where(field, cond, value)
    .get()
    .then((querySnapshot) => {
      removeAllChildNodes(document.getElementById('catalog_list'));
      var counter = 0;
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());

        counter = counter + 1;
        addElement(
          doc.data().Pname,
          doc.data().sku,
          doc.data().price,
          doc.data().sale,
          doc.data().imageUrl,
          doc.data().size90x200,
          doc.data().size120x200,
          doc.data().size160x200,
          doc.data().size180x200,
          doc.data().isFewLeftCbChecked,
          doc.data().isJustLandedCbChecked
        );
      });
      loader.style.display = 'none';
      if (counter == 0) {
        deleteFirst();
      }
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });
}
var filterCombo = document.querySelector('#filter_combo');
filterCombo.addEventListener('change', (e) => {
  // make sort combo empty
  sortCombo.value = 0;
  console.log('sort val = ', sortCombo.value);
  let res = filterCombo.options[filterCombo.selectedIndex].value;
  var field;
  var value;
  var cond;
  console.log('res = ', res);
  if (res == 0) {
    initialization('0');
    return;
  } else if (res == 1) {
    // california king
    field = 'size180x200';
    value = '0';
    cond = '!=';
  } else if (res == 2) {
    // king
    field = 'size160x200';
    value = '0';
    cond = '!=';
  } else if (res == 3) {
    // queen
    field = 'size120x200';
    value = '0';
    cond = '!=';
  } else if (res == 4) {
    // twin
    field = 'size90x200';
    value = '0';
    cond = '!=';
  } else if (res == 5) {
    // cotton
    field = 'fabric';
    value = '1';
    cond = '==';
  } else if (res == 6) {
    // microfiber
    field = 'fabric';
    value = '2';
    cond = '==';
  } else if (res == 7) {
    // flannel
    field = 'fabric';
    value = '3';
    cond = '==';
  } else if (res == 8) {
    // satin
    field = 'fabric';
    value = '4';
    cond = '==';
  } else if (res == 9) {
    // jersey
    field = 'fabric';
    value = '5';
    cond = '==';
  } else if (res == 10) {
    // just landed
    field = 'isJustLandedCbChecked';
    value = true;
    cond = '==';
  } else if (res == 11) {
    //few left
    field = 'isFewLeftCbChecked';
    value = true;
    cond = '==';
  } else {
    //in stock only
    dbProducts
      .get()
      .then((querySnapshot) => {
        var counter = 0;
        removeAllChildNodes(document.getElementById('catalog_list'));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, ' => ', doc.data());

          if (
            parseInt(doc.data().size90x200) != '0' ||
            parseInt(doc.data().size120x200) != '0' ||
            parseInt(doc.data().size160x200) != '0' ||
            parseInt(doc.data().size180x200) != '0'
          ) {
            counter = counter + 1;
            addElement(
              doc.data().Pname,
              doc.data().sku,
              doc.data().price,
              doc.data().sale,
              doc.data().imageUrl,
              doc.data().size90x200,
              doc.data().size120x200,
              doc.data().size160x200,
              doc.data().size180x200,
              doc.data().isFewLeftCbChecked,
              doc.data().isJustLandedCbChecked
            );
          }
        });
        if (counter == 0) {
          deleteFirst();
        }
        return;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
    return;
  }

  filter(field, cond, value);
});

//sorting
var sortCombo = document.querySelector('#sort_combo');
sortCombo.addEventListener('change', (e) => {
  // make filter combo empty
  filterCombo.value = 0;

  let res = sortCombo.options[sortCombo.selectedIndex].value;
  let func;
  console.log('res = ', res);
  if (res == 0) {
    initialization('0');
    return;
  } else if (res == 1) {
    func = asc;
  } else {
    func = desc;
  }


  removeAllChildNodes(document.getElementById('catalog_list'));

  var listPro = [];
  var dicPro = {};
  dbProducts.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (doc.data().sale != 0) {

        dicPro["price"] = doc.data().sale;
        dicPro["id"] = doc;
        listPro.push(dicPro);


      } else {
        dicPro["price"] = doc.data().price;
        dicPro["id"] = doc;
        listPro.push(dicPro);

      }
      dicPro = {};

    })

    var sorted = listPro.sort(func);
    var counter = 0;
    for (let i = 0; i < sorted.length; ++i) {
      var doc = sorted[i]["id"];
      console.log(doc.id, ' => ', doc.data());
      counter = counter + 1;

      addElement(
        doc.data().Pname,
        doc.data().sku,
        doc.data().price,
        doc.data().sale,
        doc.data().imageUrl,
        doc.data().size90x200,
        doc.data().size120x200,
        doc.data().size160x200,
        doc.data().size180x200,
        doc.data().isFewLeftCbChecked,
        doc.data().isJustLandedCbChecked
      );
      // document.querySelector('#spinner').style.display = 'none';
      loader.style.display = 'none';

    }
    if (counter == 0) {
      deleteFirst();
    }
  })

});

function asc(a, b) {
  return parseInt(a.price, 10) - parseInt(b.price, 10);
}

function desc(a, b) {
  return parseInt(b.price, 10) - parseInt(a.price, 10);
}

function searchByInput() {
  // document.querySelector('#spinner').style.display = 'inline';
  loader.style.display = 'block';

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
          addElement(
            doc.data().Pname,
            doc.data().sku,
            doc.data().price,
            doc.data().sale,
            doc.data().imageUrl,
            doc.data().size90x200,
            doc.data().size120x200,
            doc.data().size160x200,
            doc.data().size180x200,
            doc.data().isFewLeftCbChecked,
            doc.data().isJustLandedCbChecked
          );
          loader.style.display = 'none';
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
                  addElement(
                  res.data().Pname,
                  res.data().sku,
                  res.data().price,
                  res.data().sale,
                  res.data().imageUrl,
                  res.data().size90x200,
                  res.data().size120x200,
                  res.data().size160x200,
                  res.data().size180x200,
                  res.data().isFewLeftCbChecked,
                  res.data().isJustLandedCbChecked
                );
                // document.querySelector('#spinner').style.display = 'none';
                loader.style.display = 'none';
              } else {
                console.log('no products');
                deleteFirst();
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
    initialization('0');
  }
}

function changeValues(element, pName, sku, price, sale, url, s90, s120, s160, s180, fl, jl) {
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
  productPrice.innerHTML = price.toFixed(2) + ' ???';
  productSale.innerHTML = sale.toFixed(2) + ' ???';

  productSale.style.fontWeight = 'bold';

  // get image
  let productImage = element.querySelector('#product_image');
  productImage.src = url;

  // change heart btn to full and add element to wishlist collection
  var heart = 'url("../assets/icons/heart-icon.svg")';
  var blackHeart = 'url("../assets/icons/black-heart.svg")';

  let heartBtn = element.querySelector('#heart_btn');
  heartBtn.style.backgroundImage = heart;

  heartBtn.addEventListener('click', () => {
    fbAuth.onAuthStateChanged((user) => {
      dbWishList
        .doc(user.email)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.exists) {
            if (heartBtn.style.backgroundImage == heart) {
              // if heart is empty
              heartBtn.style.backgroundImage = blackHeart;
              dbWishList
                .doc(user.email)
                .update({
                  productArr: firebase.firestore.FieldValue.arrayUnion(pName),
                })
                .then(() => {
                  console.log('Document successfully written!');
                })
                .catch((error) => {
                  console.error('Error writing document: ', error);
                });
            } else {
              // if heart is full
              heartBtn.style.backgroundImage = heart;
              dbWishList
                .doc(user.email)
                .update({
                  productArr: firebase.firestore.FieldValue.arrayRemove(pName),
                })
                .then(() => {
                  console.log('Document successfully written!');
                })
                .catch((error) => {
                  console.error('Error writing document: ', error);
                });
            }
          } else {
            //if the user dont have wish list
            dbWishList
              .doc(user.email)
              .set({
                productArr: firebase.firestore.FieldValue.arrayUnion(pName),
              })
              .then(() => {
                console.log('Document successfully written!');
              })
              .catch((error) => {
                console.error('Error writing document: ', error);
              });
          }
        });
    });
  });

  let justLanded = element.querySelector('#just_landed');
  if (jl) {
    justLanded.style.visibility = 'visible';
  }

  let outOfStock = element.querySelector('#out_of_stock');
  let fewLeft = element.querySelector('#few_left');

  if (parseInt(s90) == 0 && parseInt(s120) == 0 && parseInt(s160) == 0 && parseInt(s180) == 0) {
    outOfStock.style.visibility = 'visible';
    fewLeft.style.visibility = 'hidden';
  }

  if (fl) {
    fewLeft.style.visibility = 'visible';
    outOfStock.style.visibility = 'hidden';
  }

  isProductInWishlist(pName, heartBtn);

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

  let currentDiv = document.getElementById('catalog_list');
  currentDiv.appendChild(newElement);
  console.log("len " + currentDiv.children.length);
  // currentDiv.style.visibility = 'visible';
}

function deleteFirst() {
  loader.style.display = 'block';
  let par = document.createElement('h2');
  par.innerHTML = 'No products found :(';
  par.style = 'color: var(--bs-pink) ;text-align:center';
  let currentDiv = document.getElementById('catalog_list');
  currentDiv.appendChild(par);
  loader.style.display = 'none';
  return par;
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
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


var filterBtn = document.querySelector('#filter_btn');
filterBtn.addEventListener('click', (e) => {
  // let res = sortCombo.options[sortCombo.selectedIndex].value;
  // console.log("res = ", res)
  // if (res == 1) {
  //   sortLowToHigh();
  // } else {
  //   sortHighToLow();
  // }

  filterByFabric();
});

function filterByFabric() {
  var ans;
  if (document.querySelector('#cotton_cb').isChecked()) {

  }


  let query = dbProducts.where()
    .where("categoryServer", "==", categoryServerOption);
  // if (categoryPriceOption == "high") {
  //   query = query.orderBy('price', 'desc');
  // } else {
  //   query = query.orderBy('price');
  // }
  query
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, " => ", doc.data());
      });
    })
}

//sorting
var sortCombo = document.querySelector('#sort_combo');
sortCombo.addEventListener('change', (e) => {
  let res = sortCombo.options[sortCombo.selectedIndex].value;
  console.log("res = ", res)
  if (res == 1) {
    sortLowToHigh();
  } else {
    sortHighToLow();
  }
});


function sortLowToHigh() {
  // maybe need to limit to len of products
  // sort by original price
  // const sort = dbProducts.orderBy('price').limit(3);

  // dbProducts.orderBy('price').limit(3).onSnapshot((querySnapshot) => {
  //   querySnapshot.forEach((prod) => {
  //       if (prod.exists) {

  //         editElement(
  //           prod.data().Pname,
  //           prod.data().sku,
  //           prod.data().price,
  //           prod.data().sale,
  //           prod.data().imageUrl
  //         );
  //         document.querySelector('#spinner').style.display = 'none';
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('Error getting documents: ', error);
  //     });
  // })

  // let query = dbProducts.orderBy('price', 'desc');


  // if (categoryPriceOption == "high") {
  //   query = query.orderBy('price', 'desc');
  // } else {
  //   query = query.orderBy('price');
  // }
  dbProducts.orderBy('price', 'desc').get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        console.log(doc.id, " => ", doc.data());


        editElement(
          doc.data().Pname,
          doc.data().sku,
          doc.data().price,
          doc.data().sale,
          doc.data().imageUrl
        );
        document.querySelector('#spinner').style.display = 'none';

      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });

  });
};


function sortHighToLow() {

}

function searchByInput() {
  document.querySelector('#spinner').style.display = 'inline';
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
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });

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
  ele.style.visibility = 'visible';
}

function changeValues(element, pName, sku, price, sale, url) {
  element.removeAttribute('hidden');

  // sheets name
  let productName = element.querySelector('#product_name');
  sessionStorage.setItem('productName', pName);
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

  // listen to heart button if pressed
  heartBtn.addEventListener('click', () => {
    if (heartBtn.style.backgroundImage == heart) {
      // if heart is empty
      heartBtn.style.backgroundImage = blackHeart;
      // add to wishlist - need to implement !!!!!!!!!!!!!
    } else {
      // if heart is full
      heartBtn.style.backgroundImage = "url('../assets/icons/heart-icon.svg')";
      // remove from wishlist - need to implement !!!!!!!!!!!!!!!!
    }
  });

  // check if item is in wishlist and if it is change heart btn to full
  isProductInWishlist(pName, heartBtn);
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
  elem.remove();
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
import {
  dbProducts,
  dbWishList,
  fbAuth
} from '../firebase/data.js';

// const spinner = document.querySelector('#spinner');
// spinner.style.visibility = 'visible';

const loader = document.querySelector('#modal');
loader.style.display = 'block';


initialization();


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
          // spinner.style.display = 'inline';
          loader.style.display = 'block';

          document.getElementById('wishlist').display = 'none';
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
  console.log("in");
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
  // document.getElementById('spinner').style.display = 'inline';
  loader.style.display = 'block';

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
            // spinner.style.display = 'none';
            loader.style.display = 'none';

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

                  document.getElementById('wishlist').display = 'inline';
                  // spinner.style.display = 'none';
                  loader.style.display = 'none';


                } else {
                  console.log('The product', name, 'is not available anymore');
                  alert('The product ' + name + ' is not available anymore');
                  deleteProFromwidbWishList(name);
                  console.log("myWishlist.length" + myWishlist.length);
                  if (myWishlist.length == 1) {
                    deleteFirst();
                    return;
                  }
                }
              });
          });
          // spinner.style.display = 'none';
          loader.style.display = 'none';

        } else {
          // spinner.style.display = 'none';
          loader.style.display = 'none';

          deleteFirst();
        }
      });
  });
}
//////////////////////////////////////////////////////

function deleteProFromwidbWishList(productName) {
  fbAuth.onAuthStateChanged((user) => {

    //   dbWishList.doc(user.email).get().then((querySnapshot) => {
    // let mywishlist = querySnapshot.data().productArr;
    dbWishList
      .doc(user.email)
      .update({
        productArr: firebase.firestore.FieldValue.arrayRemove(productName),
      })
    console.log('succeded in deleting the unvalid product in the wishlist');
  });
  // });
}
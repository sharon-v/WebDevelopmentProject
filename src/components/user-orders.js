import {
    fbAuth,
    dbOrders,
    dbCustomers,
    dbProducts
} from '../firebase/data.js'

// const spinner = document.querySelector('#spinner');
// spinner.style.visibility='visible';

const loader = document.querySelector('#modal');
loader.style.display = 'block';

initialization();

function initialization() {
    fbAuth.onAuthStateChanged((user) => {
        dbOrders.where("buyerEmail", "==", user.email)
            .get()
            .then((querySnapshot) => {
                var counter = 0;
                querySnapshot.forEach((doc) => {
                    counter = counter + 1;
                    editElement(doc.id, doc.data().purchaseDate, doc.data().buyerEmail, doc.data().totalAmount, doc.data().orderStatus, doc.data().productsList);
                });
                if (counter == 0) {
                    //delete the first element if there is no orders
                    deleteFirst();
                    // spinner.style.display = 'none';
                    loader.style.display = 'none';

                }
            })
            .catch((error) => {
                deleteFirst();
                // spinner.style.display = 'none';
                loader.style.display = 'none';

                console.log("Error getting documents: ", error);
            });
        // spinner.style.display = 'none';
        loader.style.display = 'none';

    });

}


function editElement(orderNumber, date, buyerEmail, totalAmount, orderStatus, proList) {
    let ele = document.querySelector('#product');
    let newElement = ele.cloneNode(true);
    let currentDiv = document.getElementById("products_list");
    newElement = changeValues(newElement, orderNumber, date, buyerEmail, totalAmount, orderStatus, proList);
    currentDiv.appendChild(newElement);
}

function changeValues(element, orderNumber, date, buyerEmail, totalAmount, orderStatus, proList) {
    element.removeAttribute('hidden')
    let Number = element.querySelector('#orderNumber');
    Number.innerHTML = orderNumber;
    let orderDate = element.querySelector('#orderDate');
    orderDate.innerHTML = new Intl.DateTimeFormat('en-GB').format(date);
    let buyerName = element.querySelector('#buyerName');

    //get user name by email
    dbCustomers.where("email", "==", buyerEmail).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                buyerName.innerHTML = String(doc.data().fname) + ' ' + String(doc.data().lname);
            });
        })
        .catch((error) => {
            buyerName.innerHTML = '******';
            console.log("Error getting documents: ", error);
        });

    let amount = element.querySelector('#totalAmount');
    amount.innerHTML = totalAmount.toFixed(2) + ' ₪';

    let status = element.querySelector('#orderStatus');
    status.innerHTML = orderStatus;

    let differ = Date.now() - date;
    let Difference_In_hours = Math.ceil(differ / (1000 * 3600 * 24));
    var cancleBtn = element.querySelector('#cancelOrderBtn');
    if (Difference_In_hours > 1) {
        cancleBtn.style.visibility = 'hidden';
    } else {
        cancleBtn.style.visibility = 'visible';
        cancleBtn.addEventListener('click', () => {
            console.log("clicked");

            //delete the item from the db
            console.log(orderNumber);
            dbOrders.doc(orderNumber).delete().then(() => {
                console.log("Document successfully deleted!");
                for (let i = 0; i < proList.length; ++i) {
                    var pro = dbProducts.doc(proList[i]['name']);
                    console.log("proList[i]['name'] " + proList[i]['name']);
                    pro.get().then((doc) => {
                        console.log(doc.exists);
                        if (doc.exists) {
                            pro.update({
                                    amountSold: firebase.firestore.FieldValue.increment(-1 * parseInt(proList[i]['quantity']))
                                })
                                .then(() => {
                                    //needs to update the quantity of the size
                                    updateSizeQuantity(proList[i]['size'], pro, doc, proList[i]['quantity'])
                                    console.log("Document successfully written!");
                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                        }

                    })

                }
                removeAllChildNodes(document.getElementById("products_list"));
                //reloaded the page
                initialization();
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });



        })
    }
    var orderPage = element.querySelector('#orderPage');
    orderPage.addEventListener('click', () => {
        sessionStorage.setItem('orderNumber', orderNumber); //moving parameters to order summery page
        location.replace('../components/order-summary.html');
    })

    return element;
}

function deleteFirst() {
    let elem = document.getElementById("product");
    elem.remove();
    let par = document.createElement("h2");
    par.innerHTML = "No orders have been made :("
    par.style = "color: var(--bs-pink) ;text-align:center"
    let currentDiv = document.getElementById("products_list");
    currentDiv.appendChild(par);
}

function removeAllChildNodes(parent) {
    // document.getElementById('spinner').style.display = 'inline';
    loader.style.display = 'block';

    while (parent.children.length > 1) {
        console.log("delete");
        parent.removeChild(parent.lastChild);
    }
}

function updateSizeQuantity(size, product, document, quantity) {
    var oldQuantity;
    if (size == '90 x 200') {
        oldQuantity = document.data().size90x200;
        product.update({
                size90x200: (parseInt(oldQuantity) + parseInt(quantity)).toString()
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    } else if (size == '120 x 200') {
        oldQuantity = document.data().size120x200;
        product.update({
                size120x200: (parseInt(oldQuantity) + parseInt(quantity)).toString()
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    } else if (size == "160 x 200") {
        oldQuantity = document.data().size160x200;
        product.update({
                size160x200: (parseInt(oldQuantity) + parseInt(quantity)).toString()
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    } else if (size == '180 x 200') {
        oldQuantity = document.data().size180x200;
        product.update({
                size180x200: (parseInt(oldQuantity) + parseInt(quantity)).toString()
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }

}
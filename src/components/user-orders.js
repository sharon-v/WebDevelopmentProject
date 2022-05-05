import {fbAuth, dbOrders, dbCustomers } from '../firebase/data.js'

document.querySelector('#spinner').style.visibility='visible';

var counter = 0;
var currentuser;

fbAuth.onAuthStateChanged((user) => {
    dbOrders.where("buyerEmail", "==",  user.email)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            counter = counter + 1;
            // doc.data() is never undefin  ed for query doc snapshots
            if(counter == 1)
                editElement(doc.id, doc.data().purchaseDate, doc.data().buyerEmail , doc.data().totalAmount, doc.data().orderStatus);
            else
                addElement(doc.id, doc.data().purchaseDate, doc.data().buyerEmail , doc.data().totalAmount, doc.data().orderStatus);
        });
        if(counter == 0)
        {
            //delete the first element if there is no orders
            deleteFirst();
        }
        document.querySelector('#spinner').remove();
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

});


function editElement(orderNumber, date, buyerEmail, totalAmount, orderStatus){
    let ele = document.querySelector('#product')
    ele = changeValues(ele,orderNumber, date, buyerEmail, totalAmount, orderStatus)
}

function changeValues(element, orderNumber, date, buyerEmail, totalAmount, orderStatus){
    element.removeAttribute('hidden')
    let Number = element.querySelector('#orderNumber');
    Number.innerHTML = orderNumber;
    let orderDate = element.querySelector('#orderDate');
    orderDate.innerHTML = new Intl.DateTimeFormat('en-GB').format(date.toDate());
    let buyerName = element.querySelector('#buyerName');
    
    //get user name by email
    dbCustomers.where("email", "==", buyerEmail).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            buyerName.innerHTML = String(doc.data().fname) + ' ' + String(doc.data().lname);
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    let amount = element.querySelector('#totalAmount');
    amount.innerHTML = totalAmount.toFixed(2);

    let status = element.querySelector('#orderStatus');
    status.innerHTML = orderStatus;

    let differ = Date.now() - date.toDate() ;
    let Difference_In_hours =Math.ceil(differ / (1000 * 3600 * 24));
    var cancleBtn = element.querySelector('#cancelOrderBtn');
    if (Difference_In_hours > 1){
        cancleBtn.style.visibility = 'hidden'; 
    }
    else{
        cancleBtn.style.visibility = 'visible';
        cancleBtn.addEventListener('click', () => {
             //delete the item from the db
             console.log(orderNumber)
             dbOrders.doc(orderNumber).delete().then(() => {
                console.log("Document successfully deleted!");
                //reloaded the page
                location.replace('../components/user-orders.html');
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
            


        })
    }
    var orderPage = element.querySelector('#orderPage');
    orderPage.addEventListener('click', () => {
        location.replace('../components/order-summary.html');
    })

    return element;
}

function addElement (orderNumber, date, buyerEmail, totalAmount, orderStatus) {
    let ele = document.querySelector('#product')
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, orderNumber, date, buyerEmail, totalAmount, orderStatus )
    let currentDiv = document.getElementById("products_list");

    currentDiv.appendChild(newElement);
}
      
function deleteFirst(){
    let elem = document.getElementById("product");
    elem.remove();
    let par = document.createElement("h2");
    par.innerHTML = "No orders have been made :("
    par.style="color: var(--bs-pink) ;text-align:center"
    let currentDiv = document.getElementById("products_list");
    currentDiv.appendChild(par);
}


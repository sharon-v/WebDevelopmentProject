import {fbAuth, dbOrders, dbCustomers } from '../firebase/data.js'


var counter = 0;

dbOrders.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        counter = counter + 1;
        // doc.data() is never undefin  ed for query doc snapshots
        if(counter == 1)
            editElement(doc.id, doc.data().purchaseDate, doc.data().buyerEmail , doc.data().totalAmount);
        else
            addElement(doc.id, doc.data().purchaseDate, doc.data().buyerEmail , doc.data().totalAmount);
    });
    if(counter == 0)
    {
        //delete the first element if there is no orders
        deleteFirst();
    }
});


function editElement(orderNumber, date, buyerEmail, totalAmount){
    let ele = document.querySelector('#product')
    ele = changeValues(ele,orderNumber, date, buyerEmail, totalAmount)
}

function changeValues(element, orderNumber, date, buyerEmail, totalAmount){
    console.log(orderNumber);
    console.log(date);
    console.log(buyerEmail);
    console.log(totalAmount);

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

    let amount = element.querySelector('#orderAmount');
    amount.innerHTML = totalAmount.toFixed(2);
    let selectOp = element.querySelector('#selectOp');
    let currentTime = Date.now();
    let differ = Date.now() - date.toDate() ;
    let Difference_In_hours =Math.ceil(differ / (1000 * 3600 * 24));
    if (Difference_In_hours > 1){
        selectOp.disabled = false;
    }
    else{
        selectOp.disabled = true;
    }
    var orderPage = element.querySelector('#orderPage');
    orderPage.addEventListener('click', () => {
        sessionStorage.setItem('orderNumber', orderNumber); //moving parameters to order summery page
        location.replace('../components/order-summary.html');
    })
    return element;
}

function addElement (orderNumber, date, buyerEmail, totalAmount) {
    let ele = document.querySelector('#product')
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, orderNumber, date, buyerEmail, totalAmount )
    let currentDiv = document.getElementById("orders_list");
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
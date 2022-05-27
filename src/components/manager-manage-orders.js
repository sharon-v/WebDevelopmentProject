import {dbOrders, dbCustomers } from '../firebase/data.js'

document.querySelector('#spinner').style.visibility='visible';

initialization();
function initialization(){
    dbOrders.get().then((querySnapshot) => {
        var counter = 0;
        querySnapshot.forEach((doc) => {
            counter = counter + 1;
            if(counter == 1){
                editElement(doc.id, doc.data().purchaseDate, doc.data().buyerEmail , doc.data().totalAmount, doc.data().orderStatus);
                document.querySelector('#product').style.visibility='visible';
            }
            else{
                addElement(doc.id, doc.data().purchaseDate, doc.data().buyerEmail , doc.data().totalAmount, doc.data().orderStatus);
                document.querySelector('#product').style.visibility='visible';
            }
        });
        if(counter == 0)
        {
            //delete the first element if there is no orders
            deleteFirst();
        }
        document.querySelector('#spinner').style.display = 'none';
    });
}


var searchButtton = document.querySelector('#searchButton');
var searchInput = document.querySelector('#searchInput');
searchButtton.addEventListener('click', () => {
    filterByOrderId();
})

searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      // code for enter
      filterByOrderId();

    }
});

function filterByOrderId(){
    document.querySelector('#spinner').style.display='inline';
    if (searchInput.value.length > 0){
        const container = document.querySelector('#orders_list');
        removeAllChildNodes(container);
        dbOrders.doc(searchInput.value).get().then((doc) => {
            if (doc.exists){
                editElement(doc.id, doc.data().purchaseDate, doc.data().buyerEmail , doc.data().totalAmount, doc.data().orderStatus);
                document.querySelector('#spinner').style.display = 'none';
            } else 
            {
                container.lastElementChild.style.display = "none";
                document.querySelector('#noOrderMessage').style.display = "inline";
                document.querySelector('#spinner').style.display = 'none';
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    else{
        document.querySelector('#orders_list').lastElementChild.style.display = "inline";
        document.querySelector('#noOrderMessage').style.display = "none";
        document.querySelector('#spinner').style.visibility='visible';
        initialization();
    }
}


function editElement(orderNumber, date, buyerEmail, totalAmount, orderStatus){
    let ele = document.querySelector('#product')
    ele = changeValues(ele,orderNumber, date, buyerEmail, totalAmount, orderStatus)
    ele.style.visibility="visible";
}

function addElement (orderNumber, date, buyerEmail, totalAmount, orderStatus) {
    let ele = document.querySelector('#product')
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, orderNumber, date, buyerEmail, totalAmount, orderStatus)
    let currentDiv = document.getElementById("orders_list");
    currentDiv.appendChild(newElement);
    newElement.style.visibility="visible"; 
}

function changeValues(element, orderNumber, date, buyerEmail, totalAmount, orderStatus){
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
        buyerName.innerHTML = '*****';
        console.log("Error getting documents: ", error);
    });

    let amount = element.querySelector('#orderAmount');
    amount.innerHTML = totalAmount.toFixed(2) + ' ₪';
    let selectOp = element.querySelector('#selectOp');
    let currentTime = Date.now();
    let differ = Date.now() - date ;
    let Difference_In_hours =Math.ceil(differ / (1000 * 3600 * 24));
    if (Difference_In_hours > 1){
        selectOp.disabled = false;
    }
    else{
        selectOp.disabled = true;
    }
    console.log(orderStatus);
    const options = Array.from(selectOp.options);
    const optionToSelect = options.find(item => item.text === orderStatus);
    selectOp.value = optionToSelect.value;

    selectOp.addEventListener('change', () => {
        updateOrderStatus(selectOp.options[ selectOp.selectedIndex ].value, orderNumber);
    })

    var orderPage = element.querySelector('#orderPage');
    orderPage.addEventListener('click', () => {
        sessionStorage.setItem('orderNumber', orderNumber); //moving parameters to order summery page
        location.replace('../components/order-summary.html');
    })
    return element;
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


function updateOrderStatus(value, orderId){  
    var order = dbOrders.doc(orderId);
    if(value == 1){
        order.update({"orderStatus" : 'Aprroved'});
    }
    else if (value == 2){
        order.update({"orderStatus" : 'Canceled'});
    }
}

function removeAllChildNodes(parent) {
    while(parent.children.length > 2){
        console.log("delete");
        parent.removeChild(parent.lastChild);
    }
}
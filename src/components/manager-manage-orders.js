import {dbOrders, dbCustomers, dbProducts } from '../firebase/data.js'

document.querySelector('#spinner').style.visibility='visible';

initialization();
function initialization(){
    dbOrders.get().then((querySnapshot) => {
        var counter = 0;
        querySnapshot.forEach((doc) => {
            counter = counter + 1;
            addElement(doc.id, doc.data().purchaseDate, doc.data().buyerEmail , doc.data().totalAmount, doc.data().orderStatus, doc.data().productsList);
            document.querySelector('#product').style.visibility='visible';
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
                editElement(doc.id, doc.data().purchaseDate, doc.data().buyerEmail , doc.data().totalAmount, doc.data().orderStatus, doc.data().productsList);
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

function addElement (orderNumber, date, buyerEmail, totalAmount, orderStatus, proList) {
    let ele = document.querySelector('#product')
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, orderNumber, date, buyerEmail, totalAmount, orderStatus, proList)
    let currentDiv = document.getElementById("orders_list");
    currentDiv.appendChild(newElement);
    newElement.style.visibility="visible"; 
}

function changeValues(element, orderNumber, date, buyerEmail, totalAmount, orderStatus, proList){
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
        selectOp.disabled = true;
    }
    else{
        selectOp.disabled = false;
    }
    console.log(orderStatus);
    const options = Array.from(selectOp.options);
    const optionToSelect = options.find(item => item.text === orderStatus);
    selectOp.value = optionToSelect.value;

    selectOp.addEventListener('change', () => {
        updateOrder(selectOp.options[ selectOp.selectedIndex ].value, orderNumber, proList);
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
    let currentDiv = document.getElementById("orders_list");
    currentDiv.appendChild(par);
}


function updateOrder(value, orderId, proList){  
    var order = dbOrders.doc(orderId);
    var orderStat; 
    if(value == 1){
        orderStat = 'Aprroved';
    }
    else if (value == 2){
        orderStat = 'Canceled';
    }
    for(let i = 0 ; i< proList.length ; ++i)
    {
        var pro = dbProducts.doc(proList[i]['name']);
        pro.get().then((doc) => {
            console.log(doc.exists);
            var incrementValue;
            var multi;
            if (doc.exists) {
                if(value == 1){
                    incrementValue = parseInt(proList[i]['quantity']);
                    multi = 1;
                }
                else if (value == 2){
                    incrementValue = -1*parseInt(proList[i]['quantity']);
                    multi = -1;
                }
                pro.update({
                    amountSold: firebase.firestore.FieldValue.increment(incrementValue)
                })
                .then(() => {
                    //needs to update the quantity of the size
                    updateSizeQuantity(proList[i]['size'], pro, doc, multi * parseInt(proList[i]['quantity']));
                    order.update({"orderStatus" : orderStat});
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });  
            }
            
        })

    }
}

function removeAllChildNodes(parent) {
    while(parent.children.length > 2){
        console.log("delete");
        parent.removeChild(parent.lastChild);
    }
}

function updateSizeQuantity(size, product, document, quantity)
{
    var oldQuantity;
    if(size == '90 x 200')
    {
        oldQuantity = document.data().size90x200;
        product.update({
            size90x200: (parseInt(oldQuantity) + quantity).toString()
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });    
    }
    else if(size == '120 x 200')
    {
        oldQuantity = document.data().size120x200;
        product.update({
            size120x200: (parseInt(oldQuantity) + quantity).toString()
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });    
    }
    else if(size == "160 x 200")
    {
        oldQuantity = document.data().size160x200;
        product.update({
            size160x200: (parseInt(oldQuantity) + quantity).toString()
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });    
    }
    else if(size == '180 x 200')
    {
        oldQuantity = document.data().size180x200;
        product.update({
            size180x200: (parseInt(oldQuantity) + quantity).toString()
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });    
    }
    
}
import {dbOrders, dbProducts} from '../firebase/data.js'

const spinner = document.querySelector('#spinner');
spinner.style.visibility='visible';

var orderNumber = sessionStorage.getItem('orderNumber');

dbOrders.doc(orderNumber).get().then((doc) => {
    if (doc.exists){
        var productList = doc.data().productsList;
        productList.push("");
        for(let i = 0 ; i < productList.length ; ++i)
        {
            console.log(productList[i].productId);
            dbProducts.doc(productList[i].productId).get().then((pro) =>{
                if (pro.exists)
                {
                    if(i == 0)
                    {
                        editElement(pro.id, pro.data().sku, productList[i].price, productList[i].quantity, pro.data().imageUrl);
                    }
                    else
                    {
                        addElement(pro.id, pro.data().sku, productList[i].price, productList[i].quantity, pro.data().imageUrl);
                    }
                    editOrderDetails(doc.data().firstName, doc.data().lastName, doc.data().street, doc.data().streetNumber, doc.data().apartmentNumber, doc.data().city
                        , doc.data().postalCode, doc.data().phoneNumber, doc.data().shippingDate, doc.data().shippingHours, doc.data().notes);
                    }
                else
                {
                    editOrderSummary(doc.data().totalItems, doc.data().totalAmount);
                    spinner.style.display = 'none';
                }
            })
        }
    }
    else 
    {   
        console.log("No such document!");
    }
});


function editElement(Name, SKU, price, quantity, url){
    let ele = document.querySelector('#product');
    ele = changeValues(ele, Name, SKU, price, quantity, url);
}

function changeValues(element, Name, SKU, price, quantity, url){
    element.removeAttribute('hidden');
    let productName = element.querySelector('#productName');
    productName.innerHTML = Name;
    let sku = element.querySelector('#productSKU');
    sku.innerHTML = SKU;
    let productPrice = element.querySelector('#productPrice');
    productPrice.innerHTML = price + '₪';
    let productQuantity = element.querySelector('#productQuantity');
    productQuantity.innerHTML = quantity;
    let totalProductPrice = element.querySelector('#totalProductPrice');
    totalProductPrice.innerHTML = (price*quantity) +'₪';
    //TODO: add image ref
    return element;
}

function addElement (Name, SKU, price, quantity, url) {
    let ele = document.querySelector('#product');
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, Name, SKU, price, quantity, url);
    let currentDiv = document.getElementById("productsList");
    currentDiv.appendChild(newElement);
}

function editOrderDetails(firstName, lastName, street, streetNumber, apartmentNumber, city ,postalCode, phoneNumber, shippingDate, shippingHours, notes)
{
    var element = document.querySelector('#orderDetails');
    element.removeAttribute('hidden');
    element.querySelector('#fullName').innerHTML = firstName + " " + lastName;
    if(apartmentNumber == "")
    {
        element.querySelector('#address').innerHTML = street + " " + streetNumber + ", " + city;
    }
    else
    {
        element.querySelector('#address').innerHTML = street + " " + streetNumber + "/" + apartmentNumber + ", " + city;
    }
    element.querySelector('#postalCode').innerHTML = postalCode;
    element.querySelector('#phoneNumber').innerHTML = phoneNumber;
    element.querySelector('#shippingDate').innerHTML = shippingDate;
    element.querySelector('#shippingHours').innerHTML = shippingHours;
    if(notes == "")
        element.querySelector('#notes').innerHTML = 'The costumer didn`t enter any notes';
    else
        element.querySelector('#notes').innerHTML = notes;
}

function editOrderSummary(quantity, price)
{
    var element = document.querySelector('#orderSummary');
    element.removeAttribute('hidden');
    element.querySelector('#totalOrder').innerHTML = price;
    element.querySelector('#totalProducts').innerHTML = quantity;
    element.querySelector('#totalPrice').innerHTML = price;

}
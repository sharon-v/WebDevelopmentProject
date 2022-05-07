import {dbProducts } from '../firebase/data.js'

document.querySelector('#spinner').style.visibility='visible';

initialization();
function initialization(){
    dbProducts.get().then((querySnapshot) => {
        var counter = 0;
        querySnapshot.forEach((doc) => {
            counter = counter + 1;
            if(counter == 1){
                editElement(doc.id, doc.data().purchaseDate, doc.data().Pname ,doc.data().bedSize, doc.data().price, doc.data().quantity);
                document.querySelector('#product').style.visibility='visible';
            }
            else{
                addElement(doc.id, doc.data().purchaseDate, doc.data().Pname ,doc.data().bedSize, doc.data().price, doc.data().quantity);
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
    filterByProductId();
})

searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      // code for enter
      filterByProductId();

    }
});

function filterByProductId(){
    document.querySelector('#spinner').style.display='inline';
    if (searchInput.value.length > 0){
        var container = document.querySelector('#orders_list');
        removeAllChildNodes(container);
        dbProducts.doc(searchInput.value).get().then((doc) => {
            if (doc.exists){
                editElement(doc.id, doc.data().purchaseDate, doc.data().Pname ,doc.data().bedSize, doc.data().price, doc.data().quantity);
                document.querySelector('#spinner').style.display = 'none';
            } else {
              console.log("No such document!");
            }}).catch((error) => {
              console.log("Error getting document:", error);
            });
    }
    else{
        document.querySelector('#spinner').style.visibility='visible';
        initialization();
    }
}


function editElement(Pname ,bedSize, price, quantity){
    let ele = document.querySelector('#product')
    ele = changeValues(ele, Pname ,bedSize, price, quantity)
    ele.style.visibility="visible";
}

function changeValues(element, Pname ,bedSize, price, quantity){
    element.removeAttribute('hidden')
    let Pname = element.querySelector('#productName');
    Pname.innerHTML = Pname;
    let bedSize = element.querySelector('#bedSize');
    bedSize.innerHTML = bedSize;
    let price = element.querySelector('#price');
    price.innerHTML = price;
    let quantity = element.querySelector('#quantity');
    quantity.innerHTML = quantity;


    // var editProduct = element.querySelector('#editButton');
    const editProduct = document.getElementById('editButton');
    // const size180x200 = document.getElementById('quantity_180x200');
    editProduct.addEventListener('click', () => {
        sessionStorage.setItem('Pname', Pname); //moving parameters to order summery page
        location.replace('../components/manager-edit-product.html');
    })
    return element;
}

function addElement (Pname ,bedSize, price, quantity) {
    let ele = document.querySelector('#product')
    let newElement = ele.cloneNode(true);
    newElement = changeValues(newElement, Pname ,bedSize, price, quantity)
    let currentDiv = document.getElementById("products_list");
    currentDiv.appendChild(newElement);
    newElement.style.visibility="visible"; 
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

function removeAllChildNodes(parent) {
    if( parent.children.length > 1)
    {
        for(var i = 0; i < parent.children.length ; i++) {
            parent.children[i].remove();
        }
    }


}
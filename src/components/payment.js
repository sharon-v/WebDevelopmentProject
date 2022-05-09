import {fbAuth,dbOrders, dbShoppingCart,dbOrdersTimes, dbProducts} from '../firebase/data.js'
initialization();

function initialization(){
    let totalItems = 0;
    let totalAmount = 0;
    const amount = document.getElementById('totalPrice');
    const items = document.getElementById('totalItems');

    fbAuth.onAuthStateChanged((user) => {
        dbShoppingCart.doc(user.email).get().then((querySnapshot) => {
            var userShoppingCart = querySnapshot.data().productList;
            for(var i = 0; i< userShoppingCart.length; ++i){
                ////////////
                
                ////////////
                totalItems = totalItems + userShoppingCart[i].quantity;
                totalAmount = totalItems + userShoppingCart[i].price;
            }
            items.innerHTML = totalItems;
            amount.innerHTML = totalAmount + '₪';
            document.getElementById('mainElement').style.display='inline';
            document.getElementById('spinner').style.display='none';
        })
    })

    dbOrdersTimes.get().then((querySnapshot) => {
        var counter = 0;
        querySnapshot.forEach((doc) => {
            var date = document.getElementById('dateSelect');
            if(Date.now() < new Date(doc.id).getTime()){ //
                counter = counter + 1;
                var opt = document.createElement('option');
                opt.value = counter;
                opt.innerHTML = doc.id;
                date.appendChild(opt);
            }
        });
    });
}


var date = document.getElementById('dateSelect');
var hours = document.getElementById('hourSelect');
date.addEventListener('change', (e) => {
    //deleting the old hours
    while (hours.children.length > 1) {
        hours.removeChild(hours.lastChild);
      }
    dbOrdersTimes.doc(date.options[date.selectedIndex].text).get().then((querySnapshot) => {
        for(let index = 0; index < querySnapshot.data().hours.length; ++index){
            var opt = document.createElement('option');
            opt.innerHTML = querySnapshot.data().hours[index];
            hours.appendChild(opt);
        }
    });
})


var btn = document.getElementById('payment_pay_button');
  // when press on sign up button
  btn.addEventListener('click', (e) => {
    e.preventDefault();  // IMPORTANT! so the db functions could work, DO NOT REMOVE
    console.log('clicked on pay');

    // getting the order personal details from the html
    const fname = document.getElementById('orderFname').value;
    const lname = document.getElementById('orderLname').value;
    const street = document.getElementById('orderStreet').value;
    const streetNumber = document.getElementById('orderStreetNumber').value;
    const apartment = document.getElementById('orderApartment');
    if(apartment.length == 0)
        apartment.value = 0;
    let temp =  document.getElementById('city');
    const city = temp.options[temp.selectedIndex];
    const postalCode = document.getElementById('postalCode').value;
    const PhoneNumber = document.getElementById('PhoneNumber').value;
    const notes = document.getElementById('notes');
    if(notes.length == 0)
        notes.value = '';
    const orderDate = date.options[date.selectedIndex];
    const orderHours = hours.options[hours.selectedIndex];
    temp =  document.getElementById('numberOfPayments');
    const numOfPayments = temp.options[temp.selectedIndex];
    const ID = document.getElementById('Card_owner`s_ID').value;
    temp =  document.getElementById('expirationMonth');
    const expirationMonth = temp.options[temp.selectedIndex];
    temp =  document.getElementById('expirationYear');
    const expirationYear = temp.options[temp.selectedIndex];
    const cardNumber = document.getElementById('card_number').value;
    const cvc = document.getElementById('cvc').value;
    let res = checkData(fname, lname, street, streetNumber, postalCode, city, orderDate, orderHours, expirationMonth, expirationYear,  ID, cardNumber, cvc);
    if (res == true){
        console.log("true");
        fbAuth.onAuthStateChanged((user) => {
            // Add a new document in collection "orders"
            let productsList;
            dbShoppingCart.doc(user.email).get().then((doc) => {
                productsList = doc.data().productList;
                console.log(productsList);
                const now = new Date(Date.now()).getTime();
                dbOrders.doc(fname + now).set({
                    buyerEmail: user.email,
                    orderStatus: "Aprroved",
                    purchaseDate: now,
                    totalAmount: document.getElementById('totalPrice').textContent,
                    totalItems: document.getElementById('totalItems').textContent,
                    productsList: productsList,
                    //to check if needed
                    firstName: fname,
                    lastName: lname,
                    street: street,
                    streetNumber: streetNumber,
                    apartmentNumber: apartment.value,
                    city: city.text,
                    postalCode: postalCode,
                    phoneNumber: PhoneNumber,
                    notes: notes.value,
                    shippingDate: orderDate.text,
                    shippingHours: orderHours.text
                })
                .then(() => {
                    console.log("Document successfully written!");
                    sessionStorage.setItem('orderNumber', fname + now); //moving parameters to order summery page
                    location.replace('../components/order-summary.html');
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            })
        })
        
    }
});

function checkData(fname, lname, street, streetNumber, postalCode, city, orderDate, orderHours, expirationMonth, expirationYear,  ID, cardNumber, cvc)
{
    if(fname.length < 1){
        alert('You must enter your first name');
        return false;
    }
    if(lname.length < 1){
        alert('You must enter your last name');
        return false;
    }
    if(street.length < 1){
        alert('You must enter your street address');
        return false;
    }
    if(streetNumber.length < 1){
        alert('You must enter your street number');
        return false;
    }
    if(city.value == 0){
        alert('plaese pick a city from the list');
        return false;
    }
    if(postalCode.length != 7){
        alert('You enter invalid postal code');
        return false;
    }
    if(orderDate.value == 0){
        alert('plaese pick a date for the order from the list');
        return false;
    }
    if(orderHours.value == 0){
        alert('plaese pick a hours for the order from the list');
        return false;
    }
    if(ID.length != 9){
        alert('You enter invalid ID number');
        return false;
    }
    if(expirationMonth.value == 0){
        alert('plaese pick a expiration month from the list');
        return false;
    }
    if(expirationYear.value == 0){
        alert('plaese pick a expiration year from the list');
        return false;
    }
    const now = new Date(Date.now());
    if(expirationYear.value == now.getFullYear())
    {
        if((now.getMonth() +1) > parseInt(expirationMonth.value)){
            alert('The expiration date that you enter is invalid');
            return false;
        }
    }
    if(cardNumber.length != 16){
        alert('You enter invalid card number');
        return false;
    }
    if(cvc.length != 3){
        alert('You enter invalid cvc');
        return false;
    }
    return true;
}
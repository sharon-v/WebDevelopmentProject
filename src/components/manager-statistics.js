import { dbOrders, dbCustomers, fbAuth, dbProducts } from '../firebase/data.js'

howManyCusInThisYear();
function howManyCusInThisYear() {
    dbCustomers.get().then((querySnapshot) => {
        var countCus = 0;
        var correntYear = new Date().getFullYear()
        querySnapshot.forEach((doc) => {
            console.log(new Date().getFullYear);
            if (doc.data().regisrationYear == parseInt(correntYear)) {
                // console.log(doc.data().regisrationYear);
                countCus += 1;
            }
        });
        // console.log(countCus);
        document.getElementById('newUsers').innerHTML = countCus + " users";
    });
}

whichProdIsbestseller();
function whichProdIsbestseller() {
    dbProducts.get().then((querySnapshot) => {
        var bestSeller = 0;
        var prodName = '';
        querySnapshot.forEach((doc) => {
            if (doc.data().amountSold > bestSeller) {
                bestSeller = doc.data().amountSold;
                prodName = doc.data().Pname;
            }
        });
        console.log(prodName);
        document.getElementById('bestSeller').innerHTML = prodName;
    });
}

// var Combo = document.querySelector('#month');
// Combo.addEventListener('month', (e) => {
//     // make filter combo empty
//     var month = document.getElementById('month').value;
//     console.log(month);
//     // howManyProdInMonth(document.getElementById('month').value);
//     // function howManyProdInMonth(month) {
//     dbOrders.get().then((querySnapshot) => {
//         var countPro = 0;
//         querySnapshot.forEach((doc) => {
//             var parts = doc.data().shippingDate.split("-");
//             var dtMonth = parts[1];
//             if (parseInt(dtMonth) == month) {
//                 countPro += parseInt(doc.data().totalItems);
//             }
//         });
//         console.log(countPro);
//         document.getElementById('prodMonth').innerHTML = countPro;
//     });
// });

howManyProdInMonth(document.getElementById('month').value);
function howManyProdInMonth(month) {
    console.log(month);
    dbOrders.get().then((querySnapshot) => {
        var countPro = 0;
        querySnapshot.forEach((doc) => {
            var parts = doc.data().shippingDate.split("-");
            var dtMonth = parts[1];
            if (parseInt(dtMonth) == month) {
                countPro += parseInt(doc.data().totalItems);
            }
        });
        console.log(countPro);
        document.getElementById('prodMonth').innerHTML = countPro + " products";
    });
}

howManyProdInYear(document.getElementById('Pyear').value);
function howManyProdInYear(year) {
    console.log(year);
    dbOrders.get().then((querySnapshot) => {
        var countPro = 0;
        querySnapshot.forEach((doc) => {
            var parts = doc.data().shippingDate.split("-");
            var dtYear = parts[0];
            if (dtYear == year) {
                countPro += parseInt(doc.data().totalItems);
            }
        });
        console.log(countPro);
        document.getElementById('prodYear').innerHTML = countPro + " products";
    });
}

howManyOrdersInYear(document.getElementById('Oyear').value);
function howManyOrdersInYear(year) {
    dbOrders.get().then((querySnapshot) => {
        var countOrd = 0;
        querySnapshot.forEach((doc) => {
            var parts = doc.data().shippingDate.split("-");
            var dtYear = parts[0];
            if (dtYear == year) {
                countOrd++;
            }
        });
        console.log(countOrd);
        document.getElementById('orders').innerHTML = countOrd + " orders";
    });
}

howManyIncomeInYear(document.getElementById('incomeY').value);
function howManyIncomeInYear(year) {
    dbOrders.get().then((querySnapshot) => {
        var countInc = 0;
        querySnapshot.forEach((doc) => {
            var parts = doc.data().shippingDate.split("-");
            var dtYear = parts[0];
            if (dtYear == year) {
                countInc += parseFloat(doc.data().totalAmount).toFixed(2);
            }
        });
        console.log(countInc);
        document.getElementById('income').innerHTML = countInc + "₪";
    });
}

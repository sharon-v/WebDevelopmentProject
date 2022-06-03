import { dbOrders, dbCustomers, fbAuth, dbProducts } from '../firebase/data.js'


const loader = document.querySelector('#modal');
loader.style.display = 'block'; 

howManyCusInThisYear();
function howManyCusInThisYear() {
    dbCustomers.get().then((querySnapshot) => {
        var countCus = 0;
        var correntYear = new Date().getFullYear()
        querySnapshot.forEach((doc) => {
            console.log(new Date().getFullYear);
            if (doc.data().regisrationYear == parseInt(correntYear)) {
                countCus += 1;
            }
        });
        document.getElementById('newUsers').innerHTML = countCus + " users";
    });
}

whichProdIsbestseller();
function whichProdIsbestseller() {
    var bestSeller = 0;
    var prodName = '';
    dbProducts.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().amountSold > bestSeller) {
                bestSeller = doc.data().amountSold;
                prodName = doc.data().Pname;
            }
        });
        console.log(prodName);
        if(bestSeller == 0)
        {
            document.getElementById('bestSeller').innerHTML = "No sells this month :(";
        }
        else
        {
            document.getElementById('bestSeller').innerHTML = prodName;
        }
    });
}

var Combo = document.querySelector('#month');
Combo.addEventListener('change', (e) => {
    howManyProdInMonth();
});

howManyProdInMonth();
function howManyProdInMonth() {
    var month = document.getElementById('month').value;
    console.log(month);
    dbOrders.get().then((querySnapshot) => {
        var countPro = 0;
        querySnapshot.forEach((doc) => {
            var parts = new Date(doc.data().purchaseDate).getMonth() + 1;
            if (parseInt(parts) == month && doc.data().orderStatus == 'Aprroved') {
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
            var dtYear = new Date(doc.data().purchaseDate).getFullYear();
            if (parseInt(dtYear) == year && doc.data().orderStatus == 'Aprroved') {
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
            var dtYear = new Date(doc.data().purchaseDate).getFullYear();
            if (parseInt(dtYear) == year && doc.data().orderStatus == 'Aprroved') {
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
            var dtYear = new Date(doc.data().purchaseDate).getFullYear();
            if (parseInt(dtYear) == year && doc.data().orderStatus == 'Aprroved') {
                countInc += doc.data().totalAmount;
            }
        });
        console.log(countInc);
        document.getElementById('income').innerHTML = countInc.toFixed(2) + "₪";
        loader.style.display = 'none'; 
    });
}

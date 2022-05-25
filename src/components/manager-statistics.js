import { createIndexes } from 'moongose/models/user_model';
import { dbOrders, dbCustomers, fbAuth } from '../firebase/data.js'

howManyCusInLastYear();
function howManyCusInLastYear() {
    fbAuth.get().then((querySnapshot) => {
        var countCus = 0;
        querySnapshot.forEach((doc) => {
            if (querySnapshot.userRecord.metadata.creationTime.year == new Date().getFullYear) {
                countCus += 1;
            }
        });
    });
    console.log(countCus);
    // put the counter value in the box of the answer
}



howManyProdInMonth(05);
function howManyProdInMonth(month) {
    dbOrders.get().then((querySnapshot) => {
        var countPro = 0;
        querySnapshot.forEach((doc) => {
            if (shippingDate.month == month) {
                countPro += totalItems;
            }
        });
    });
    console.log(countOrd);
    // put the counter value in the box of the answer
}
howManyProdInYear(2022);
function howManyProdInYear(year) {
    dbOrders.get().then((querySnapshot) => {
        var countPro = 0;
        querySnapshot.forEach((doc) => {
            if (shippingDate.year == year) {
                countPro += totalItems;
            }
        });
    });
    console.log(countOrd);
    // put the counter value in the box of the answer
}
howManyOrdersInYear(2022);
function howManyOrdersInYear(year) {
    dbOrders.get().then((querySnapshot) => {
        var countOrd = 0;
        querySnapshot.forEach((doc) => {
            if (shippingDate.year == year) {
                countOrd += 1;
            }
        });
    });
    console.log(countOrd);
    // put the counter value in the box of the answer
}
howManyIncomeInYear(2022);
function howManyIncomeInYear(year) {
    dbOrders.get().then((querySnapshot) => {
        var countInc = 0;
        querySnapshot.forEach((doc) => {
            if (shippingDate.year == year) {
                countInc += totalAmount;
            }
        });
    });
    console.log(countInc);
    // put the counter value in the box of the answer
}

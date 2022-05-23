import { dbCustomers, dbManager } from '../firebase/data.js';

var userName = sessionStorage.getItem('email');
console.log(userName);
// take care about manager
if (userName == 'mani@gmail.com') {
    dbManager.doc(userName).get().then((doc) => {
        if (doc.exists) {
            insertData(doc.id, doc.data().fname, doc.data().lname, doc.data().phoneNumber, doc.data().birthdate, doc.data().email);
        }
        else {
            alert("Cannot find this user");
            console.log("No such document!");
        }
    });
}
else {
    dbCustomers.doc(userName).get().then((doc) => {
        if (doc.exists) {
            insertData(doc.id, doc.data().fname, doc.data().lname, doc.data().phoneNumber, doc.data().birthdate, doc.data().email);
        }
        else {
            alert("Cannot find this user");
            console.log("No such document!");
        }
    });
}
function insertData(Fname, Lname, phone, Bday, email) {
    // there is something strange with the names of the labals but its work well 
    document.getElementById('first_name').value = Lname;
    document.getElementById('last_name').value = phone;
    document.getElementById('phone_number').value = Bday;
    document.getElementById('Birthday').value = email;
    document.getElementById('username').value = Fname;
}
function setDetailsOnDB(Fname, Lname, phone) {

    dbCustomers.doc(userName).update({
        Fname: Fname,
        Lname: Lname,
        phone: phone,
    }).then(() => {
        console.log('Document successfully added');
        location.replace('../components/profile.html');
    })
        .catch((error) => {
            console.error('Error writing document: ', error);
            console.log('fail');
            var errorMessage = error.message;
            alert(errorMessage);
        });
}
document.addEventListener('DOMContentLoaded', () => {
    var btn = document.getElementById('save_btn');
    btn.addEventListener('click', (e) => {
        // document.querySelector('#spinner').style.display = 'inline';

        e.preventDefault();
        var Fname = document.getElementById('first_name').value;
        var Lname = document.getElementById('last_name').value;
        var phone = document.getElementById('phone_number').value;
        setDetailsOnDB(Fname, Lname, phone);
        //document.querySelector('#spinner').style.display = 'none';

    });
});


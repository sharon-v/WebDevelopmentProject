import { dbCustomers, dbManager } from '../firebase/data.js';

var userName = sessionStorage.getItem('email');
// take care about manager
dbCustomers.doc(userName).get().then((doc) => {
    if (doc.exists) {
        insertData(doc.id, doc.data().fname, doc.data().lname, doc.data().phoneNumber, doc.data().birthdate, doc.data().email);
    }
    else {
        alert("Cannot find this user");
        console.log("No such document!");
    }
});
function insertData(Fname, Lname, phone, Bday, email) {
    document.getElementById('first_name').value = Fname;
    document.getElementById('last_name').value = Lname;
    document.getElementById('phone_number').value = phone;
    document.getElementById('Birthday').value = Bday;
    document.getElementById('username').value = email;
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


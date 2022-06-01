import {
    dbCustomers
} from '../firebase/data.js';

var userName = sessionStorage.getItem('email');
console.log(userName);

dbCustomers.doc(userName).get().then((doc) => {
    if (doc.exists) {
        insertData(doc.data().fname, doc.data().lname, doc.data().phoneNumber, doc.data().birthdate, doc.data().email);
    } else {
        alert("Cannot find this user");
        console.log("No such document!");
    }
});
// }
function insertData(Fname, Lname, phone, Bday, email) {
    // there is something strange with the names of the labals but its work well 
    document.getElementById('first_name').value = Fname;
    document.getElementById('last_name').value = Lname;
    document.getElementById('phone_number').value = phone;
    document.getElementById('Birthday').value = Bday;
    document.getElementById('username').value = email;
    document.querySelector('#spinner').style.display = 'none';

}

function setDetailsOnDB(fname, lname, phoneNumber) {
    dbCustomers.doc(userName).update({
            fname: fname,
            lname: lname,
            phoneNumber: phoneNumber,
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
        document.querySelector('#spinner').style.display = 'inline';

        e.preventDefault();
        var fname = document.getElementById('first_name').value;
        var lname = document.getElementById('last_name').value;
        var phoneNumber = document.getElementById('phone_number').value;
        setDetailsOnDB(fname, lname, phoneNumber);
        document.querySelector('#spinner').style.display = 'none';

    });
});
import {
    dbManager
} from '../firebase/data.js';

var userName = sessionStorage.getItem('email');
console.log(userName);

document.getElementById('detailsContainer').style.visibility = "hidden";

dbManager.doc(userName).get().then((doc) => {
    if (doc.exists) {
        insertData(doc.data().fname, doc.data().lname, doc.data().phoneNumber, doc.data().birthdate, doc.data().email);
    } else {
        alert("Cannot find this user");
        console.log("No such document!");
    }
});


function insertData(Fname, Lname, phone, Bday, email) {
    // there is something strange with the names of the labals but its work well 
    document.getElementById('first_name').value = Fname;
    document.getElementById('last_name').value = Lname;
    document.getElementById('phone_number').value = phone;
    document.getElementById('Birthday').value = Bday;
    document.getElementById('username').value = email;
    document.querySelector('#spinner').style.display = 'none';
    document.getElementById('detailsContainer').style.visibility = "visible";


}

function setDetailsOnDB(fname, lname, phoneNumber) {


    dbManager.doc(userName).update({
            fname: fname,
            lname: lname,
            phoneNumber: phoneNumber,
        }).then(() => {
            console.log('Document successfully added');
            location.replace('../components/manager-profile.html');
        })
        .catch((error) => {
            console.error('Error writing document: ', error);
            console.log('fail');
            var errorMessage = error.message;
            alert(errorMessage);
        });
}
// }
document.addEventListener('DOMContentLoaded', () => {
    var btn = document.getElementById('save_btn');
    btn.addEventListener('click', (e) => {
        document.querySelector('#spinner').style.display = 'inline';

        e.preventDefault();
        var fname = document.getElementById('first_name').value;
        var lname = document.getElementById('last_name').value;
        var phoneNumber = document.getElementById('phone_number').value;
        if(!checkConditions(fname, lname, phoneNumber))
        {
            document.querySelector('#spinner').style.display = 'none';
            return;
        }
        else
        {
            setDetailsOnDB(fname, lname, phoneNumber);
        }
        document.querySelector('#spinner').style.display = 'none';

    });
});


function checkConditions(fname, lname, phone_number)
{
    if(!checkUserFirstLastName(fname))
  {
    return false;
  }

  if(!checkUserFirstLastName(lname))
  {
    return false;
  }
  if (!checkPhoneNumber(phone_number)) {
    return false;
  }
  return true;
}

function checkUserFirstLastName(name)
{
  if(/^[0-9]+$/.test(name))
  {
    alert('First name and last name should not be with digits');
    return false;
  }
  else if (name == null || name == "") {
    alert("Please Fill First Name Field");
        return false;
  }
  return true;
}

function checkPhoneNumber(phoneNumber) {
  if (/^[0-9]+$/.test(phoneNumber)) {
    console.log('phone-length', phoneNumber.length);
    if (phoneNumber.length != 10) {
      alert('Phone number should be 10 digis long');
      return false;
    }
    return true;
  }
  else {
    alert('phone number should contain digits only');
    return false;
  }
}
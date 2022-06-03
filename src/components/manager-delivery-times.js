import {
    dbOrdersTimes
} from '../firebase/data.js';

const loader = document.querySelector('#modal');
loader.style.display = 'block';

const save_changes_btn = document.getElementById('saveChanges');

datesInit();

function datesInit() {
    var date = document.getElementById('dateSelect');
    while (date.options.length > 2) {
        date.remove(date.options.length - 1);
    }
    //Initialization of the unavailable dates
    dbOrdersTimes.get().then((querySnapshot) => {
        var counter = 0;
        querySnapshot.forEach((doc) => {
            if (Date.now() < new Date(doc.id).getTime()) { //
                counter = counter + 1;
                var opt = document.createElement('option');
                opt.style.color = "black";
                opt.value = counter;
                opt.innerHTML = doc.id;
                date.appendChild(opt);
            }
        });
        loader.style.display = 'none';
    });
}



save_changes_btn.addEventListener('click', () => {
    loader.style.display = 'block';
    var listOfHours = document.getElementsByClassName('form-check');
    var unavailable = [];
    for (var i = 0; i < listOfHours.length; i++) {
        if (listOfHours[i].querySelector('#hourCheckBok').checked == false) {
            unavailable.push(listOfHours[i].querySelector('#hourString').textContent);
        }
    }
    const selectedDate = document.getElementById('selectedDate').value;
    if (selectedDate == "") {
        loader.style.display = 'none';
        alert("Please choose date");
    }
    else {
        var now = new Date();
        if (checkDate(now, selectedDate) > 0) {
            addHour(selectedDate, unavailable);
        } else {
            loader.style.display = 'none';
            alert("The selected date in invalid");
        }
    }
});



var date = document.getElementById('dateSelect');
var hours = document.getElementById('hourSelect');
date.addEventListener('change', (e) => {
    //deleting the old hours
    while (hours.children.length > 1) {
        hours.removeChild(hours.lastChild);
    }
    loader.style.display = 'block';
    dbOrdersTimes.doc(date.options[date.selectedIndex].text).get().then((querySnapshot) => {
        if (querySnapshot.exists) {
            if (querySnapshot.data().hours.length == 0) {
                var opt = document.createElement('option');
                opt.style.color = "black";
                opt.setAttribute('disabled', 'disabled');
                opt.innerHTML = "There is not available hours";
                hours.appendChild(opt);
            }
            else {
                for (let index = 0; index < querySnapshot.data().hours.length; ++index) {
                    var opt = document.createElement('option');
                    opt.style.color = "black";
                    opt.setAttribute('disabled', 'disabled');
                    opt.innerHTML = querySnapshot.data().hours[index];
                    hours.appendChild(opt);
                }
            }
        }
        loader.style.display = 'none';
    });
})

function addHour(hour, hoursList) {
    dbOrdersTimes.doc(hour).set({
        hours: hoursList
    })
        .then(() => {
            datesInit();
            resertChoice();
            loader.style.display = 'none';
            alert("Date saved");
            console.log("Document successfully written!");
        })
        .catch((error) => {
            loader.style.display = 'none';
            console.error("Error writing document: ", error);
        });
}

function resertChoice() {
    document.getElementById('selectedDate').value = "";
    var listOfHours = document.getElementsByClassName('form-check');
    for (var i = 0; i < listOfHours.length; i++) {
        listOfHours[i].querySelector('#hourCheckBok').checked = false;
    }
}

function checkDate(now, selected) {
    selected = new Date(selected);
    var Difference_In_Time = selected.getTime() - now.getTime();

    // To calculate the no. of days between two dates
    return Difference_In_Time / (1000 * 3600 * 24);
}
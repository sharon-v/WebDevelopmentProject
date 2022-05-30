import {dbOrdersTimes} from '../firebase/data.js';


const save_changes_btn = document.getElementById('saveChanges');

datesInit();

function datesInit()
{
    var date = document.getElementById('dateSelect');
    while(date.options.length > 1)
    {
        date.remove(0);
    }
    //Initialization of the unavailable dates
    dbOrdersTimes.get().then((querySnapshot) => {
        var counter = 0;
        querySnapshot.forEach((doc) => {
            if(Date.now() < new Date(doc.id).getTime()){ //
                counter = counter + 1;
                var opt = document.createElement('option');
                opt.style.color="black";
                opt.value = counter;
                opt.innerHTML = doc.id;
                date.appendChild(opt);
            }
        });
    });
}



save_changes_btn.addEventListener('click', () => {
    var listOfHours = document.getElementsByClassName('form-check');
    var unavailable = [];
    for(var i = 0; i < listOfHours.length; i++) {
        if(listOfHours[i].querySelector('#hourCheckBok').checked == false) {
            unavailable.push(listOfHours[i].querySelector('#hourString').textContent);
        }
    }
    const selectedDate = document.getElementById('selectedDate').value;
    if(selectedDate == "")
    {
        alert("Please choose date");
    }
    else
    {
        var now = new Date(); 
        if( checkDate(now, selectedDate) > 0)
        {
            addHour(selectedDate, unavailable);
        }
        else
        {
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
    dbOrdersTimes.doc(date.options[date.selectedIndex].text).get().then((querySnapshot) => {
        if(querySnapshot.exists)
        {
            for(let index = 0; index < querySnapshot.data().hours.length; ++index)
            {
                var opt = document.createElement('option');
                opt.style.color="black";
                opt.innerHTML = querySnapshot.data().hours[index];
                hours.appendChild(opt);
            }
        }
        
    });
})

function addHour(hour, hoursList)
{
    dbOrdersTimes.doc(hour).set({
        hours: hoursList
    })
    .then(() => {
        datesInit();
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}

function checkDate(now, selected)
{
    selected = new Date(selected);
    var Difference_In_Time = selected.getTime() - now.getTime();
  
    // To calculate the no. of days between two dates
    return Difference_In_Time / (1000 * 3600 * 24);
}
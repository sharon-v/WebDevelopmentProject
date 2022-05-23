import {dbOrdersTimes} from '../firebase/data.js';


const save_changes_btn = document.getElementById('saveChanges');

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
        console
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
  

function addHour(hour, hoursList)
{
    dbOrdersTimes.doc(hour).set({
        hours: hoursList
    })
    .then(() => {
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
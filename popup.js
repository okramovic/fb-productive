// find out if there is any tab that has fcb open
//alert('hi');


document.addEventListener('DOMContentLoaded', () => {
    alert('def url' + desiredURL);

    
});

document.addEventListener('change', newURLSelection)




function newURLSelection(){

  let sel = document.getElementById("redirectTo")
  //alert(sel.options[sel.selectedIndex].value);  // [selectedIndex]

  desiredURL = sel.options[sel.selectedIndex].value

  alert("des url: " + desiredURL);
}
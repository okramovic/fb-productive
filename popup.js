var onOffState = null, redirectTo = null;




document.addEventListener('DOMContentLoaded', () => {
    //alert('def url' + desiredURL);
    //alert('hi');


    // get state of main switcher
    chrome.runtime.sendMessage({onOffState: 1 }, function(response) {

                onOffState = response.state
                document.getElementById("onOff").checked = onOffState
    
    })

    // get initial redirect Choice
    chrome.runtime.sendMessage({redirectTo: 1 }, function(response) {

          //alert("response\n" + JSON.stringify(response));
          redirectTo = response.to
          let opts = document.getElementById("redirectTo").options
          //alert("redir to");
          //alert(opts);

          for (var i=0; i<opts.length; i++){
              if (opts[i].value === response.to) document.getElementById("redirectTo").selectedIndex = i;
          }

    })


    let sel = document.getElementById("redirectTo")
    //alert("hola " + sel)
    sel.addEventListener('change', newURLSelection);


    //
    //alert(switcher);

    document.getElementById("onOff").addEventListener('change', onSwitch)
});



function onSwitch(){
  
  let switcher = document.getElementById("onOff")


  //alert("? " + switcher.checked)
  chrome.runtime.sendMessage({onOff: switcher.checked.toString() }, function(response) {
  })
      
}



function newURLSelection(){

  let sel = document.getElementById("redirectTo")
  //alert(sel.options[sel.selectedIndex].value);  // [selectedIndex]

  desiredURL = sel.options[sel.selectedIndex].text

  //alert("des url: " + desiredURL);

  chrome.runtime.sendMessage({newChoice: desiredURL}, function(response) {
    //console.log(response.farewell);
  });

}


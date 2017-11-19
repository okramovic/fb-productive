var onOffState = null, redirectTo = null;




document.addEventListener('DOMContentLoaded', () => {
    //alert('hi');


    // set initial state of on-off switch
    chrome.runtime.sendMessage({onOffState: 1 }, function(response) {

                onOffState = response.state
                document.getElementById("onOff").checked = onOffState
    
    })

    // get initial redirect Choice
    chrome.runtime.sendMessage({redirectTo: 1 }, function(response) {

          //alert("response\n" + JSON.stringify(response));
          redirectTo = response.to
          let opts = document.getElementById("redirectTo").options

          for (var i=0; i<opts.length; i++){
                  if (opts[i].value === response.to) document.getElementById("redirectTo").selectedIndex = i;
          }

    })



    // handle redirect-to preference change
    let sel = document.getElementById("redirectTo")
    sel.addEventListener('change', newURLSelection);



    // handle on-off switching
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
                

                desiredURL = sel.options[sel.selectedIndex].text

                

                chrome.runtime.sendMessage({newChoice: desiredURL}, function(response) {});

}


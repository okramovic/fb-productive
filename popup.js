var onOffState = null, redirectTo = null, customURL = null;




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


    chrome.runtime.sendMessage({forCustomURL: 1 }, function(response) {

          customURL = response.customURL

          //alert("custom url  " + customURL)

          if (customURL === null || customURL === undefined) disableMyURLOption()
          else {

              enableMyURLOption()  
              document.getElementById('customURL').value = customURL
              updateMyURLOption(customURL)
          }

    })



    // handle redirect-to preference change
    let sel = document.getElementById("redirectTo")
    sel.addEventListener('change', newURLSelection);



    // handle on-off switching
    document.getElementById("onOff").addEventListener('change', onSwitch)
    

    document.getElementById("button").addEventListener('click', function(){

            let input = document.getElementById('customURL').value

            if (input.trim() === "") {

                    disableMyURLOption()
                    return

            } else {

                    enableMyURLOption()  
            }

            // save customURL to local storage
            chrome.runtime.sendMessage({newCustomURL: input }, function(response){})
                  //let sel = document.getElementById('redirectTo')

            updateMyURLOption(input)
            selectMyURL()
            
    })
    //alert(document.getElementById("submButton"))
});



function onSwitch(){
  
      let switcher = document.getElementById("onOff")


      //alert("? " + switcher.checked)
      chrome.runtime.sendMessage({onOff: switcher.checked.toString() }, function(response) {
      })
      
}

function newURLSelection(){

                let sel = document.getElementById("redirectTo")
                

                choice = sel.options[sel.selectedIndex].text

                chrome.runtime.sendMessage({newChoice: choice, customURL: customURL}, function(response) {});

}

function disableMyURLOption(){

    let opts = document.getElementById("redirectTo").options
  
    for (var i=0; i<opts.length; i++){
                    if (opts[i].text === "my URL") {

                      //document.getElementById("redirectTo").selectedIndex = i;
                      opts[i].disabled = true
                    }
    }

}
function enableMyURLOption(){
      // enable possibly disabled option
      let opts = document.getElementById("redirectTo").options
      
          for (var i=0; i<opts.length; i++){
                        if (opts[i].text === "my URL") {

                          //document.getElementById("redirectTo").selectedIndex = i;
                          opts[i].disabled = false

                        }
          }
}
function updateMyURLOption(newVal){
            let opts = document.getElementById("redirectTo").options
  
            for (var i=0; i<opts.length; i++){
              
                    if (opts[i].text === "my URL") {
                      
                      

                      
                      opts[i].value = newVal
                      //alert("newVal " + newVal)

                      //document.getElementById("redirectTo").selectedIndex = i;
                    }
            }

}

function selectMyURL(){

            let opts = document.getElementById("redirectTo").options
  
            for (var i=0; i<opts.length; i++){
              
                    if (opts[i].text === "my URL") {
                      
                      

                      
                      //opts[i].value = newVal
                      //alert("newVal " + newVal)

                      document.getElementById("redirectTo").selectedIndex = i;
                    }
            }
}

function formSubmit(ev){


    ev.preventDefault()

    

    let input = document.getElementById('customURL')//.value

    //console.log("user inp", input);

    alert("user inp\n" + input);

}
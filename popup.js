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

        // if its custom url choice
        if (  redirectTo !== "https://www.facebook.com/saved/?cref=28" &&
              redirectTo !== "https://www.facebook.com/messages/" &&
              redirectTo !== "https://www.facebook.com/events/" &&
              redirectTo !== "https://www.facebook.com/groups/"
            ){
              //alert('custom url\n' + opts + " <<" );
              for (var i=0; i < opts.length; i++){

                        opts[i].selected = false

                        if (i=== opts.length-1) document.getElementById("userOpt").selected = true;
              }
              /*opts.forEach(function(el){
                      alert("sel was " + el.selected)
                      el.selected = false
              });*/
              

        // all other choices
        } else {

          for (var i=0; i<opts.length; i++){
                  if (opts[i].value === redirectTo) 
                  document.getElementById("redirectTo").selectedIndex = i;
          }
        }
    })

    // get custom url from storage
    chrome.runtime.sendMessage({forCustomURL: 1 }, function(response) {

        let customURL = response.customURL

        //alert("custom url  " + customURL)

        if (customURL === null || customURL === undefined) {

              disableMyURLOption()
              updateMyURLOption(null)

        } else {

              // set input field
              document.getElementById('customURL').value = customURL

              enableMyURLOption()
              updateMyURLOption(customURL)
          }

    })



    // Select change
    let sel = document.getElementById("redirectTo")
    sel.addEventListener('change', newURLSelection);
                                   function newURLSelection(){
        
                        let sel = document.getElementById("redirectTo")
                        
        
                        choice = sel.options[sel.selectedIndex].text
        
                        //chrome.runtime.sendMessage({newChoice: choice, customURL: customURL}, function(response) {});
                        chrome.runtime.sendMessage({newChoice: choice, customURL: customURL}, function(response) {});
        
    }



    // handle on-off switching
    document.getElementById("onOff").addEventListener('change', onSwitch)
    


    // setting new custom url

    document.getElementById("button").addEventListener('click', function(){
                
            let input = document.getElementById('customURL').value

            if (input.trim() === "") {

                    disableMyURLOption()
                    chrome.runtime.sendMessage({newCustomURL: null }, function(response){})
                    //return
                    
                    selectFirstOpt()


            } else {
                    //alert("click: " + input)
                    chrome.runtime.sendMessage({newCustomURL: input }, function(response){})
                    enableMyURLOption()
                    updateMyURLOption(input, function(){
                        selectMyURL()
                    })
            }

            // to save customURL to local storage
            
                  //let sel = document.getElementById('redirectTo')

            
            
            
    })
    //alert(document.getElementById("submButton"))
});



function onSwitch(){
  
      let switcher = document.getElementById("onOff")


      //alert("? " + switcher.checked)
      chrome.runtime.sendMessage({onOff: switcher.checked.toString() }, function(response) {
      })
      
}



function disableMyURLOption(){

    //let opts = document.getElementById("redirectTo").options

    let el = document.getElementById("userOpt")
        el.disabled = true

    /*for (var i=0; i<opts.length; i++){
                    if (opts[i].text === "my URL") {

                      //document.getElementById("redirectTo").selectedIndex = i;
                      opts[i].disabled = true
                    }
        }*/

}
function enableMyURLOption(){
      // enable possibly disabled option

      let el = document.getElementById("userOpt")
      el.disabled = false

      //let opts = document.getElementById("redirectTo").options
                /*for (var i=0; i<opts.length; i++){
                        if (opts[i].text === "my URL") {

                          //document.getElementById("redirectTo").selectedIndex = i;
                          opts[i].disabled = false

                        }
                }*/
}
function updateMyURLOption(newVal,cb){
        let el = document.getElementById('userOpt')

        //el.innerHTML = newVal
        el.value = newVal
        if (cb) cb()
        //alert("newVal set to\n" + document.getElementById('userOpt').value)



        /*let opts = document.getElementById("redirectTo").options
  
                        for (var i=0; i<opts.length; i++){
                
                        if (opts[i].text === "my URL") {
                        
                        

                        
                        //opts[i].value = newVal



                        //alert("newVal " + newVal)

                        //document.getElementById("redirectTo").selectedIndex = i;
                        }
                        }*/

}

function selectMyURL(cb){
  
            /*  let opts = document.getElementById("redirectTo").options
                for (var i=0; i<opts.length; i++){
              
                    if (opts[i].text === "my URL") {
                      
                      //opts[i].value = newVal
                      //alert("newVal " + newVal)

                      document.getElementById("redirectTo").selectedIndex = i;
                    }
            }*/

                let opts = document.getElementById("redirectTo").options
                //alert("opts\n" + opts)
                // if its custom url choice
                /*if (  redirectTo !== "https://www.facebook.com/saved/?cref=28" &&
                redirectTo !== "https://www.facebook.com/messages/" &&
                redirectTo !== "https://www.facebook.com/events/" &&
                redirectTo !== "https://www.facebook.com/groups/"
                ){*/
                //alert('custom url\n' + opts + " <<" );
                for (var i=0; i < opts.length; i++){

                        opts[i].selected = false

                        if (i=== opts.length-1) 
                        document.getElementById("userOpt").selected = true;
                }
                
                chrome.runtime.sendMessage({newChoice: "my URL"}, function(response) {});
}

function selectFirstOpt(){
        let opts = document.getElementById("redirectTo").options
        for (var i=0; i < opts.length; i++){
                opts[i].selected = false
        }
        opts[0].selected = true;

        //let sel = document.getElementById("redirectTo")
        //choice = sel.options[sel.selectedIndex].text

        chrome.runtime.sendMessage({newChoice: opts[0].text });
}
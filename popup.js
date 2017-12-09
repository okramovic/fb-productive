
var adrToBlock = [
        "https://www.facebook.com/",
        "https://www.facebook.com", 
        "http://www.facebook.com/",
        "http://www.facebook.com",
        "https://www.facebook.com/?ref=tn_tnmn",
        "http://www.facebook.com/?ref=tn_tnmn"
      ]
var onOffState = null, redirectTo = null, customURL = null;

        


// get msg with initial settings
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

                setCustomURL(request.customURL)
                setSelect(request.to)
                setOnOff(request.on)

})




document.addEventListener('DOMContentLoaded', () => {

    chrome.runtime.sendMessage({initialize: 1}, function(response){
        
    })


    // Select el. change
    let sel = document.getElementById("redirectTo")
    sel.addEventListener('change', newURLSelection);
    function newURLSelection(){
        
                        let sel = document.getElementById("redirectTo")
                        
                        choice = sel.options[sel.selectedIndex].text
                        chrome.runtime.sendMessage({newChoice: choice, customURL: customURL});
        
    }



    // handle on-off switching - made invisible / disabled in this version 
    // document.getElementById("onOff").addEventListener('change', onSwitch)
    


    // setting new custom url
    document.getElementById("button").addEventListener('click', function(){
                
            let input = document.getElementById('customURL').value
            if (input) input = input.trim()

            // reset input to empty
            if (!input){//.trim() === "") {

                    disableMyURLOption()
                    chrome.runtime.sendMessage({newCustomURL: "empty" })
                    
                    selectFirstOpt()

            //  error displays when user enters fb homepage (one of its forms)
            } else if ( adrToBlock.some(function matchesInput(adr){ 
                        return adr === input.trim()})) {

                    displayError()

            // save customURL to local storage  
            } else {
                    
                    chrome.runtime.sendMessage({newCustomURL: input }, function(response){})
                    enableMyURLOption()
                    updateMyURLOption(input, function(){
                        selectMyURL()
                    })
            }
                        
    })
    


    // hovering over my URL label
    document.getElementById('customCont').addEventListener('mouseover', function(){

                document.getElementById('customDiv').style.display= 'flex'
    })
    document.getElementById('customCont').addEventListener('mouseout', function(){
        
                document.getElementById('customDiv').style.display= 'none'
    })
});


// in this version its disabled
/*function onSwitch(){
  
      let switcher = document.getElementById("onOff")

      chrome.runtime.sendMessage({onOff: switcher.checked.toString() })
      
}*/
function disableMyURLOption(){

    let el = document.getElementById("userOpt")
        el.disabled = true

}
function enableMyURLOption(){
      // enable possibly disabled option

      let el = document.getElementById("userOpt")
      el.disabled = false

}
function updateMyURLOption(newVal,cb){
        let el = document.getElementById('userOpt')

        el.value = newVal
        if (cb) cb()
}
function selectMyURL(cb){
                // make sure first all others are un-selected
                let opts = document.getElementById("redirectTo").options
                
                for (var i=0; i < opts.length; i++){

                        opts[i].selected = false

                        if (i === opts.length-1) 
                        document.getElementById("userOpt").selected = true;
                }
                
                chrome.runtime.sendMessage({newChoice: "my URL"}, function(response) {});
}
function selectFirstOpt(){
        let opts = document.getElementById("redirectTo").options
        for (var i=1; i < opts.length; i++){
                opts[i].selected = false
        }
        opts[0].selected = true;

        chrome.runtime.sendMessage({newChoice: opts[0].text });
}



//  set select
function setSelect(value){
        redirectTo = value
        let opts = document.getElementById("redirectTo").options

        // if its custom url choice
        if (  redirectTo !== "https://www.facebook.com/saved/?cref=28" &&
                redirectTo !== "https://www.facebook.com/messages/" &&
                redirectTo !== "https://www.facebook.com/events/" &&
                redirectTo !== "https://www.facebook.com/groups/"
                ){

                for (var i=0; i < opts.length; i++){

                        opts[i].selected = false

                        if (i=== opts.length-1) document.getElementById("userOpt").selected = true;
                }

        // for all other choices
        } else {

                for (var i=0; i<opts.length; i++){
                        if (opts[i].value === redirectTo) 
                        document.getElementById("redirectTo").selectedIndex = i;
                }
        }       
}

// init custom url
function setCustomURL(url) {
        window.customURL = url

        let customURL = url

        if (customURL === null || customURL === undefined) {

              disableMyURLOption()
              updateMyURLOption(null)

        } else {

              // set textarea input field to contain user's URL
              document.getElementById('customURL').value = customURL

              enableMyURLOption()
              updateMyURLOption(customURL)
          }

}

// set onOff
function setOnOff(val){

        onOffState = val
        document.getElementById("onOff").checked = val
}

// this 'fires' when user enters on of banned URLs
function displayError(previous){
        let node = document.createElement('h3')
        node.setAttribute('style', 'margin: 10px; '+
                          'text-align:center; color:#3b5998;' + 
                          'line-height: 135% ;')

        node.id = "errorMsg"
        node.innerHTML = 'this is FB homepage address' +
                         ', change to another one please'
        document.body.appendChild(node)

        setTimeout(function(){
                let el = document.getElementById('errorMsg')
                el.parentNode.removeChild(el)

                if (window.customURL)
                     document.getElementById('customURL').value = window.customURL

                else document.getElementById('customURL').value = ""

                //window.close()
        },5000)
}
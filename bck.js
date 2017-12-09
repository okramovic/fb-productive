
/**
            to do:
            

            done:
            - when turned on, it checks all open tabs and redirects them
            - store user settings to some storage for next time
            - user can set 1 custom address

            don't do
            - on select change - line 108 - take all tabs w any fb and and change to desiredURL
*/

const adrToBlock = [
                    "https://www.facebook.com/",
                    "https://www.facebook.com", 
                    "http://www.facebook.com/",
                    "http://www.facebook.com",
                    "https://www.facebook.com/?ref=tn_tnmn",
                    "http://www.facebook.com/?ref=tn_tnmn"
                  ]

var desiredURL = "https://www.facebook.com/saved/?cref=28", //// "https://www.facebook.com/groups/" //"https://www.facebook.com/events/"
redirect = true,
customURL = null,
initialSettings = {'on': redirect, 'to': desiredURL, 'customURL': customURL };


//chrome.storage.local.clear(function(){alert("all cleared")})
//loadStorage(queryTabs)



chrome.runtime.onStartup.addListener(function(){

        console.log("extension Start")
        loadStorage(queryTabs)
})

chrome.runtime.onInstalled.addListener(function(){

        console.log("extension Installed")
        loadStorage(queryTabs)
})


// does the actual tab redirection
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    //console.log(" - -  on updated - - ")

    // in this version redirect is always true
    if (redirect){
        if ( adrToBlock.some(matchesTabURL)  ){
                        
                        let updateProps = { url: window.desiredURL }
                        chrome.tabs.update(tab.id, updateProps)
        }

    }

    function matchesTabURL(adr){
      return adr === tab.url 
    }
})

// listeners for user settings change requests from popup.js
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    
    // sends out the initial settings
    if (request.initialize){

        chrome.storage.local.get(['on', 'to', 'customURL'], function(vals){
                console.log("init vals\n",JSON.stringify( vals))
                
                chrome.runtime.sendMessage(vals)
                //sendResponse({resp: vals});
        })
    }

    
    // if Select element changed via popup.html
    if (request.newChoice){
        
                switch(request.newChoice){
                  case "saved items": desiredURL = "https://www.facebook.com/saved/?cref=28"; break;
                  case "messages":    desiredURL = "https://www.facebook.com/messages/"; break;
                  case "events":      desiredURL = "https://www.facebook.com/events/"; break;
                  case "groups":      desiredURL = "https://www.facebook.com/groups/"; break;
                  case "my URL":      desiredURL = customURL ; break;
        
                }
                chrome.storage.local.set({'to': desiredURL})
                console.log("new choice:", request.newChoice)
    }
    
    // setting new custom URL
    if (request.newCustomURL){
                let url = request.newCustomURL
                
                if (url === "empty"){
                    chrome.storage.local.set({'customURL': null })
                    customURL = null
                    console.log("setting storage customURL >>", customURL)
                    return
                }
        
                customURL = url.toString()
                console.log("setting storage customURL >>", customURL)
        
                chrome.storage.local.set({'customURL': customURL })
    }
    
    
    // send redirection status to popup.js
    /*if (request.onOffState){
          sendResponse({state: redirect});

    }*/

    // get initial address to redirect to & display in Select pop-up menu
    /*if (request.redirectTo){
          sendResponse({to: desiredURL});

    }*/

    /*if (request.forCustomURL){
          setTimeout(function(){
            sendResponse({customURL: customURL});
            console.log(">> customURL was sent", customURL)
          },500)
          
    }*/

    // on-off switching from popup - disabled/invisible in this version, so always equals true
    /*if (request.onOff){
        if (request.onOff == "true") redirect = true
        else redirect = false


        chrome.storage.local.set({'on': redirect})

        updateIcon();

    }*/
 
});





// this looks for tabs that have one of forms of fb homepage us it's url
function queryTabs(){

        chrome.tabs.query({}, function(tabs){

            
            let tabUrl;  

            tabs.forEach(tab => {

                  tabUrl = tab.url
                  
                  // if reflects on / off state - but in this version choice is disabled / invisible so always true
                  if (redirect === true){
                      let updateProps = { url: window.desiredURL }

                      if ( adrToBlock.some(matchesTabURL)  ){
                                    
                                    chrome.tabs.update(tab.id, updateProps);
                      }  
                  }
            });


            function matchesTabURL(adr){
                          return adr === tabUrl 
            }
        });
}


// load user's saved preferences (and sends it to popup.js)
function loadStorage(cb){


  chrome.storage.local.get(['on'], function(items){

    // checks if local storage has anything in it
    var counter = 0
    for (var props in items){
        counter ++
    }

    if (counter === 0) {

      console.log('--> storage is empty');
      chrome.storage.local.set(initialSettings)
      loadStorage(queryTabs);

    } else {
            chrome.storage.local.get(['on', 'to', 'customURL'], function(vals){
                          
                          console.log("storage vals\n", JSON.stringify(vals));
                          redirect = vals.on;
                          desiredURL = vals.to;
                          customURL = vals.customURL
                          
                          //updateIcon()

                          if (cb) cb()
            })

      
    }
  })
}

// icon change is now disabled / invisible - so redirect is always === true
function updateIcon(){

      if (redirect === false) {
          //chrome.browserAction.setIcon( {path: "./icon_32_off.png"}, function(){ 
                  // console.log('set to off')  
          //})

      } else if (redirect === true) {

          chrome.browserAction.setIcon( {path: "./icon_32_on.png"}, function callback(){
                 // console.log('set to ON')
          })

          queryTabs();
      }
}
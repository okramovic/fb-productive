const adrToBlock = [
                    "https://www.facebook.com/",
                    "https://www.facebook.com", 
                    "http://www.facebook.com/",
                    "http://www.facebook.com",
                    "https://www.facebook.com/?ref=tn_tnmn",
                    "http://www.facebook.com/?ref=tn_tnmn"
],
defaultURL = "https://www.facebook.com/saved/?cref=28"


let desiredURL = "https://www.facebook.com/saved/?cref=28",
redirect = true,
customURL = null,
initialSettings = {'on': redirect, 'to': desiredURL, 'customURL': customURL };


//chrome.storage.local.clear(function(){ console.log("all cleared")})

chrome.runtime.onInstalled.addListener(()=>{

          console.log("extension Installed")
          loadStorage(redirectTabs)
})

chrome.runtime.onStartup.addListener(()=>{

          console.log("extension Start")
          loadStorage(redirectTabs)
})



// does the actual tab redirection
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
    //console.log(" - -  tab update - - ")

    // in this version redirect is always true
     if (redirect){
        if ( adrToBlock.some(matchesTabURL)  )  

               chrome.storage.local.get('to', vals =>

                         chrome.tabs.update(tab.id, { url: vals.to || defaultURL })
               )
       
     }

     function matchesTabURL(adr){
          return adr === tab.url 
     }
})

// listeners for user settings change requests from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    
    // sends out the initial settings
    if (request.initialize)

          chrome.storage.local.get(['on', 'to', 'customURL'], vals =>
                    
                         chrome.runtime.sendMessage( vals )
          )
    

    
    // if Select element changed via popup
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
function redirectTabs(){

     chrome.tabs.query({}, tabs=>{
          console.log('redirecting tabs')

          let tabUrl;

          tabs.forEach(tab => {

               tabUrl = tab.url
                  
               // in this version choice is disabled / invisible = always true
               if (redirect){
                    if ( adrToBlock.some(matchesTabURL) ) chrome.tabs.update(tab.id, { url: desiredURL || defaultURL} )
               }
          })


          function matchesTabURL(adr){
                         return adr === tabUrl 
          }
     })
}


// load user's saved preferences (and send it to popup.js)
function loadStorage(cb){
     //console.log('loading storage')

     chrome.storage.local.get(['on'], items =>{

          // checks if local storage has anything in it
          let counter = 0
          for (let props in items) counter ++


          if (counter === 0) {

                    // initialize settings data in local storage
                    console.log('--> no stored settings');
                    chrome.storage.local.set(initialSettings,()=> loadStorage(redirectTabs))
               

          } else chrome.storage.local.get(['on','to','customURL'], vals =>{
                                   
                    console.log("stored vals:\n", vals)
                    redirect = vals.on
                    desiredURL = vals.to
                    customURL = vals.customURL

                    if (cb) cb()

          })
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

          redirectTabs();
      }
}
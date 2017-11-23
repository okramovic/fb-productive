/*
  bck pages
  https://developer.chrome.com/extensions/background_pages

      changing ext icon
      https://stackoverflow.com/questions/16921685/change-the-chrome-extension-icon
      https://developer.chrome.com/extensions/browserAction#method-setIcon

  tabs
  https://developer.chrome.com/extensions/tabs

  loading page detection
  https://stackoverflow.com/questions/6497548/chrome-extension-make-it-run-every-page-load

*/

/**
            to do:
            - user can set 1 custom address
            

            done:
            - when turned on, it checks all open tabs and redirects them
            - store user settings to some storage for next time

            not to do
            - on select change - line 108 - take all tabs w any fb and and change to desiredURL?
 * 
 */

var adrToBlock = [
                    "https://www.facebook.com/", "https://www.facebook.com", 
                    "http://www.facebook.com/", "http://www.facebook.com",
                    "https://www.facebook.com/?ref=tn_tnmn"
                  ],
tabsToChange = [],
desiredURL = "https://www.facebook.com/saved/?cref=28", //"https://www.facebook.com/groups/" //"https://www.facebook.com/events/"
redirect = true,
customURL = null,

//storageExists = false,
initialSettings = {'on': redirect, 'to': desiredURL, 'customURL': customURL };


//chrome.storage.local.clear(function(){alert("all cleared")})
loadStorage()

//chrome.storage.local.set({'on': redirect, 'to': desiredURL}, function() {
  //alert("setting");
//})

//  check all tabs when Ext is turned on - 
queryTabs();


chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    
    //alert("new tab load");
    if (redirect){
        if ( adrToBlock.some(matchesTabURL)  ){
          
                        //alert("fb homepage open");
                        //tabsToChange.push(tab.id)
                        let updateProps = { url: window.desiredURL }
                        chrome.tabs.update(tab.id, updateProps)//, function(){});
        }

    }

    function matchesTabURL(adr){
      return adr === tab.url 
    }
})

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    /*alert("now >> " + request.newChoice);
      /*console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");*/
    //
      //console.log("request",request)

    // send redirection status to popup.js
    if (request.onOffState){
          sendResponse({state: redirect});
          //return
    }

    // get initial address to redirect to & display in Select pop-up menu
    if (request.redirectTo){
          sendResponse({to: desiredURL});
          //return
    }

    if (request.forCustomURL){
          console.log("customURL to send", customURL)
          sendResponse({customURL: customURL});
    }

    // on-off switching from popup
    if (request.onOff){
        if (request.onOff == "true") redirect = true
        else redirect = false


        chrome.storage.local.set({'on': redirect})

        updateIcon();

        //return
    }

    // if desiredURL changed via popup.html
    if (request.newChoice){
        //let oldChoice = desiredURL

        switch(request.newChoice){
          case "saved items": desiredURL = "https://www.facebook.com/saved/?cref=28"; break;
          case "messages":    desiredURL = "https://www.facebook.com/messages/"; break;
          case "events":      desiredURL = "https://www.facebook.com/events/"; break;
          case "groups":      desiredURL = "https://www.facebook.com/groups/"; break;
          case "my URL":      desiredURL = request.customURL ; break;
          //default: window.desiredURL = "";
        }

        chrome.storage.local.set({'to': desiredURL})
        

    }
    
    if (request.newCustomURL){
        let url = request.newCustomURL
        

        desiredURL = "my URL"
        customURL = url.toString()
        //console.log("new user input", customURL)
        chrome.storage.local.set({'to': desiredURL, 'customURL': customURL })

        //loadStorage()


        chrome.storage.local.get(null, function(items){
          //console.log(items )
        }) 
    }
});






function queryTabs(){
        //var cons = document.getElementById("console");
          //let p = document.createElement('p')
          //alert(cons);

          //alert("query tabs");
          
          //alert(desiredURL);
          //p.innerHTML = desiredURL;
          //cons.appendChild(p);


        chrome.tabs.query({}, function(tabs){

            //var ul = document.getElementById('tabList');
            let tabUrl;  

            tabs.forEach(tab => {

                  tabUrl = tab.url
                  
                  if (redirect === true){
                      let updateProps = { url: window.desiredURL }

                      if ( adrToBlock.some(matchesTabURL)  ){
                                    //alert("fb page open");
                                    chrome.tabs.update(tab.id, updateProps);
                      }  
                  }

            });


            function matchesTabURL(adr){
                          return adr === tabUrl 
            }
        });
}



function loadStorage(){


  chrome.storage.local.get(['on'], function(items){

    //alert("loading storage\n" + "\n"+JSON.stringify(items));
    console.log("storage items " + JSON.stringify(items));

    var cnt = 0

    for (var props in items){
        cnt ++
    }


    if (items === {} || cnt === 0) {

      console.log('--> empty storage');

      //chrome.storage.local.set({'storageSet': true})
      chrome.storage.local.set(initialSettings)
      loadStorage();

    } else {
            chrome.storage.local.get(['on', 'to', 'customURL'], function(vals){
                          //alert("sukces " +JSON.stringify(vals));
                          console.log(vals);
                          redirect = vals.on;
                          desiredURL = vals.to;
                          customURL = vals.customURL
                          //console.log("redirect", redirect," to", desiredURL, "\ncustom", customURL)
                          updateIcon()

            })

      
    }
  })
}

function updateIcon(){

      if (redirect === false) {
          chrome.browserAction.setIcon( {path: "./icon_32_off.png"}, function(){ 
                  // console.log('set to off')  
          })}

      else if (redirect === true) {

          chrome.browserAction.setIcon( {path: "./icon_32_on.png"}, function callback(){
                 // console.log('set to ON')
            
          })

          queryTabs();
      }
}


function xhrTest(){
/**
 *  https://stackoverflow.com/questions/25107774/how-do-i-send-an-http-get-request-in-chrome-extension
 */
var xttp = new XMLHttpRequest();
xttp.open('GET', 'https://www.mocky.io/v2/5a1544362e0000a50feab5e1', true);
xttp.onreadystatechange = function (resp){
        console.log('xttp resp', resp);
        console.log('xttp this', this.responseText);
}
xttp.send();


}
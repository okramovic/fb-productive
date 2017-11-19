/*
  bck pages
  https://developer.chrome.com/extensions/background_pages

      changing ext icon
      https://stackoverflow.com/questions/16921685/change-the-chrome-extension-icon

  tabs
  https://developer.chrome.com/extensions/tabs

  loading page detection
  https://stackoverflow.com/questions/6497548/chrome-extension-make-it-run-every-page-load

*/

/**
            to do:
            on select change - line 108 - take all tabs w any fb and and change to desiredURL?

            done:
            - when turned on, it checks all open tabs and redirects them
 * 
 */

var adrToBlock = [
                    "https://www.facebook.com/", "https://www.facebook.com", 
                    "http://www.facebook.com/", "http://www.facebook.com"
                  ],
tabsToChange = [],
desiredURL = "https://www.facebook.com/saved/?cref=28", //"https://www.facebook.com/groups/" //"https://www.facebook.com/events/"
redirect = true;




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
      //alert("request\n" + JSON.stringify(request));

    //


    // send redirection status to popup.js
    if (request.onOffState){
          sendResponse({state: redirect});
          return
    }

    // get initial address to redirect to & display in Select pop-up menu
    if (request.redirectTo){
          sendResponse({to: desiredURL});
          return
    }

    // handling on-off switching from popup
    if (request.onOff){
        if (request.onOff == "true") redirect = true
        else redirect = false

        if (redirect===false)       chrome.browserAction.setIcon( {path: "icon_sm_off.png"}, function callback(){})
        else if (redirect === true) {
          
                chrome.browserAction.setIcon( {path: "icon_sm.png"},     function callback(){})
      
                queryTabs();
        }

        return
    }

    // if desiredURL changed via popup.html
    if (request.newChoice){
        switch(request.newChoice){
          case "saved items": window.desiredURL = "https://www.facebook.com/saved/?cref=28"; break;
          case "messages":    window.desiredURL = "https://www.facebook.com/messages/"; break;
          case "events":      window.desiredURL = "https://www.facebook.com/events/"; break;
          case "groups":      window.desiredURL = "https://www.facebook.com/groups/"; break;
          case "other":       window.desiredURL = "" ; break;
          //default: window.desiredURL = "";
        }

        // take all tabs w fb open and change to desiredURL?

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

                  let updateProps = { url: window.desiredURL }
                  

                  if ( adrToBlock.some(matchesTabURL)  ){
                                //alert("fb page open");
                                chrome.tabs.update(tab.id, updateProps);
                  }  

            });


            function matchesTabURL(adr){
                          return adr === tabUrl 
            }
        });
}



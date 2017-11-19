/*
  bck pages
  https://developer.chrome.com/extensions/background_pages

  tabs
  https://developer.chrome.com/extensions/tabs

  loading page detection

  https://stackoverflow.com/questions/6497548/chrome-extension-make-it-run-every-page-load

*/

var adsToBlock = [
                    "https://www.facebook.com/", "https://www.facebook.com", 
                    "http://www.facebook.com/", "http://www.facebook.com"

                  ],
tabsToChange = [],
desiredURL = "https://www.facebook.com/saved/?cref=28"; 
            //"https://www.facebook.com/events/"
            



// check all tabs when Ext is turned on
queryTabs();


chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    
    //alert("new tab load");
    
    let updateProps = {
                          url: desiredURL 
                      }

    if ( adsToBlock.some(matchesTabURL)  ){
      
                    //alert("fb homepage open");
                    //tabsToChange.push(tab.id)
      
                    chrome.tabs.update(tab.id, updateProps, function(){});
    }



    function matchesTabURL(adr){
      return adr === tab.url 
    }
})



function queryTabs(){
  //var cons = document.getElementById("console");
  //let p = document.createElement('p')
  //alert(cons);

  //alert("running bck");
  
  //alert(desiredURL);
  //p.innerHTML = desiredURL;
  //cons.appendChild(p);


  chrome.tabs.query({}, function(tabs){

      //alert(adsToFilter)

      //var ul = document.getElementById('tabList');
      

      tabs.forEach(tab => {

        //let li = document.createElement("li");
        //let content = JSON.stringify(tab.url + "    " + tab.id + "   <<<<");
        //li.innerHTML = content;
        //ul.appendChild(li);

        window.tabUrl = tab.url

        //if (url === "https://www.facebook.com/") alert("bad url  " + url)

        let updateProps = {
                url: desiredURL //"https://www.w3schools.com/colors/colors_picker.asp"
            }
        

        if ( adsToFilter.some(matchesTabURL)  ){
              
                      chrome.tabs.update(tab.id, updateProps, function(){});
                      //tabsToChange.push(tab.id)
        }
        

      });
      function matchesTabURL(adr){
        return adr === window.tabUrl 
      }
  });
}



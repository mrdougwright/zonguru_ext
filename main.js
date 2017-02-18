document.addEventListener("DOMContentLoaded", function() {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getItems"}, function(resp) {
      resp.map(item => {
        var li = document.createElement('li');
        li.innerHTML = `
          <div class='dtc pr4'>${item.asin}</div>
          <div class='dtc pl3 pr3'>${item.rating}</div>
          <div class='dtc pl4'>${item.num_ratings}</div>
        `;
        li.className = "pv3 ba b--dotted"
        document.getElementById('zongitems').appendChild(li)
      })
    })
  })

});

document.addEventListener("DOMContentLoaded", function() {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getItems"}, function(resp) {
      resp.map(item => {
        var li = document.createElement('li');
        li.innerHTML = `
          <div class='dtc pr4'>${item.asin}</div>
          <div class='dtc pr4'>${item.product_name}</div>
          <div class='dtc pr4'>${item.brand}</div>
          <div class='dtc pr4'>${item.price}</div>
          <div class='dtc pr4'>${item.category}</div>
          <div class='dtc pr4'>${item.rank}</div>
          <div class='dtc pr4'>${item.rating}</div>
          <div class='dtc pr4'>${item.review_count}</div>
        `;
        li.className = "pv3 ba b--dotted"
        document.getElementById('zongitems').appendChild(li)
      })
    })
  })

});

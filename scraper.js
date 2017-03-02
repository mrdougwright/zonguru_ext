const items = document.getElementById('s-results-list-atf').getElementsByTagName('li')
const asins = Array.from(items).map(getAsinNumber)

function getAsinNumber(domNode) {
  return domNode.dataset.asin
}

function getItemData(asins) {
  let url = "https://localhost:3000/api/v1/items?"
  const params = asins.map(asin => {
    return `asins[]=${asin}&`
  }).join('')

  fetch((url + params), {
    method: 'GET',
    mode: 'cors',
    // headers: new Headers({ 'Content-Type': 'json' }),
    cache: 'default'
  }).then(resp => resp.json())
    .then(data => {
      // debugger
      return data
    }).catch(err => {
      console.log('error!')
      console.log(err)
    })
}

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch(message.type) {
      case "getItems":
        // sendResponse(items_data);
        getItemData(asins)
        break;
      default:
        console.error("Unrecognised message: ", message);
    }
  }
);

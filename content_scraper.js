let data
let items = document.querySelectorAll('[data-asin]')
let url = "https://localhost:3000/api/v1/items?"
let asins = Array.from(items).map(node => node.dataset.asin)
let review_hash = makeScrapedReviewHash(asins)
let params = asins.map(asin => `asins[]=${asin}&`).join('')


function handleErrors(response) {
  if (!response.ok)
    throw Error(response.statusText)
  return response
}

function makeScrapedReviewHash(asins) {
  let reviewHash = {}
  asins.map(asin => {
    let upc = JSON.stringify(asin)
    let spans = document.querySelectorAll(`[name=${upc}]`)
    if (spans.length > 0) {
      var x = spans[0]
      var rating = x.getElementsByClassName('a-icon-star')
      if (rating.length <= 0) {
        rating = x.getElementsByTagName('i')
      }
      reviewHash[upc] = {}
      reviewHash[upc].rating = rating[0].innerText.match(/[^\s]+/)[0]
      reviewHash[upc].review_count = x.parentElement.children[1].innerText
    }
  })
  return reviewHash
}

fetch((url + params), {
  method: 'GET',
  mode: 'cors',
  headers: new Headers({ 'Content-Type': 'json' }),
  cache: 'default'
}).then(handleErrors)
  .then(resp => {
    console.log('handling json response')
    return resp.json()
  })
  .then(dater => {
    console.log('got data!')
    data = dater.map(item => {
      if (review_hash[item.asin]) {
        item.rating = review_hash[item.asin].rating
        item.review_count = review_hash[item.asin].review_count
      }
      return item
    })
    return
  })
  .catch(err => {
    console.log('error!')
    console.log(err)
  })


chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch(message.type) {
      case "getItems":
        sendResponse(data)
        break;
      default:
        console.error("Unrecognised message: ", message);
    }
  }
);

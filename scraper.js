let data
let page_scraping = true
const items = document.getElementById('s-results-list-atf').getElementsByTagName('li')
let url = "https://localhost:3000/api/v1/items?"
const asins = Array.from(items).map(getAsinNumber)
let review_hash = makeScrapedReviewHash(asins)
const params = asins.map(asin => `asins[]=${asin}&`).join('')

function getAsinNumber(domNode) {
  return domNode.dataset.asin
}

function handleErrors(response) {
  if (!response.ok)
    throw Error(response.statusText)
  return response
}

function makeScrapedReviewHash(asins) {
  let reviewHash = {}
  asins.map(asin => {
    let spans = document.querySelectorAll(`[name=${asin}]`)
    if (spans.length > 0) {
      var x = spans[0]
      var rating = x.getElementsByClassName('a-icon-star')
      if (rating.length <= 0) {
        rating = x.getElementsByTagName('i')
      }
      reviewHash[asin] = {}
      reviewHash[asin].rating = rating[0].innerText.match(/[^\s]+/)[0]
      reviewHash[asin].review_count = x.parentElement.children[1].innerText
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

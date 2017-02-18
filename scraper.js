const items = document.getElementById('s-results-list-atf').children

const items_data = Array.from(items).map(i => {
  const rating = i.querySelector('.a-icon-star') && i.querySelector('.a-icon-star').innerText.split(' ')[0]
  const ratings = i.querySelector(`[name]`).parentElement.querySelector('.a-link-normal').innerText

  return {
    asin: i.dataset.asin,
    rating: rating,
    num_ratings: ratings
  }
})


chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch(message.type) {
      case "getItems":
        sendResponse(items_data);
        break;
      default:
        console.error("Unrecognised message: ", message);
    }
  }
);

;(function() {

  var currentPage
  var spinnerOpts = {lines: 15, length: 15, width: 5, radius: 25, scale: 1, corners: 1, color: '#000', opacity: 0.25, rotate: 0, direction: 1, speed: 1.2, trail: 49, fps: 20}


  function scrapeAndGetData() {
    let items = Array.from(document.getElementById('main').querySelectorAll('[data-asin]'))

    // let url = "https://localhost:3000/api/v1/items?"
    let url = "https://zonguruapi.herokuapp.com/api/v1/items?"
    let asins = items.map(node => node.dataset.asin)
    let review_hash = makeScrapedReviewHash(asins)
    let params = asins.map(asin => `asins[]=${asin}&`).join('')
    let ul = document.getElementById('zongitems')
    new Spinner(spinnerOpts).spin(ul)

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
      .then(data => {
        console.log('got data, adding review info...')
        return data.map(item => {
          if (review_hash[item.asin]) {
            item.rating = review_hash[item.asin].rating
            item.review_count = review_hash[item.asin].review_count
          }
          return item
        })
      })
      .then(data => {
        console.log('mapping over data...')
        ul.innerHTML = ''

        data.map(item => {
          var li = document.createElement('li');
          li.innerHTML = `
            <div class='dib pa1 mr2'>${item.asin}</div>
            <a class='item-link' href='${item.item_url}' target='_blank'>
              <div class='item-img pa2 bg-white br2 shadow-2'><img src='${item.image_url}' /></div>
              <div class='dib pa1 w-40'>${item.product_name}</div>
            </a>
            <div class='dib pa1 w4 center'>${item.brand}</div>
            <div class='dib pa1 w3 center'>${item.price}</div>
            <div class='dib pa1 w4 center'>${item.category}</div>
            <div class='dib pa1 w3 center'>${item.rank}</div>
            <div class='dib pa1 w3 center'>${item.rating}</div>
            <div class='dib pa1 center'>${item.review_count}</div>
          `;
          li.className = "list bg-white checkered ph2 pv3 ba b--dotted"
          ul.appendChild(li)
        })
      }).catch(err => {
        console.log('error!')
        console.log(err)
      })
  }


  function createHeader() {
    let header = document.createElement('div')
    header.className = "list pa2 mh3 mt4 fixed bg-gray w-100"

    let div0 = document.createElement('div')
    div0.className = "fw8 pl2 dib mr5"
    div0.textContent = "ASIN"
    let div1 = document.createElement('div')
    div1.className = "fw8 pl1 dib w-40"
    div1.textContent = "Product Name"
    let div2 = document.createElement('div')
    div2.className = "fw8 pl1 dib mr5"
    div2.textContent = "Brand"
    let div3 = document.createElement('div')
    div3.className = "fw8 pl1 dib w3"
    div3.textContent = "Price"
    let div4 = document.createElement('div')
    div4.className = "fw8 pl1 dib w4"
    div4.textContent = "Category"
    let div5 = document.createElement('div')
    div5.className = "fw8 pl1 dib w3"
    div5.textContent = "Rank"
    let div6 = document.createElement('div')
    div6.className = "fw8 pl1 dib w3"
    div6.textContent = "Rating"
    let div7 = document.createElement('div')
    div7.className = "fw8 pl1 dib w4"
    div7.textContent = "Review Count"

    header.appendChild(div0)
    header.appendChild(div1)
    header.appendChild(div2)
    header.appendChild(div3)
    header.appendChild(div4)
    header.appendChild(div5)
    header.appendChild(div6)
    header.appendChild(div7)

    return header
  }

  let tab = document.createElement('div')
  tab.className = "pt2 ph2 w-100 fixed bottom-0"
  tab.style = "z-index: 5000;"
  let tab_left  = document.createElement('div')
  let tab_right = document.createElement('div')
  tab_left.className = "fl w-80 pa2"
  tab_right.className = "fl w-20 pa2 zgred white b bl bt br bw2 b--dark-gray"
  tab_right.innerText = "ZONGURU"
  tab.appendChild(tab_left)
  tab.appendChild(tab_right)

  let product_list = document.createElement('div')
  product_list.className = "white pr3 pb3 center h-50"

  let header = createHeader()
  product_list.appendChild(header)

  let ul = document.createElement('ul')
  ul.id = "zongitems"
  ul.className = "black pt5"

  product_list.appendChild(ul)

  let h3 = document.createElement('h3')
  h3.innerText = "Zonguru"
  h3.className = "pa2 mh3 fixed w-100 bg-dark-gray"

  let main = document.createElement('div')

  main.className = "zmain hide white fixed right-0 bottom-0 center bl bt h-50"
	document.body.appendChild(tab);
  tab.appendChild(main)
  main.appendChild(h3)
  main.appendChild(product_list)

  new Spinner(spinnerOpts).spin(ul)


  tab.addEventListener('click', function() {
    let classes = Array.from(main.classList)
    if (classes.includes('hide')) {
      main.className = main.className.replace('hide', 'show')
    } else if (classes.includes('show')) {
      main.className = main.className.replace('show', 'hide')
    } else {
      main.className += ' hide'
    }
  })


  document.addEventListener("DOMNodeInserted", function () {
    if (currentPage !== window.location.href) {
      currentPage = window.location.href;
      setTimeout(function() {
        scrapeAndGetData()
      }, 2000)
    }
  }, false)

})()

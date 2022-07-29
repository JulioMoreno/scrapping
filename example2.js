const puppeteer = require('puppeteer');
const CREDS = require('./creds');

async function run() {
  const browser = await puppeteer.launch({
            headless: false
  });

  const page = await browser.newPage();
  
  await page.goto('https://tusitio.com');


const LIST_DESTINATION_SELECTOR =  '#__next > div.main-content-container > div > div.home > div.results-container.scroll-fixed > div.card-grid > div:nth-child(INDEX) > a > div.card-body > h2';
const LIST_PRICE_SELECTOR = '#__next > div.main-content-container > div > div.home > div.results-container.scroll-fixed > div.card-grid > div:nth-child(INDEX) > a > div.card-header > div > p';
const LENGTH_SELECTOR_CLASS = 'card-container';
const LINK_SELECTOR = '#__next > div.main-content-container > div > div.home > div.results-container.scroll-fixed > div.card-grid > div:nth-child(INDEX) > a';


let listLength = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length;
  }, LENGTH_SELECTOR_CLASS);
console.log(listLength)
let offers = [];

for (let i = 1; i <= listLength; i++) {
    // change the index to the next child
    let locationSelector = LIST_DESTINATION_SELECTOR.replace("INDEX", i);
    let priceSelector = LIST_PRICE_SELECTOR.replace("INDEX", i);
    let linkSelector = LINK_SELECTOR.replace("INDEX", i);

    let location = await page.evaluate((sel) => {
        let element = document.querySelector(sel);
        return element? document.querySelector(sel).innerHTML: null;
      }, locationSelector);

    let link = await page.evaluate((sel) => {
        let element = document.querySelector(sel);
        return element? document.querySelector(sel).href: null;
    },linkSelector)

    let price = await page.evaluate((sel) => {
        let element = document.querySelector(sel);
        return element? element.innerHTML: null;
      }, priceSelector);

    // not all users have emails visible
    if (!price)
      continue;


    offers.push({
        location,
        price,
        link
    });
    console.log(location, ' -> ', price);

    console.log('Offers:', offers);
    // TODO save this user
}

 // await page.screenshot({ path: 'screenshots/github.png' });
 browser.close();
}

run();
const puppeteer = require('puppeteer');
const CREDS = require('./creds');

async function run() {
    const USERNAME_SELECTOR = '#login_field';
    const PASSWORD_SELECTOR = '#password';
    const BUTTON_SELECTOR = '#login > div.auth-form-body.mt-3 > form > div > input.btn.btn-primary.btn-block.js-sign-in-button';

  const browser = await puppeteer.launch({
            headless: false
  });

  const page = await browser.newPage();
  
  await page.goto('https://github.com/login');
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(CREDS.username);
 
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(CREDS.password);
  await page.click(BUTTON_SELECTOR);

  const SEARCH_URL = 'https://github.com/search?q=JHON&type=users'

  

  await page.waitForNavigation();

  await page.goto(SEARCH_URL);


const LIST_USERNAME_SELECTOR =  '#user_search_results > div.Box.border-0 > div:nth-child(INDEX) > div.flex-auto > div:nth-child(1) > div.f4.text-normal > a.color-fg-muted';
const LIST_EMAIL_SELECTOR = '#user_search_results > div.Box.border-0 > div:nth-child(INDEX) > div.flex-auto > div.d-flex.flex-wrap.text-small.color-fg-muted > div:nth-child(2) > a';
const LENGTH_SELECTOR_CLASS = 'd-flex hx_hit-user px-0 Box-row';


let listLength = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length;
  }, LENGTH_SELECTOR_CLASS);
console.log(listLength)

for (let i = 1; i <= listLength; i++) {
    // change the index to the next child
    let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i);
    let emailSelector = LIST_EMAIL_SELECTOR.replace("INDEX", i);

    let username = await page.evaluate((sel) => {
        return document.querySelector(sel).innerHTML;
      }, usernameSelector);

    let email = await page.evaluate((sel) => {
        let element = document.querySelector(sel);
        return element? element.innerHTML: null;
      }, emailSelector);

    // not all users have emails visible
    if (!email)
      continue;

    console.log(username, ' -> ', email);

    // TODO save this user
}

 // await page.screenshot({ path: 'screenshots/github.png' });
    browser.close();
}

run();
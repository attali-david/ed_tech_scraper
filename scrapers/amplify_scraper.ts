import puppeteer = require('./puppeteer');

async function getAmplifyJobs(search: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://amplify.wd1.myworkdayjobs.com/Amplify_Careers');

  // Type into search box. Input's ID is dynamically generated, so target it's container.
  const inputSelector = '.css-3lf2mu input';
  await page.waitForSelector(inputSelector);
  await page.type(inputSelector, `${search}`, { delay: 100 });
  await page.click('button[data-automation-id="keywordSearchButton"]');
  await page.waitForResponse((response) => response.status() === 200);

  // Wait for the results page to load and display the results.
  const resultsSelector = '.css-19uc56f';
  await page.waitForSelector(resultsSelector);

  // Extract the results from the page.
  const jobs = await page.evaluate((resultsSelector) => {
    return [...document.querySelectorAll(resultsSelector)]
      .map((anchor) => {
        const title = anchor.textContent.trim();
        return { title, url: anchor.href };
      })
      .filter((el) => el);
  }, resultsSelector);

  console.log(jobs);

  await browser.close();
}

getAmplifyJobs('engineer');

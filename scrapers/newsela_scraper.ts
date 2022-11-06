/* eslint @typescript-eslint/no-var-requires: "off" */
const puppeteer = require('puppeteer');

async function getNewselaJobs(search) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://boards.greenhouse.io/newsela');

  // Wait for the results page to load and display the results.
  const resultsSelector = '.opening a';
  await page.waitForSelector(resultsSelector);

  // Extract the results from the page.
  const jobs = await page.evaluate((resultsSelector) => {
    return [...document.querySelectorAll(resultsSelector)]
      .map((anchor) => {
        if (anchor.textContent.trim().toLowerCase()) {
          const title = anchor.textContent.trim();
          return { title, url: anchor.href };
        }
        return;
      })
      .filter((el) => el);
  }, resultsSelector);

  await browser.close();
  return jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()),
  );
}

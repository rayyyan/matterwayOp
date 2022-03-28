import puppeteer from "puppeteer"

/**
 * @function initBrowser
 * @description lunch a browser
 * @param url page url
 * @param headless boolean
 * @returns page or never
 * @returns {Promise<puppeteer.Page | never>}
 */

export const initBrowser = async (
  url: string,
  headless: boolean
): Promise<puppeteer.Page | never> => {
  try {
    const browser = await puppeteer.launch({ headless: headless })
    const page = await browser.newPage()
    await page.goto(url, {
      timeout: 0,
      waitUntil: "networkidle2",
    })
    return page
  } catch (err) {
    throw new Error("Can't init the browser")
  }
}

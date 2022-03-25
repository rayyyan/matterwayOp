import puppeteer from "puppeteer"

export const initBrowser = async (
  url: string,
  headless: boolean
): Promise<puppeteer.Page> => {
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

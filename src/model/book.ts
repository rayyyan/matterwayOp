import { initBrowser } from "../utils/browser"
import { randomBook } from "../utils/randomBook"
const AMAZON = `https://www.amazon.com/`

export interface IBook {
  getRandomBook(): Promise<string>
  checkout(book: string): void
}
export default class Book implements IBook {
  constructor(private url: string) {}
  async getRandomBook(): Promise<string> {
    try {
      const page = await initBrowser(this.url, true)
      const books = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".pollAnswer__bookLink")
        ).map((el) => el.getElementsByTagName("img")[0].alt)
      })

      return randomBook(books)
    } catch (err) {
      throw new Error("Can't get random book")
    }
  }
  async checkout(book: string) {
    const page = await initBrowser(AMAZON, false)
    await page.waitForSelector("#twotabsearchtextbox")
    await page.type("#twotabsearchtextbox", book)
    await page.keyboard.press("Enter")
    await page.waitForXPath(
      `//span[@class="a-size-medium a-color-base a-text-normal"]`
    )
    const product = await page.$x(
      `//span[@class="a-size-medium a-color-base a-text-normal"]`
    )
    await product[0].click()
    await page.waitForSelector(".a-button-input")
    await page.click(".a-button-input")
    await page.waitForSelector(".a-button-input")
    await page.click(".a-button-input")
  }
}

import puppeteer from "puppeteer"
import { initBrowser } from "../utils/browser"
import { randomBook } from "../utils/randomBook"
const AMAZON = "https://www.amazon.com"

export interface IBook {
  getRandomBook(): Promise<string | never>
  checkout(book: string): void
}
interface IArray {
  name: string
  url: string | null
}

//Is Valid checkout
type IIsValidCheckout = IArray | undefined | never
function arrayIncludes(arr: IArray[], str: string): boolean {
  return arr.map((el) => el.name).includes(str)
}
async function isValidCheckout(
  options: IIsValidCheckout[],
  page: puppeteer.Page
): Promise<void> {
  let error: { message: string | null } = { message: null }

  // console.log(options)
  for (let foundElement of options) {
    console.log(foundElement)
    //looping options
    if (typeof foundElement?.url === "string") {
      await page.goto(foundElement?.url, {
        timeout: 0,
        waitUntil: "networkidle2",
      })
    }
    const notAvailable = await page.evaluate(() => {
      return (
        document.querySelector(".a-color-price.a-text-bold")?.textContent ===
        "Currently unavailable."
      )
    })
    const seeAllBuyingOptions = await page.evaluate(async () => {
      const seeALl = document.querySelector(
        "a.a-button-text"
      ) as HTMLAnchorElement
      if (seeALl?.textContent?.trim() === "See All Buying Options") {
        seeALl.click()
      }
    })
    const isNotAvailable = notAvailable
      ? (error.message = "This book is not available")
      : null
    const deliveryBlock = await page.evaluate(() => {
      return (
        !!document.querySelector("#deliveryBlockMessage") &&
        document.querySelector("#deliveryBlockMessage .a-color-error")
          ?.textContent ===
          "Your selected delivery location is beyond seller's shipping coverage for this item. Please choose a different delivery location or purchase from another seller."
      )
    })
    const isDeliveryBlock = deliveryBlock
      ? (error.message =
          "delivery location is beyond seller's shipping coverage")
      : null

    if (error.message === null) {
      break
    }
    console.log(error.message)
  }
}
function bookCheck(bookOptions: IArray[]): (IArray | undefined)[] | never {
  let options = []
  let foundElement: IArray | undefined
  if (!arrayIncludes(bookOptions, "Paperback")) {
    if (!arrayIncludes(bookOptions, "Hardcover")) {
      throw new Error("This book has no buying options")
    }
  }
  if (arrayIncludes(bookOptions, "Paperback")) {
    foundElement = bookOptions.find((el) => el.name === "Paperback")
    options.push(foundElement)
  }
  if (arrayIncludes(bookOptions, "Hardcover")) {
    foundElement = bookOptions.find((el) => el.name === "Hardcover")
    options.push(foundElement)
  }
  return options
}
export default class Book implements IBook {
  constructor(private url: string) {}
  async getRandomBook(): Promise<string | never> {
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
  async searchBook(book: string): Promise<puppeteer.Page> {
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

    // Currently unavailable
    // await page.goto(
    //   "https://www.amazon.com/Metropolitan-Underground-Rolling-Wight-Number/dp/B01N6PKN9V",
    //   {
    //     timeout: 0,
    //     waitUntil: "networkidle2",
    //   }
    // )

    // See All Buying Options
    await page.goto(
      "https://www.amazon.com/Thomas-Guide-California-Road-Atlas/dp/B00A2NICZ0/",
      {
        timeout: 0,
        waitUntil: "networkidle2",
      }
    )
    //Only hardcover
    // await page.goto(
    //   "https://www.amazon.com/Piranesi-Unbound-Carolyn-Yerkes/dp/0691206104/ref=sr_1_1?keywords=Piranesi+Unbound+Hardcover&qid=1648365547&sr=8-1",
    //   {
    //     timeout: 0,
    //     waitUntil: "networkidle2",
    //   }
    // )

    // No buying options
    // await page.goto(
    //   "https://www.amazon.com/Bear-Creek-Brides-Historical-Western/dp/B08YCV41MF/ref=sr_1_2?crid=9GRUHK7FCVQF&keywords=audiobook&qid=1648369579&sprefix=audio+book%2Caps%2C406&sr=8-2",
    //   {
    //     timeout: 0,
    //     waitUntil: "networkidle2",
    //   }
    // )
    return page
  }
  async bookStatus(book: string): Promise<puppeteer.Page> {
    const page = await this.searchBook(book)

    await page.waitForSelector("li.swatchElement")
    const bookOptions = await page.evaluate((AMAZON) => {
      return Array.from(
        document.querySelectorAll(
          ".swatchElement .a-list-item .a-button .a-button-inner .a-button-text"
        )
      ).map((el) => ({
        name: el.firstElementChild!.textContent?.trim(),
        url: el.getAttribute("href")?.includes("javascript:void(0)")
          ? null
          : AMAZON + el.getAttribute("href"),
      })) as IArray[]
    }, AMAZON)

    //check Book options
    const options = bookCheck(bookOptions)
    //handleBook checking
    await isValidCheckout(options, page)

    return page
  }
  async checkout(book: string): Promise<void> {
    // const page =
    await this.bookStatus(book)
    // await page.waitForSelector(".a-button-input")
    // await page.click(".a-button-input")
    // await page.waitForSelector(".a-button-input")
    // await page.click(".a-button-input")
  }
}

import puppeteer from "puppeteer"
import { initBrowser } from "../utils/browser"
import { randomBook } from "../utils/randomBook"
import { ErrorLogs, Modal } from "../utils/errorTemplates"
import { AllConst } from "../utils/constants"
//amazon
const AMAZON = AllConst.AMAZON

export interface IBook {
  getRandomBook(): Promise<string | never>
  checkout(book: string): void
}
interface IArray {
  name: string
  url: string | null
}
/*BOOK UTIL */
enum Exceptions {
  NOT_AVAILABLE = "https://www.amazon.com/Metropolitan-Underground-Rolling-Wight-Number/dp/B01N6PKN9V",
  SEE_BUYING_OPTIONS = "https://www.amazon.com/Thomas-Guide-California-Road-Atlas/dp/B00A2NICZ0/",
  HARDCOVER_ONLY = "https://www.amazon.com/Piranesi-Unbound-Carolyn-Yerkes/dp/0691206104/ref=sr_1_1?keywords=Piranesi+Unbound+Hardcover&qid=1648365547&sr=8-1",
  LOCATION = "https://www.amazon.com/Hobbit-Lord-Rings-Boxed-Set/dp/0008376107/ref=sr_1_8?crid=3H0NAGF7853CM&keywords=J.R.R.+Tolkien+4-Book+Boxed+Set%3A+The+Hobbit+and+The+Lord+of+the+Rings&qid=1648284550&sprefix=j.r.r.+tolkien+4-book+boxed+set+the+hobbit+and+the+lord+of+the+rings%2Caps%2C217&sr=8-8",
  NO_BUYING_OPTIONS = "https://www.amazon.com/Bear-Creek-Brides-Historical-Western/dp/B08YCV41MF/ref=sr_1_2?crid=9GRUHK7FCVQF&keywords=audiobook&qid=1648369579&sprefix=audio+book%2Caps%2C406&sr=8-2",
}
async function surf(url: string, page: puppeteer.Page): Promise<void | never> {
  try {
    await page.goto(url, {
      timeout: 0,
      waitUntil: "networkidle2",
    })
  } catch (error) {
    throw new Error("can not surf")
  }
}

//Is Valid checkout
type IIsValidCheckout = IArray | undefined | never
function arrayIncludes(arr: IArray[], str: string): boolean {
  return arr.map((el) => el.name).includes(str)
}
export type TError = { message: string | null; isSeeOPtion: boolean }
let error: TError = { message: null, isSeeOPtion: false }
async function isValidCheckout(
  options: IIsValidCheckout[],
  page: puppeteer.Page
): Promise<TError | never> {
  try {
    // console.log(options)
    for (let foundElement of options) {
      // console.log(foundElement)
      //looping options
      if (typeof foundElement?.url === "string") {
        await page.goto(foundElement?.url, {
          timeout: 0,
          waitUntil: "networkidle2",
        })
      }
      //check if not Available
      const notAvailable = await page.evaluate(() => {
        return (
          document.querySelector(".a-color-price.a-text-bold")?.textContent ===
          "Currently unavailable."
        )
      })
      if (notAvailable) {
        error.message = ErrorLogs.NOT_AVAILABLE
      }
      //check Delivery
      const deliveryBlock = await page.evaluate(() => {
        return (
          !!document.querySelector("#deliveryBlockMessage") &&
          document
            .querySelector("#deliveryBlockMessage .a-color-error")
            ?.textContent?.includes("delivery")
        )
      })
      if (deliveryBlock) {
        error.message = ErrorLogs.DELIVERY_BLOCK
      }
      //check if page has see Option modal
      let DBlock = false
      const seeAllBuyingOptions = await page.evaluate(
        async (DBlock: boolean) => {
          const seeALl = document.querySelector(
            "body a.a-button-text"
          ) as HTMLAnchorElement
          if (seeALl?.textContent?.trim() === "See All Buying Options") {
            seeALl.click()
            function waitFor(delay: number) {
              return new Promise((resolve) => setTimeout(resolve, delay))
            }

            await waitFor(1200)
            DBlock = document
              .querySelector("#mir-layout-DELIVERY_BLOCK .a-color-error")
              ?.textContent?.includes("delivery")!
          }
          console.log("outside block", DBlock)
          return DBlock
        },
        DBlock
      )

      if (seeAllBuyingOptions) {
        error.isSeeOPtion = true
        error.message = ErrorLogs.DELIVERY_BLOCK
      }

      if (error.message === null) {
        break
      }
    }

    return error
  } catch (error) {
    throw new Error("is not Valid Checkout")
  }
}
function bookCheck(
  bookOptions: IArray[],
  page: puppeteer.Page
): (IArray | undefined)[] | never {
  let options = []
  let foundElement: IArray | undefined
  if (
    !arrayIncludes(bookOptions, "Paperback") &&
    !arrayIncludes(bookOptions, "Hardcover")
  ) {
    Modal.showModal(ErrorLogs.NO_BUYING_OPTIONS, page)
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

//Book Class
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
  async searchBook(book: string): Promise<puppeteer.Page | never> {
    try {
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

      return page
    } catch (error) {
      throw new Error("Can't search book")
    }
  }
  async bookStatus(book: string): Promise<puppeteer.Page | never> {
    try {
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
      const options = bookCheck(bookOptions, page)
      //handleBook checking
      const readyForCheckout = await isValidCheckout(options, page)
      await this.proceedToCheckout(readyForCheckout, page)
      return page
    } catch (error) {
      throw new Error("Can't get book status")
    }
  }
  async checkout(book: string): Promise<void | never> {
    // const page =
    try {
      await this.bookStatus(book)
    } catch (error) {
      throw new Error("Can't checkout")
    }
  }
  async proceedToCheckout(
    options: TError,
    page: puppeteer.Page
  ): Promise<void | never> {
    try {
      if (options?.isSeeOPtion === true && options?.message === null) {
        console.log("yes it has a see all options")
      } else if (options?.isSeeOPtion === false && options?.message === null) {
        console.log("this page is normal checkout")
        await page.waitForSelector(
          ".a-button-input[title='Add to Shopping Cart']"
        )
        await page.click("#add-to-cart-button")
        await page.waitForSelector("[name=proceedToRetailCheckout]")
        await page.click("[name=proceedToRetailCheckout]")
      } else {
        Modal.showModal(options.message!, page)
      }
    } catch (error) {
      throw new Error("Can't proceed to checkout")
    }
  }
}

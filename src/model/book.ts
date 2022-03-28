import puppeteer from "puppeteer"
import { initBrowser } from "../utils/browser"
import { randomBook } from "../utils/randomBook"
import { Modal } from "../utils/errorTemplates"
import { AllConst } from "../utils/constants"
import { isValidCheckout, bookCheck } from "../utils/bookUtils"
//Types
import { TError } from "../types/types"
import { IArray } from "../types/interfaces"

//amazon
const AMAZON = AllConst.AMAZON
/**
 * @class Book
 * @description handle book checkout
 * @method getRandomBook @returns { Promise<string | never>}
 * @method searchBook @returns {  Promise<puppeteer.Page | never>}
 * @method bookStatus @returns {  Promise<puppeteer.Page | never>}
 * @method checkout @returns {  Promise<void | never>}
 * @method proceedToCheckout @param options: TError,
     @param page: puppeteer.Page @returns {  Promise<void | never>}
 */
export interface IBook {
  getRandomBook(): Promise<string | never>
  checkout(book: string): void
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

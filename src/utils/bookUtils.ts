import { Page } from "puppeteer"
import { ErrorLogs, Modal } from "../utils/errorTemplates"
import { IIsValidCheckout, TError } from "../types/types"
import { IArray } from "../types/interfaces"

//surf
/**
 * @function surf
 * @param url  url
 * @param page  Puppeteer page
 * @returns {Promise<void | never>} if it includes the element
 */
export async function surf(url: string, page: Page): Promise<any | never> {
  try {
    return await page.goto(url, {
      timeout: 0,
      waitUntil: "networkidle2",
    })
  } catch (error) {
    throw new Error("can not surf")
  }
}
//Is Valid checkout

/**
 * @function arrayIncludes
 * @param arr Array of elements
 * @returns {boolean} if it includes the element
 */
export function arrayIncludes(arr: IArray[], str: string): boolean {
  return arr.map((el) => el.name).includes(str)
}

let error: TError = { message: null, isSeeOPtion: false }

/**
 * @function arrayIncludes
 * @param options Array of interface
 * @param page  Puppeteer page
 * @returns {Promise<TError | never>} if it includes the element
 */
export async function isValidCheckout(
  options: IIsValidCheckout[],
  page: Page
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
/**
 * @function arrayIncludes
 * @param bookOptions of interface
 * @param page  Puppeteer page
 * @returns {(IArray | undefined)[] | never} if it includes the element
 */
export function bookCheck(
  bookOptions: IArray[],
  page: Page
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

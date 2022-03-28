import { initBrowser } from "../utils/browser"
import { AllConst } from "../utils/constants"

/**
 * @class Genre
 * @description get Genres
 * @method getGenres
 * @method @returns { Promise<TGenre[]| never>}
 */

export interface TGenre {
  title: string
  slug: string
}
interface IGenre {
  getGenres(): Promise<TGenre[]>
}

//Genre class
export default class Genre implements IGenre {
  async getGenres(): Promise<TGenre[] | never> {
    try {
      const page = await initBrowser(AllConst.GOOD_READS, true)
      const genres = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".category.clearFix > a")
        ).map((el) => ({
          slug: el.getAttribute("href"),
          title: el.childNodes[0].textContent?.trim(),
        }))
      })

      return genres as TGenre[]
    } catch (error) {
      throw new Error("Can't get genres")
    }
  }
}

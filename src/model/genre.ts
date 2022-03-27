const GOOD_READS = `https://www.goodreads.com/choiceawards/best-books-2020`
import puppeteer, { Browser } from "puppeteer"
import { initBrowser } from "../utils/browser"
export interface TGenre {
  title: string
  slug: string
}
//Genre class
interface IGenre {
  getGenres(): Promise<TGenre[]>
}

export default class Genre implements IGenre {
  async getGenres(): Promise<TGenre[]> {
    const page = await initBrowser(GOOD_READS, true)
    const genres = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".category.clearFix > a")
      ).map((el) => ({
        slug: el.getAttribute("href"),
        title: el.childNodes[0].textContent?.trim(),
      }))
    })

    return genres as TGenre[]
  }
}

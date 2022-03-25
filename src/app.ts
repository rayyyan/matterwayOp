const GOOD_READS = `https://www.goodreads.com/choiceawards/best-books-2020`
const AMAZON = `https://www.amazon.com/`

import inquirer from "inquirer"
import puppeteer, { Browser } from "puppeteer"
//
//Genre class
interface IGenre {
  getGenres(): Promise<any[]>
}
class Genre implements IGenre {
  async getGenres(): Promise<any[]> {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto(GOOD_READS, {
      timeout: 0,
      waitUntil: "networkidle2",
    })
    const genres = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".category.clearFix > a")
      ).map((el) => ({
        slug: el.getAttribute("href"),
        title: el.childNodes[0].textContent?.trim(),
      }))
    })
    const allGenres: any[] = genres.map((el) => ({
      slug: el.slug!,
      title: el.title!,
    }))
    return allGenres
  }
}
const app = async () => {
  console.log("app started")
  const genres = new Genre()
  const genresWithSlug = await genres.getGenres()

  console.log(genresWithSlug)
  throw new Error("everything works fine")
}

app().catch((err) => console.log(err))

const GOOD_READS = `https://www.goodreads.com/choiceawards/best-books-2020`
const AMAZON = `https://www.amazon.com/`

import inquirer from "inquirer"
import puppeteer, { Browser } from "puppeteer"

/*Utils*/
interface TGenre {
  title: string
  slug: string
}
// user Choices
async function getUserChoice(name: string, message: string, choices: string[]) {
  return await inquirer.prompt([
    {
      name: name,
      type: "list",
      message: message,
      choices: choices,
    },
  ])
}
//Genre class
interface IGenre {
  getGenres(): Promise<TGenre[]>
}
class Genre implements IGenre {
  async getGenres(): Promise<TGenre[]> {
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
    const allGenres: TGenre[] = genres.map((el) => ({
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

  //strip slugs from Genres[]
  const genresWithoutSlug = genresWithSlug.map((el: TGenre) => el.title)
  //Get user genre choice
  const genresChoice = await getUserChoice(
    "genre",
    "Choose a Genre",
    genresWithoutSlug
  )
  const userChoice = genresChoice.genre
  const userChoiceWithSlug = genresWithSlug.filter(
    (url) => url.title === userChoice
  )
  console.log(userChoiceWithSlug)

  // throw new Error("everything works fine")
}

app().catch((err) => console.log(err))

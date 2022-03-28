import Genre, { TGenre } from "./model/genre"
import Book from "./model/book"
import getUserChoice from "./utils/input"
import { AllConst } from "./utils/constants"

const app = async (): Promise<void> => {
  //Genre
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

  //Book
  const book = new Book(AllConst.GOOD_BASE + userChoiceWithSlug[0].slug)
  const getRandomBook = await book.getRandomBook()
  await book.checkout(getRandomBook)
}

app().catch((err) => console.log(err))

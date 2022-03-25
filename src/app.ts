import Genre, { TGenre } from "./model/genre"
import Book from "./model/book"
import getUserChoice from "./utils/input"
const GOOD_BASE = `https://www.goodreads.com`

/*Utils*/
const app = async () => {
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
  const book = new Book(GOOD_BASE + userChoiceWithSlug[0].slug)
  const getRandomBook = await book.getRandomBook()
  const checkout = await book.checkout(getRandomBook)
}

app().catch((err) => console.log(err))

export const randomBook = (myArray: string[]): string => {
  return myArray[Math.floor(Math.random() * myArray.length)]
}

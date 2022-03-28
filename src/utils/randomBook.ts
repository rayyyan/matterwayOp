/**
 * @function randomBook
 * @param myArray Array of strings
 * @returns {string} Random element from array
 */
export const randomBook = (myArray: string[]): string => {
  return myArray[Math.floor(Math.random() * myArray.length)]
}

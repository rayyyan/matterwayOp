import inquirer from "inquirer"

/**
 * @function getUserChoice
 * @description lunch a cli prompt
 * @param name prompt name
 * @param message prompt message
 * @param choices array of choices
 * @returns page or never
 * @returns {Promise<{genre:string} | never>}
 */

// user Choices
export default async function getUserChoice(
  name: string,
  message: string,
  choices: string[]
): Promise<{ genre: string } | never> {
  try {
    return await inquirer.prompt([
      {
        name: name,
        type: "list",
        message: message,
        choices: choices,
      },
    ])
  } catch (error) {
    throw new Error("Can't get user choice")
  }
}

import inquirer from "inquirer"

// user Choices
export default async function getUserChoice(
  name: string,
  message: string,
  choices: string[]
) {
  return await inquirer.prompt([
    {
      name: name,
      type: "list",
      message: message,
      choices: choices,
    },
  ])
}

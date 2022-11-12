import chalk from "chalk";

export const error = (...args: any[]) => console.log(chalk.bold.red(args))
export const success = (...args: any[]) => console.log(chalk.green(args))
export const pending = (...args: any[]) => console.log(chalk.cyan(args))

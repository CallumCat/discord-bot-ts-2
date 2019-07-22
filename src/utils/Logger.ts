import moment from "moment";
import Chalk from "chalk";

export class Logger {
    static log(m: string, type?: LoggerType): void {
        if (!type) {
            console.log(`${Chalk.gray(`[${moment().format("MMMM Do @ HH:mm:ss")}]`)} ${m}`);
        } else if (type === "success") {
            console.log(`${Chalk.greenBright(`[${moment().format("MMMM Do @ HH:mm:ss")}]`)} ${m}`);
        } else if (type === "error") {
            console.log(`${Chalk.redBright(`[${moment().format("MMMM Do @ HH:mm:ss")}]`)} ${m}`);
        } else if (type === "warn") {
            console.log(`${Chalk.yellowBright(`[${moment().format("MMMM Do @ HH:mm:ss")}]`)} ${m}`);
        }
    }
}

export type LoggerType = "success"|"error"|"warn";
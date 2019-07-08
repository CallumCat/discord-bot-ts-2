import {MessageBuilder} from "./msg/MessageBuilder";
import {Logger} from "./Logger";

export class ErrorHandler {
    static returnErrorMessage(e: Error): string {
        if (e.name === "BotError") {
            return MessageBuilder.buildErr(e.message);
        } else {
            if (e.name === "MongoError") {
                return MessageBuilder.buildErr(`Database cannot be reached.`);
            } else {
                Logger.log(`✖ Uncaught error: ${e.stack}.`, "error");
                return MessageBuilder.buildErr(`Uncaught error: \`${e.message}\``);
            }
        }
    }
}

export class BotError extends Error {
    constructor(m: string) {
        super();
        this.name = "BotError";
        this.message = m;
    }
}
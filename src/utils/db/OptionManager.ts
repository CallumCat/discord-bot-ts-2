import {DefaultObjectCreator} from "../DefaultObjectCreator";
import {BotError} from "../ErrorHandler";
import {GlobalVars} from "../../global";
import {IOptions} from "../../interfaces/IOptions";
import {config} from "../../config/config";

export class OptionManager {
    static async get(): Promise<IOptions> {
        const o = await GlobalVars.db.collection(config.db.optionsCollection).findOne({});
        if (!o) {
            throw new BotError("No options object present.");
        }
        return o;
    }
    static async create() {
        await GlobalVars.db.collection(config.db.optionsCollection).insertOne(DefaultObjectCreator.createOptionsObject());
    }
}
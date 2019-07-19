import {DefaultObjectCreator} from "../DefaultObjectCreator";
import {IDataUtil} from "../../interfaces/IData";
import {BotError} from "../ErrorHandler";
import {Snowflake} from "discord.js";
import {IUser} from "../../interfaces/IUser";
import {GlobalVars} from "../../global";
import {config} from "../../config/config";

export class UserManager implements IDataUtil {
    async get(id: Snowflake, returnNull?: boolean): Promise<IUser> {
        const u = await GlobalVars.db.collection(config.db.userCollection).findOne({ id: id });
        if (!u) {
            if (returnNull) {
                return null;
            }
            throw new BotError("User doesn't exist in the database.");
        }
        return u;
    }
    async create(id: Snowflake): Promise<IUser> {
        const u = await GlobalVars.db.collection(config.db.userCollection).findOne({ id: id });
        if (u) {
            throw new BotError("User already exists in the database.");
        }
        const defaultUserObject = DefaultObjectCreator.createUserObject(config.botOwnerId);
        await GlobalVars.db.collection(config.db.userCollection).insertOne(defaultUserObject);
        return defaultUserObject;
    }
    async getOrCreate(id: Snowflake): Promise<IUser> {
        const u = await this.get(id, true);
        if (!u) {
            return await this.create(id);
        } else {
            return u;
        }
    }
    async delete(id: Snowflake): Promise<void> {
        const u = await this.get(id);
        await GlobalVars.db.collection(config.db.userCollection).deleteOne({ id: u.id });
    }
}

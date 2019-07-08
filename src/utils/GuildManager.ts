import {IDataUtil} from "../interfaces/IData";
import {Snowflake} from "discord.js";
import {GlobalVars} from "../global";
import {config} from "../config/config";
import {BotError} from "./ErrorHandler";
import {DefaultObjectCreator} from "./DefaultObjectCreator";
import {IGuild} from "../interfaces/IGuild";

export class GuildManager implements IDataUtil {
    async get(id: Snowflake, returnNull?: boolean): Promise<IGuild> {
        const g = await GlobalVars.db.collection(config.db.guildCollection).findOne({ id: id });
        if (!g) {
            if (returnNull) {
                return null;
            }
            throw new BotError("Guild doesn't exist in the database.");
        }
        return g;
    }
    async create(id: Snowflake, admin?: boolean): Promise<IGuild> {
        const g = await GlobalVars.db.collection(config.db.guildCollection).findOne({ id: id });
        if (g) {
            throw new BotError("Guild already exists in the database.");
        }
        const defaultGuildObject = DefaultObjectCreator.createGuildObject(id);
        await GlobalVars.db.collection(config.db.guildCollection).insertOne(defaultGuildObject);
        return defaultGuildObject;
    }
    async getOrCreate(id: Snowflake): Promise<IGuild> {
        const g = await this.get(id, true);
        if (!g) {
            return await this.create(id);
        } else {
            return g;
        }
    }
    async delete(id: Snowflake): Promise<void> {
        const u = await this.get(id);
        await GlobalVars.db.collection(config.db.guildCollection).deleteOne({ id: u.id });
    }
}

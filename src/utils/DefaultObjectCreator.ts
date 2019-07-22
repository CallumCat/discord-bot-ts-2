import {IUser} from "../interfaces/IUser";
import {Snowflake} from "discord.js";
import  moment from "moment";
import {IOptions} from "../interfaces/IOptions";
import {IGuild} from "../interfaces/IGuild";
import {config} from "../config/config";
import {IShardStatus} from "../interfaces/IShardStatus";

export class DefaultObjectCreator {
    static createUserObject(id: Snowflake): IUser {
        return {
            id: id,
            admin: false,
            blacklist: {
                enabled: false,
                reason: null,
                created: null
            },
            commandsUsed: 0,
            created: moment().format()
        };
    }
    static createGuildObject(id: Snowflake): IGuild {
        return {
            id: id,
            commandsUsed: 0,
            prefix: config.defaultPrefix,
            created: moment().format()
        };
    }
    static createOptionsObject(): IOptions {
        return {
            commandsEnabled: true
        }
    }
    static createShardStatus(id: number): IShardStatus {
        return {
            id: id,
            status: "NOT SET",
            lastUpdate: moment().format()
        };
    }
}
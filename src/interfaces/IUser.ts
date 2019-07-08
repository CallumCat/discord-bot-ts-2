import {Snowflake} from "discord.js";
import {IData} from "./IData";

export interface IUser extends IData {
    id: Snowflake;
    admin: boolean;
    blacklist: {
        enabled: boolean;
        reason: string;
        created: string;
    }
    commandsUsed: number;
}
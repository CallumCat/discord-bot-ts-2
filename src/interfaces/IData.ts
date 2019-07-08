import {Snowflake} from "discord.js";
import {IUser} from "./IUser";
import {IGuild} from "./IGuild";

export interface IData {
    id: Snowflake;
    created: string;
}

export interface IDataUtil {
    get(id: Snowflake, returnNull?: boolean): Promise<IUser|IGuild>;
    create(id: Snowflake): Promise<IUser|IGuild>;
    getOrCreate(id: Snowflake): Promise<IUser|IGuild>;
    delete(id: Snowflake): Promise<void>;
}

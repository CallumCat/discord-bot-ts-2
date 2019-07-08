import {IUser} from "./IUser";
import {IGuild} from "./IGuild";
import {Message} from "discord.js";

export interface ICommandPayload {
    user: IUser;
    guild: IGuild;
    args: string[];
    splitMessage: string[];
    msg: Message;
    commandName: string;
}
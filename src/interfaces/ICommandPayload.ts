import {IUser} from "./IUser";
import {IGuild} from "./IGuild";
import {Message} from "discord.js";
import {IOptions} from "./IOptions";

export interface ICommandPayload {
    user: IUser;
    guild: IGuild;
    options: IOptions;
    args: string[];
    splitMessage: string[];
    msg: Message;
    commandName: string;
}
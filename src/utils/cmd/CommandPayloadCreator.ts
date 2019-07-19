import {Message} from "discord.js";
import {GuildManager} from "../db/GuildManager";
import {UserManager} from "../db/UserManager";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {OptionManager} from "../db/OptionManager";
import {IGuild} from "../../interfaces/IGuild";
import {IUser} from "../../interfaces/IUser";
import {IOptions} from "../../interfaces/IOptions";

export class CommandPayloadCreator {
    static async create(m: Message): Promise<ICommandPayload> {
        const splitMessage = m.content.split(" ");
        const promises: [IGuild, IUser, IOptions] = [await new GuildManager().getOrCreate(m.guild.id), await new UserManager().getOrCreate(m.author.id), await OptionManager.get()];
        const promiseResults = await Promise.all(promises);
        return {
            guild: promiseResults[0],
            user: promiseResults[1],
            options: promiseResults[2],
            splitMessage: splitMessage,
            args: splitMessage.slice(1, splitMessage.length),
            msg: m,
            commandName: splitMessage[0].slice(promiseResults[0].prefix.length, splitMessage[0].length)
        }
    }
}
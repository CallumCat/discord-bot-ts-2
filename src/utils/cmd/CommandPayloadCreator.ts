import {Message} from "discord.js";
import {GuildManager} from "../GuildManager";
import {UserManager} from "../UserManager";
import {ICommandPayload} from "../../interfaces/ICommandPayload";

export class CommandPayloadCreator {
    static async create(m: Message): Promise<ICommandPayload> {
        const splitMessage = m.content.split(" ");
        const g = await new GuildManager().getOrCreate(m.guild.id);
        const u = await new UserManager().getOrCreate(m.author.id);
        return {
            guild: g,
            user: u,
            splitMessage: splitMessage,
            args: splitMessage.slice(1, splitMessage.length),
            msg: m,
            commandName: splitMessage[0].slice(g.prefix.length, splitMessage[0].length)
        }
    }
}
import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";

export class AboutCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "about",
        aliases: ["a", "info"],
        description: "Info about the bot",
        args: [],
        admin: false,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        p.msg.channel.send(`Built on https://github.com/ethanwritescode/discord-bot-ts-2`);
    }
}
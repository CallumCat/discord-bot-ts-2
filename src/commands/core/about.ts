import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {GlobalVars} from "../../global";

export class AboutCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "about",
        shorthands: ["a", "ab"],
        description: "Get complete information on the bot.",
        shortDescription: "Info about the bot",
        args: [],
        admin: false,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        p.msg.channel.send(`${GlobalVars.client.user.username} is built on https://github.com/ethanwritescode/discord-bot-ts-2. It is a bot framework for TypeScript and utilizes sharding (even though the bot never hit 2.5k guilds lmao)\n\nBot is maintained by **Vysion#3272**.`);
    }
}
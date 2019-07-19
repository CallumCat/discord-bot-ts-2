import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {GlobalVars} from "../../global";

export class AboutCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "about",
        shorthands: ["a", "info"],
        description: "Get complete information on the bot.",
        shortDescription: "Info about the bot",
        args: [],
        admin: false,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        p.msg.channel.send(`${GlobalVars.client.user.username} was built on **https://github.com/ethanwritescode/discord-bot-ts-2**. It was meant to demonstrate sharding and advanced help command structure in TypeScript.\n\nBot and source were developed by **Vysion#3272**.`);
    }
}
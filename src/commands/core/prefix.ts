import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {BotError} from "../../utils/ErrorHandler";
import {GlobalVars} from "../../global";
import {config} from "../../config/config";
import {MessageBuilder} from "../../utils/msg/MessageBuilder";

export class PrefixCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "prefix",
        shorthands: ["p"],
        description: "Change this server's prefix, or view it.",
        shortDescription: "Change prefix",
        args: [
            {
                argName: "new prefix",
                argDescription: "The new prefix, if one is passed",
                required: false
            }
        ],
        admin: false,
        bypassCooldown: false,
        userRequires: ["MANAGE_GUILD"]
    };
    async run(p: ICommandPayload): Promise<void> {
        if (!p.args[0]) {
            p.msg.channel.send(`The current prefix is: \`${p.guild.prefix}\``);
        } else {
            if (p.args[0].length > 8) {
                throw new BotError("Prefix should be 8 characters or lower.");
            }
            await GlobalVars.db.collection(config.db.guildCollection).updateOne({ id: p.guild.id }, {$set: { prefix: p.args[0].toLowerCase() }});
            p.msg.channel.send(MessageBuilder.build({ emoji: ":white_check_mark:", message: `Guild prefix successfully changed to \`${p.args[0].toLowerCase()}\`.`}))
        }
    }
}
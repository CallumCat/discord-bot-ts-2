import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {MessageBuilder} from "../../utils/msg/MessageBuilder";

export class PingCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "ping",
        aliases: ["p", "latency"],
        description: "Ping the Discord API",
        args: [{
            required: false,
            argDescription: "Do not edit this message",
            argName: "testarg"
        }],
        admin: false,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        p.msg.channel.send(MessageBuilder.build({ emoji: ":signal_strength:", message: `Pong! The bot is alive. This guild is served by shard ${p.msg.guild.shardID} of ${p.msg.client.shard.count}.`}));
    }
}
import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {MessageBuilder} from "../../utils/msg/MessageBuilder";

export class PingCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "ping",
        shorthands: ["p"],
        description: "Ping the Discord API and get current shard.",
        shortDescription: "Ping the Discord API",
        args: [],
        admin: false,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        p.msg.channel.send(MessageBuilder.build({ emoji: ":signal_strength:", message: `Pong! (shard ${p.msg.guild.shard.id})`}));
    }
}
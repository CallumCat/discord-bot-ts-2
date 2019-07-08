import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {GlobalVars} from "../../global";
import * as table from "text-table";
import {ShardStatusManager} from "../../utils/ShardStatusManager";

export class ShardsCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "shards",
        aliases: ["sd"],
        description: "Get shard info",
        args: [{
            required: false,
            argDescription: "The shard ID to look up",
            argName: "shardId"
        }],
        admin: true,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        const guildData = await GlobalVars.client.shard.broadcastEval("this.guilds.size");
        const userData = await GlobalVars.client.shard.broadcastEval("this.users.size");
        const shardStatuses = await ShardStatusManager.getAll();


        const shardStatusMap = shardStatuses.map((v) => {
            return v.status
        });
        const shardDisplay: any[] = [
            ["id", "status", "guilds", "users"]
        ];

        for (let i = 0; i < guildData.length; i++) {
            shardDisplay.push([i, shardStatusMap[i], guildData[i], userData[i]]);
        }
        p.msg.channel.send(`\`\`\`\n${table(shardDisplay, {align: ["l", "r", "r", "r"]})}\`\`\``);
    }
}
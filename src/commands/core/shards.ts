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
            ["ID", "STATUS", "GUILDS", "USERS"],
            ["---", "---", "---", "---"]
        ];

        let onlineShards = 0;

        for (let i = 0; i < guildData.length; i++) {
            shardDisplay.push([`${i}`, shardStatusMap[i], guildData[i], userData[i]]);
            if (shardStatusMap[i] === "ONLINE") {
                onlineShards++;
            }
        }

        shardDisplay.push(["---", "---", "---", "---"]);
        shardDisplay.push([guildData.length, `${onlineShards}/${guildData.length} ONLINE`, guildData.reduce((prev, cur) => { return prev + cur }),  userData.reduce((prev, cur) => { return prev + cur })]);

        p.msg.channel.send(`\`\`\`ini\n${table(shardDisplay, {align: ["r", "r", "r", "r"]})}\`\`\``);
    }
}
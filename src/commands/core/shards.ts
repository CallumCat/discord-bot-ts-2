import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {GlobalVars} from "../../global";
import {table} from "table";

export class ShardsCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "shards",
        shorthands: ["sd"],
        shortDescription: "Get shard info",
        description: "Get a table of shard statuses.",
        args: [],
        admin: true,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        const shardDisplay: any[] = [
            ["ID", "Guilds", "Users", "Status", "Ping"]
        ];

        let onlineShards = 0;
        for (let i = 0; i < GlobalVars.client.ws.shards.size; i++) {
            const thisShard = GlobalVars.client.ws.shards.find((v) => { return v.id === i });
            let shardStatusReadable;
            let gCount = 0;
            let uCount = 0;
            await GlobalVars.client.guilds.forEach((v) => {
                if (v.shardID === thisShard.id) {
                    gCount++;
                    uCount += v.members.size;
                }
            });
            switch(thisShard.status) {
                case 0:
                    shardStatusReadable = "READY";
                    break;
                case 1:
                    shardStatusReadable = "CONNECTING";
                    break;
                case 2:
                    shardStatusReadable = "RECONNECTING";
                    break;
                case 3:
                    shardStatusReadable = "IDLE";
                    break;
                case 4:
                    shardStatusReadable = "NEAR";
                    break;
                case 5:
                    shardStatusReadable = "DISCONNECTED";
            }
            shardDisplay.push([thisShard.id, gCount, uCount, shardStatusReadable, `${Math.floor(thisShard.pings[0])}ms`]);
            if (thisShard.status === 0) {
                onlineShards++;
            }

        }
        shardDisplay.push(["---", GlobalVars.client.guilds.size, GlobalVars.client.users.size, `${onlineShards}/${GlobalVars.client.ws.shards.size}`, `${Math.floor(GlobalVars.client.ws.shards.reduce((a,b) => a + b.pings[0], 0) / GlobalVars.client.ws.shards.size)}ms avg.`]);
        //
        p.msg.channel.send(`\`\`\`py\n${table(shardDisplay, {
            drawHorizontalLine: (index, size) => {
                return index === 0 || index === 1 || index === size - 1 || index === size;
            }
        })}\`\`\``);
    }
}
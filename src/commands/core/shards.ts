import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {GlobalVars} from "../../global";
import {getBorderCharacters, table} from "table";
import {ShardStatusManager} from "../../utils/db/ShardStatusManager";
import {Formatter} from "../../utils/Formatter";
import moment from "moment";
import ms from "ms";
import {MessageBuilder} from "../../utils/msg/MessageBuilder";
import {EmbedField} from "discord.js";

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
        const shardFields: EmbedField[] = [];

        const guildData = await GlobalVars.client.shard.broadcastEval("this.guilds.size");
        const userData = await GlobalVars.client.shard.broadcastEval("this.users.size");
        const clientPing = await GlobalVars.client.shard.broadcastEval("this.ws.ping");
        const mem = await GlobalVars.client.shard.broadcastEval("process.memoryUsage().heapUsed");

        const shardStatuses = await ShardStatusManager.getAll();

        const shardStatusMap = shardStatuses.map((v) => {
            return v.status
        });

        let onlineShards = 0;
        for (let i = 0; i < shardStatusMap.length; i++) {
            let emoji = "";
            switch(shardStatusMap[i]) {
                case "ONLINE":
                    onlineShards++;
                    emoji = "<:so:602761121392492546>";
                    break;
                case "OFFLINE" || "ERROR":
                    emoji = "<:sx:602761121509670932>";
                    break;
                case "RECONNECT":
                    emoji = "<:sr:602761121518190592>";
            }
            shardFields.push({
                name: `${emoji} ${p.msg.guild.shardID === i ? `${i} (Current)` : i}`,
                value: `\`\`\`py\nG: ${guildData[i]}\nU: ${userData[i]}\nS: ${shardStatusMap[i]}\nM: ${Formatter.formatBytes(mem[i])}\nP: ${Math.floor(clientPing[i])}ms\nL: ${ms(parseInt(moment().format("x")) - parseInt(moment(shardStatuses[i].lastUpdate).format("x")))}\`\`\``,
                inline: true
            });
            // shardDisplay.push([, , userData[i], shardStatusMap[i], ``, `${Math.floor(clientPing[i])}ms`, ms(parseInt(moment().format("x")) - parseInt(moment(shardStatuses[i].lastUpdate).format("x")))]);

        }
        // shardDisplay.push([`${shardStatusMap.length}`, guildData.reduce((a,b) => {return a+b}), userData.reduce((a,b) => { return a+b}), `${onlineShards}/${shardStatusMap.length}`, `${Formatter.formatBytes(mem.reduce((a,b) => { return a+b}))}`, `${Math.floor(clientPing.reduce((a,b) => a + b, 0) / clientPing.length)}ms A`, "---"]);
        //
        // p.msg.channel.send(`\`\`\`py\n${table(shardDisplay, {
        //     drawHorizontalLine: (index, size) => {
        //         return index === 0 || index === 1 || index === size - 1 || index === size;
        //     },
        //     border: getBorderCharacters("ramac")
        // })}\nI: ID\nG: Guilds cached\nU: Users cached\nS: Status\nM: Memory\nP: Avg. ping\nL: Last updated (L) ago\`\`\``);
        p.msg.channel.send(MessageBuilder.buildEmbed({
            description: `\`\`\`py\nSHARD TOTAL: ${shardStatusMap.length}\nGUILD TOTAL: ${guildData.reduce((a,b) => {return a+b})}\nUSER TOTAL: ${userData.reduce((a,b) => { return a+b})}\nONLINE SHARDS: ${onlineShards}/${shardStatusMap.length}\nTOTAL MEM: ${Formatter.formatBytes(mem.reduce((a,b) => { return a+b}))}\nPING AVG.: ${Math.floor(clientPing.reduce((a,b) => a + b, 0) / clientPing.length)}ms\`\`\``,
            fields: shardFields
        }))
    }
}
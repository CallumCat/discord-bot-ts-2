import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {GlobalVars} from "../../global";
import {MessageBuilder} from "../../utils/msg/MessageBuilder";
import * as moment from "moment";
import {Formatter} from "../../utils/Formatter";

export class StatsCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "stats",
        shorthands: ["s"],
        description: "Get complete stats on the bot",
        shortDescription: "Get complete stats on the bot",
        args: [],
        admin: false,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        const os = require("os");
        const hd = require("humanize-duration");
        const freeMem = os.freemem();
        const totalMem = os.totalmem();
        const cpu = os.cpus();
        const memUsePercentage = Math.round((freeMem / totalMem) * 100);
        await p.msg.channel.send(await MessageBuilder.buildEmbed({
            description: `Users: ${GlobalVars.client.users.size}\nGuilds: ${GlobalVars.client.guilds.size}\nChannels: ${GlobalVars.client.channels.size}\nEmojis: ${GlobalVars.client.emojis.size}\nWS Heartbeat (last): ${GlobalVars.client.ws.ping}\nReady at: ${moment(GlobalVars.client.readyTimestamp).format("MMMM Do @ HH:mm:ss")} (${hd(moment.duration(Math.round(GlobalVars.client.uptime)).asMilliseconds(), {
                round: true,
                largest: 3
            })})\n\nOperating on: "${os.hostname()}" ${os.platform()} ${os.release()} ${os.arch()}\nUsed / Total Memory: ${Formatter.formatBytes(freeMem)}/${Formatter.formatBytes(totalMem)} (${memUsePercentage}% used)\nCPU Model: ${cpu[0].model} (Count: ${cpu.length})`,
        }));
    }
}
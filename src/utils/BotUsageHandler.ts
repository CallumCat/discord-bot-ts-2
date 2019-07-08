import {ICommandPayload} from "../interfaces/ICommandPayload";
import {GlobalVars} from "../global";
import {config} from "../config/config";
import {Snowflake} from "discord.js";

export class BotUsageHandler {
    static async increaseCommandCount(p: ICommandPayload) {
        await GlobalVars.db.collection(config.db.userCollection).updateOne({ id: p.user.id }, { $inc: { commandsUsed: 1 } });
        await GlobalVars.db.collection(config.db.guildCollection).updateOne({ id: p.guild.id }, { $inc: { commandsUsed: 1 } });
    }
    static addUserToCooldown(id: Snowflake) {
        if (!GlobalVars.cooldownSet.has(id)) {
            GlobalVars.cooldownSet.add(id);
            setTimeout(() => {
                GlobalVars.cooldownSet.delete(id);
            }, config.cooldownLengthMs);
        }
    }
}
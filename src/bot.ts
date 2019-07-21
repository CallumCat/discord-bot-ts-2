import {config} from "./config/config";
import {Logger} from "./utils/Logger";
import {MessageHandler} from "./utils/msg/MessageHandler";
import {ErrorHandler} from "./utils/ErrorHandler";
import {GlobalVars} from "./global";
import {DbClientManager} from "./utils/db/DbClientManager";
import {ShardStatusManager} from "./utils/db/ShardStatusManager";
import {ClientStatusManager} from "./utils/ClientStatusManager";

export class Bot {
    static async start() {
        GlobalVars.db = await DbClientManager.connect();
        Logger.log(`❖ Instance of client connected to database.`);

        GlobalVars.client.on("message", async(m) => {
            await MessageHandler.handle(m).catch((e: Error) => {
                m.channel.send(ErrorHandler.returnErrorMessage(e));
            })
        });

        GlobalVars.client.on("ready", () => {
            Logger.log(`❖ Instance of client is ready. This instance is serving ${GlobalVars.client.guilds.size} guilds and ${GlobalVars.client.users.size} users.`, "success");
        });

        GlobalVars.client.on("shardDisconnected", async(evt, id) => {
            Logger.log(`💎 SHARD ${id} disconnected and will not reconnect.`, "error");
            await ShardStatusManager.update(id, "OFFLINE");
        });

        GlobalVars.client.on("shardError", async(evt, id) => {
            Logger.log(`💎 SHARD ${id} is encountering a connection error.`, "warn");
            await ShardStatusManager.update(id, "ERROR");
        });

        GlobalVars.client.on("shardReconnecting", async(id) => {
            Logger.log(`💎 SHARD ${id} is trying to reconnect.`, "warn");
            await ShardStatusManager.update(id, "RECONNECT");

        });

        GlobalVars.client.on("shardResumed", async(id) => {
            Logger.log(`💎 SHARD ${id} resumed successfully.`, "success");
            await ShardStatusManager.update(id, "ONLINE");
        });

        GlobalVars.client.on("shardReady", async(id) => {
            Logger.log(`💎 SHARD ${id} is ready.`, "success");
            await ShardStatusManager.update(id, "ONLINE");

            await ClientStatusManager.change(id);
        });

        await GlobalVars.client.login(config.client.token);
    }
}

Bot.start();
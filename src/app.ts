import {config} from "./config/config";
import {GlobalVars} from "./global";
import {Logger} from "./utils/Logger";
import {InitValidator} from "./utils/InitValidator";
import {DbClientManager} from "./utils/db/DbClientManager";
import {MessageHandler} from "./utils/msg/MessageHandler";
import {ErrorHandler} from "./utils/ErrorHandler";
import {ClientStatusManager} from "./utils/ClientStatusManager";

class Application {
    static async start() {
        Logger.log(`🚀 Starting launch process.`);
        Logger.log(`⚙ Connecting to database...`);

        GlobalVars.db = await DbClientManager.connect();
        Logger.log(`⚙ Database connected to "${config.db.dbName}" as ${config.db.user} @ ${config.db.host} on ${config.db.port}.`, "success");

        Logger.log(`✚ Starting validation process.`);

        await InitValidator.checkDbForOptions();
        await InitValidator.checkDbForOwner();

        Logger.log(`✚ Validation process complete. Spawning shards...`, "success");

        GlobalVars.client.on("message", async(m) => {
            await MessageHandler.handle(m).catch((e: Error) => {
                m.channel.send(ErrorHandler.returnErrorMessage(e));
            })
        });

        GlobalVars.client.on("ready", async() => {
            await ClientStatusManager.change();
            Logger.log(`❖ Client is ready. Serving ${GlobalVars.client.guilds.size} guilds and ${GlobalVars.client.users.size} users.`, "success");
            Logger.log(`✌ Launch successful!`, "success");
        });

        await GlobalVars.client.login(config.client.token);

    }
}

Application.start();
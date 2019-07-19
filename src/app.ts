import {config} from "./config/config";
import {GlobalVars} from "./global";
import {Logger} from "./utils/Logger";
import {InitValidator} from "./utils/InitValidator";
import {DbClientManager} from "./utils/db/DbClientManager";

class Application {
    static async start() {
        Logger.log(`🚀 Starting launch process.`);
        Logger.log(`⚙ Master process connecting to database...`);

        GlobalVars.db = await DbClientManager.connect();
        Logger.log(`⚙ Master process connected to "${config.db.dbName}" as ${config.db.user} @ ${config.db.host} on ${config.db.port}.`, "success");

        Logger.log(`✚ Starting validation process.`);

        await InitValidator.checkDbForOptions();
        await InitValidator.checkDbForOwner();
        await InitValidator.setDbShardStatus();

        Logger.log(`✚ Validation process complete. Spawning shards...`, "success");
        await GlobalVars.shardingManager.spawn(config.shardCount);

        Logger.log(`✌ Launch successful!`, "success");
    }
}

Application.start();
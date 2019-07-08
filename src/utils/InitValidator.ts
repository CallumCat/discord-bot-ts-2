import {Logger} from "./Logger";
import {GlobalVars} from "../global";
import {config} from "../config/config";
import {UserManager} from "./UserManager";
import {DefaultObjectCreator} from "./DefaultObjectCreator";
import {ShardStatusManager} from "./ShardStatusManager";

export class InitValidator {
    static async checkDbForOptions() {
        Logger.log(`✚ Checking database for options document...`);
        const docCount = await GlobalVars.db.collection(config.db.optionsCollection).countDocuments();
        if (docCount === 0) {
            Logger.log(`✚ No options document exists. Creating default object.`);
            const defaultObject = DefaultObjectCreator.createOptionsObject();
            await GlobalVars.db.collection(config.db.optionsCollection).insertOne(defaultObject);
        } else {
            Logger.log(`✚ Looks like options document exists.`);

        }
        Logger.log(`✚ Done checking for options document.`, "success");
    }
    static async checkDbForOwner() {
        Logger.log(`✚ Checking database for bot owner's ID. If the data isn't present an object will be created.`);
        const u = await new UserManager().getOrCreate(config.botOwnerId);
        await GlobalVars.db.collection(config.db.userCollection).updateOne({ id: u.id }, { $set: { admin: true }});
    }
    static async setDbShardStatus() {
        Logger.log(`✚ Setting up shard status...`);
        await ShardStatusManager.resetAndSet();
        Logger.log(`✚ Finished setting up shard status.`, "success");
    }
}
import {DefaultObjectCreator} from "../DefaultObjectCreator";
import {GlobalVars} from "../../global";
import {IShardStatus} from "../../interfaces/IShardStatus";
import {config} from "../../config/config";
import moment from "moment";

export class ShardStatusManager {
    static async resetAndSet(): Promise<void> {
        await GlobalVars.db.collection(config.db.shardStatusCollection).deleteMany({});
        for (let i = 0; i < config.shardCount; i++) {
            const shardObject = DefaultObjectCreator.createShardStatus(i);
            await GlobalVars.db.collection(config.db.shardStatusCollection).insertOne(shardObject);
        }
    }
    static async update(id: number, newStatus: string): Promise<void> {
        await GlobalVars.db.collection(config.db.shardStatusCollection).updateOne({ id: id }, { $set: { status: newStatus, lastUpdate: moment().format() }});
    }
    static async getAll(): Promise<IShardStatus[]> {
        let shardDocs: IShardStatus[] = [];
        const cursor = GlobalVars.db.collection(config.db.shardStatusCollection).find({});
        await cursor.forEach((doc) => {
            shardDocs.push(doc);
        });
        return shardDocs;
    }
}
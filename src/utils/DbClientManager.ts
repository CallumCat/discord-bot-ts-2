import {Db, MongoClient} from "mongodb";
import {config} from "../config/config";

export class DbClientManager {
    static async connect(): Promise<Db> {
        return await MongoClient.connect('mongodb://' + config.db.user + ':' + config.db.pass + '@' + config.db.host + ':' + config.db.port + '/' + config.db.dbName, {useNewUrlParser: true}).then(async(c) => {
            return c.db();
        });
    }
}
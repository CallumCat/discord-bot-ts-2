import {Db} from "mongodb";
import {PingCommand} from "./commands/core/ping";
import {ICommandStructure} from "./interfaces/ICommandStructure";
import {Client, ShardingManager} from "discord.js";
import {HelpCommand} from "./commands/core/help";
import {ShardsCommand} from "./commands/core/shards";
import * as path from "path";
import {AboutCommand} from "./commands/core/about";

export class GlobalVars {
    public static db: Db;
    public static commands: ICommandStructure[] = [
        new PingCommand(),
        new HelpCommand(),
        new ShardsCommand(),
        new AboutCommand()
    ];
    public static cooldownSet = new Set();
    public static client = new Client({disableEveryone: true});
    public static shardingManager = new ShardingManager(path.resolve(__dirname, "bot.js"));
}

import {Db} from "mongodb";
import {PingCommand} from "./commands/core/ping";
import {ICommandStructure} from "./interfaces/ICommandStructure";
import {Client, ShardingManager} from "discord.js";
import {HelpCommand} from "./commands/core/help";
import {ShardsCommand} from "./commands/core/shards";
import {AboutCommand} from "./commands/core/about";
import {BotSettingsCommand} from "./commands/core/botsettings";
import {PrefixCommand} from "./commands/core/prefix";
import {UrbanDictionaryCommand} from "./commands/utils/urbandictionary";
import {EvalCommand} from "./commands/core/eval";
import {StatsCommand} from "./commands/core/stats";
import * as path from "path";

export class GlobalVars {
    public static db: Db;
    public static commands: ICommandStructure[] = [
        new PingCommand(),
        new HelpCommand(),
        new ShardsCommand(),
        new AboutCommand(),
        new BotSettingsCommand(),
        new PrefixCommand(),
        new UrbanDictionaryCommand(),
        new EvalCommand(),
        new StatsCommand()
    ];
    public static cooldownSet = new Set();
    public static client = new Client({disableEveryone: true});
    public static shardingManager = new ShardingManager(path.resolve(__dirname, "bot.js"));
    public static statusNumber = 0;
}

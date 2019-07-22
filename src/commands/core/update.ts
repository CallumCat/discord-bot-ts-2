import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {BotError} from "../../utils/ErrorHandler";
import {MessageBuilder} from "../../utils/msg/MessageBuilder";
import {config} from "../../config/config";
import {Message} from "discord.js";
import {GlobalVars} from "../../global";

export class UpdateCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "update",
        shorthands: [],
        description: "Pull recent commits from Github, build all files and then restart all shards. If any change is made inside app.ts the entire process must be manually reloaded via PM2. **DO NOT RUN THIS COMAMND IN THE TESTING ENVIRONMENT.**",
        shortDescription: "Update the bot & restart",
        args: [{
            argName: "all",
            argDescription: "Restart the entire Node.js process instead of re-spawning shards.",
            required: false
        }],
        admin: true,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        try {
            require('child_process').exec("git reset --hard HEAD && git pull origin master");
        } catch(e) {
            throw new BotError(`Error pulling latest commit: ${e}`);
        }
        const m: Message = await p.msg.channel.send(MessageBuilder.build({ emoji: ":white_check_mark:", message: `Successfully pulled latest commit. Building files...`})) as Message;
        await require('child_process').exec("gulp build");

        if (p.args[1] && p.args[1].toLowerCase() === "all") {
            await m.edit(MessageBuilder.build({ emoji: ":white_check_mark:", message: `Files built. Restarting PM2 process.`}));
            require('child_process').exec(`pm2 restart ${config.pm2ProcessName}`);
        } else {
            await m.edit(MessageBuilder.build({ emoji: ":white_check_mark:", message: `Files built. Restarting all shards (files outside of bot.ts scope will not have their changes reflected).`}));
            await GlobalVars.shardingManager.respawnAll(5000, 500, 15000);
        }
    }
}
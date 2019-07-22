import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {BotError} from "../../utils/ErrorHandler";
import {MessageBuilder} from "../../utils/msg/MessageBuilder";
import {config} from "../../config/config";
import {Message} from "discord.js";
import {GlobalVars} from "../../global";

async function awaitExec(cmd: string) {
    return await new Promise((resolve, reject)=> {
        require('child_process').exec(cmd, (error: Error, stdout: string, stderr: string) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout)
        });
    });
}

export class UpdateCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "update",
        shorthands: [],
        description: "Pull recent commits from Github, build all files and then restart the process. If any change is made inside app.ts the entire process must be manually reloaded via PM2. **DO NOT RUN THIS COMAMND IN ANY DIRECTORY WHICH HAS UNCOMMITED CHANGES.**",
        shortDescription: "Update the bot & restart",
        args: [],
        admin: true,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        try {
            await awaitExec("git fetch --all && git reset --hard origin/master");
        } catch(e) {
            throw new BotError(`Error pulling latest commit: ${e}`);
        }
        const m: Message = await p.msg.channel.send(MessageBuilder.build({ emoji: ":white_check_mark:", message: `Successfully pulled latest commit. Building files...`})) as Message;

        await awaitExec("gulp build");
        await m.edit(MessageBuilder.build({ emoji: ":white_check_mark:", message: `Files built successfully. Restarting PM2 process.\n\nThis will be the last message sent before the process exits.`}));
        require('child_process').exec(`pm2 restart ${config.pm2ProcessName}`);
    }
}
import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {GlobalVars} from "../../global";
import {CommandManager} from "../../utils/cmd/CommandManager";
import {BotError} from "../../utils/ErrorHandler";

export class HelpCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "help",
        aliases: ["h", "info"],
        description: "Get help with any command.",
        args: [{
            required: false,
            argDescription: "The name of this command.",
            argName: "commandname"
        }],
        admin: false,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        if (!p.args[0]) {
            const commandList = GlobalVars.commands.map((cmd) => {return `**- ${cmd.conf.name}${cmd.conf.admin ? " [A]":""}**: ${cmd.conf.description}`});
            p.msg.channel.send(`**Use \`${p.guild.prefix}help (commandname)\` to get help with a specific command.**\n\n${commandList.join("\n")}`);
        }
        else {
            const c = await CommandManager.findCommand(p.args[0]);
            if (!c) {
                throw new BotError(`Command \`${p.args[0]}\` not found & does not match any alias.`);
            }
            let argArr = [c.conf.name];
            let argDesc = [];
            for (let i = 0; i < c.conf.args.length; i++) {
                if (c.conf.args[i].required) {
                    argArr.push(`[${c.conf.args[i].argName}]`);
                    argDesc.push(`- **${c.conf.args[i].argName} [Required]**: ${c.conf.args[i].argDescription}`);
                } else {
                    argArr.push(`(${c.conf.args[i].argName})`);
                    argDesc.push(`- **${c.conf.args[i].argName}**: ${c.conf.args[i].argDescription}`);
                }
            }
            p.msg.channel.send(`\`\`\`\n${p.guild.prefix}${argArr.join(" ")}\`\`\`\n**${c.conf.name}**: ${c.conf.description}\n\n${argDesc.join("\n")}`)
        }
    }
}
import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {GlobalVars} from "../../global";
import {CommandManager} from "../../utils/cmd/CommandManager";
import {BotError} from "../../utils/ErrorHandler";
import {MessageBuilder} from "../../utils/msg/MessageBuilder";

export class HelpCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "help",
        shorthands: ["h"],
        description: "Get help with all commands. You can pass no arguments to list all commands, or pass a command name to inspect details.",
        shortDescription: "Get help with all commands.",
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
            const commandList = GlobalVars.commands.map((cmd) => {return `• **${cmd.conf.name}${cmd.conf.admin ? " [Admin]":""}${cmd.conf.nsfw ? " [Nsfw]":""}** - ${cmd.conf.shortDescription}`});
            p.msg.channel.send(`**Use \`${p.guild.prefix}help (commandname)\` to get help with a specific command.**\n\n${commandList.join("\n")}`);
        }
        else {
            const c = await CommandManager.findCommand(p.args[0]);
            if (!c) {
                throw new BotError(`Command name \`${p.args[0]}\` not found & does not match any shorthand.`);
            }
            let argArr = [c.conf.name];
            let argDesc = [];
            let specialRequirementArr = [];
            for (let i = 0; i < c.conf.args.length; i++) {
                if (c.conf.args[i].required) {
                    argArr.push(`<<${c.conf.args[i].argName}>>`);
                } else {
                    argArr.push(`(${c.conf.args[i].argName})`);
                }
                argDesc.push(`• ${c.conf.args[i].required ? "[Required] " : ""}**${c.conf.args[i].argName}** - ${c.conf.args[i].argDescription}`);
            }
            if (c.conf.admin) {
                specialRequirementArr.push("**• This command is administrator exclusive.**");
            }
            if (c.conf.nsfw) {
                specialRequirementArr.push("**• This command can only be used in Nsfw channels.**");
            }
            await p.msg.channel.send(MessageBuilder.buildEmbed({
                title: `__${c.conf.name}__ (Shorthand: ${c.conf.shorthands.join(", ")})`,
                description: `*${c.conf.description}*${specialRequirementArr.length > 0 ? `\n\n${specialRequirementArr.join("\n")}` : ""}`,
                fields: [{
                    name: "**Usage**",
                    value: `\`\`\`\n${p.guild.prefix}${argArr.join(" ")}\`\`\`\n`
                }, {
                    name: "**Arguments**",
                    value: `${argDesc.length > 0 ? argDesc.join("\n") : "No arguments"}`
                }, {
                    name: "**User Requires**",
                    value: `${c.conf.userRequires ? `\`\`\`\n${c.conf.userRequires.join("\n")}\`\`\`` : "No additional permissions"}`,
                    inline: true
                }, {
                    name: "**Bot Requires**",
                    value: `${c.conf.botRequires ? `\`\`\`\n${c.conf.botRequires.join("\n")}\`\`\`` : "No additional permissions"}`,
                    inline: true
                }]
            }))
            // p.msg.channel.send(`${c.conf.admin ? "\`[Admin Only]\` " : ""}**__${c.conf.name}__** - ${c.conf.description}\n*You can also use:* \`${c.conf.aliases.join(" / ")}\` *to invoke this command*\n\n[Usage]\`\`\`\n${p.guild.prefix}${argArr.join(" ")}\`\`\`\n\n[Arguments]\n\`\`\`\n${argDesc.join("\n")}\`\`\``)
        }
    }
}
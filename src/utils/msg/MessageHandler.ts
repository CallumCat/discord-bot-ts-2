import {Message, TextChannel} from "discord.js";
import {CommandPayloadCreator} from "../cmd/CommandPayloadCreator";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {BotError, ErrorHandler} from "../ErrorHandler";
import {CommandManager} from "../cmd/CommandManager";
import {GlobalVars} from "../../global";
import {BotUsageHandler} from "../BotUsageHandler";

export class MessageHandler {
    static async handle(m: Message): Promise<void> {
        if (m.author.bot || m.author.id === m.client.user.id || m.channel.type === "dm") {
            return;
        }
        let commandPayload = await CommandPayloadCreator.create(m);
        if (!MessageHandler.valid(commandPayload)) {
            return;
        }
        const cmd = CommandManager.findCommand(commandPayload.commandName);
        if (!cmd) {
            return;
        }
        commandPayload.commandName = cmd.conf.name;

        if (!commandPayload.user.admin) {
            if (!commandPayload.options.commandsEnabled) {
                throw new BotError("Commands are disabled temporarily for maintenance.");
            }
            if (cmd.conf.admin && !commandPayload.user.admin) {
                throw new BotError("Unauthorized.");
            }
            if (GlobalVars.cooldownSet.has(m.author.id) && !cmd.conf.bypassCooldown) {
                throw new BotError("Wait before running another command.");
            }
            if (!m.guild.members.get(m.author.id).permissions.has(cmd.conf.userRequires)) {
                throw new BotError(`You are missing one or more permissions: \`${cmd.conf.userRequires.join(", ")}\``);
            }
            if (!m.guild.members.get(GlobalVars.client.user.id).permissions.has(cmd.conf.botRequires)) {
                throw new BotError(`The bot is missing one or more permissions: \`${cmd.conf.userRequires.join(", ")}\``);
            }
            if (m.channel instanceof TextChannel && !m.channel.nsfw && cmd.conf.nsfw) {
                throw new BotError("Use this command in a channel marked as nsfw.");
            }
        }

        cmd.run(commandPayload).then(async() => {
            await BotUsageHandler.increaseCommandCount(commandPayload);
            BotUsageHandler.addUserToCooldown(m.author.id);
        }).catch((e: Error) => {
            m.channel.send(ErrorHandler.returnErrorMessage(e));
        });
    }
    static valid(msg: ICommandPayload): boolean {
        return msg.splitMessage[0].toLowerCase().startsWith(msg.guild.prefix);
    }

}
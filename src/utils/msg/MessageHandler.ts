import {Message} from "discord.js";
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

        if (cmd.conf.admin && !commandPayload.user.admin) {
            throw new BotError("You can't run this command.");
        }
        if (GlobalVars.cooldownSet.has(m.author.id)) {
            throw new BotError("Wait before running another command.");
        }
        cmd.run(commandPayload).then(async() => {
            await BotUsageHandler.increaseCommandCount(commandPayload);
            BotUsageHandler.addUserToCooldown(m.author.id);
        }).catch((e: Error) => {
             console.log(e);
            m.channel.send(ErrorHandler.returnErrorMessage(e));
        });
    }
    static valid(msg: ICommandPayload): boolean {
        return msg.splitMessage[0].toLowerCase().startsWith(msg.guild.prefix);
    }

}
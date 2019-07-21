import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {BotError} from "../../utils/ErrorHandler";
import {GlobalVars} from "../../global";
import {config} from "../../config/config";
import {MessageBuilder} from "../../utils/msg/MessageBuilder";

export class BotSettingsCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "botsettings",
        shorthands: ["bs"],
        description: "Change and configure bot settings. Use (t (True)/f (False)) to change values.",
        shortDescription: "Configure bot settings",
        args: [{
            required: false,
            argDescription: "The setting name. If empty, current bot settings will be listed.",
            argName: "setting"
        }, {
            required: false,
            argDescription: "Add true or false as the second argument to change this setting's value.",
            argName: "new setting value"
        }],
        admin: true,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        if (!p.args[0]) {
            await p.msg.channel.send(`**Current bot settings**\n\n**Commands enabled:** ${p.options.commandsEnabled}`);
        }
        else if (p.args[0] === "commandsenabled") {
            if (!p.args[1]) {
                await p.msg.channel.send(`Commands are currently ${p.options.commandsEnabled ? "enabled" : "disabled"}.`);
            } else if (p.args[1].startsWith("f")) {
                await GlobalVars.db.collection(config.db.optionsCollection).updateOne({}, { $set: {commandsEnabled: false}});
                await p.msg.channel.send(MessageBuilder.build({ emoji: ":white_check_mark:", message: "Commands disabled."}));
            } else {
                await GlobalVars.db.collection(config.db.optionsCollection).updateOne({}, { $set: {commandsEnabled: true}});
                await p.msg.channel.send(MessageBuilder.build({ emoji: ":white_check_mark:", message: "Commands enabled."}));
            }
        }
        else {
            throw new BotError("Setting not found.");
        }
    }
}
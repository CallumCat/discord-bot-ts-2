import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import {BotError} from "../../utils/ErrorHandler";
import {MessageBuilder} from "../../utils/msg/MessageBuilder";

export class EvalCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "eval",
        shorthands: ["ev"],
        description: "Evaluate code. Couldn't be simpler",
        shortDescription: "Eval code",
        args: [{
            argName: "eval query",
            argDescription: "what to eval",
            required: true
        }],
        admin: true,
        bypassCooldown: false
    };
    async run(p: ICommandPayload): Promise<void> {
        if (!p.args[0]) {
            throw new BotError("hey, eval something");
        }
        try {
            const evResult = await eval(p.args.join(" "));
            p.msg.channel.send(MessageBuilder.build({ emoji: ":white_check_mark:", message: `Done.\n\`\`\`js\n${JSON.stringify(evResult)}\`\`\``}))
        } catch(e) {
            p.msg.channel.send(MessageBuilder.buildErr(`\`\`\`js\n${e}\`\`\``))
        }
    }
}
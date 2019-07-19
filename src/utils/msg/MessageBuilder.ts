import {MessageEmbedOptions} from "discord.js";

export class MessageBuilder {
    static build(opts: MessageBuilderOpts): string {
        return `${opts.emoji ? `${opts.emoji} :: ` : ``}${opts.message}`
    }
    static buildErr(m: string): string {
        return MessageBuilder.build({ emoji: ":x:", message: m});
    }
    static buildEmbed(o: MessageEmbedOptions): object {
        o.color = "#ffffff";
        return {
            embed: o
        }
    }
}

export interface MessageBuilderOpts {
    emoji: string;
    message: string;
}

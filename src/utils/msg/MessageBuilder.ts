export class MessageBuilder {
    static build(opts: MessageBuilderOpts): string {
        return `${opts.emoji ? `${opts.emoji} :: ` : ``}${opts.message}`
    }
    static buildErr(m: string): string {
        return MessageBuilder.build({ emoji: ":x:", message: m});
    }
}

export interface MessageBuilderOpts {
    emoji: string;
    message: string;
}

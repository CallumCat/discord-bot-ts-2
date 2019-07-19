import {ICommandConfig, ICommandStructure} from "../../interfaces/ICommandStructure";
import {ICommandPayload} from "../../interfaces/ICommandPayload";
import axios from "axios";
import {BotError} from "../../utils/ErrorHandler";
import {MessageBuilder} from "../../utils/msg/MessageBuilder";

export interface IUrbanDictionaryAPIResponse {
    tags: string[];
    result_type: string;
    list: IUDList[];
    sounds: string[];
}

export interface IUDList {
    defid: number;
    word: string;
    author: string;
    permalink: string;
    definition: string;
    example: string;
    thumbs_up: number;
    thumbs_down: number;
}

export class UrbanDictionaryCommand implements ICommandStructure {
    conf: ICommandConfig = {
        name: "urbandictionary",
        shorthands: ["urban", "ud"],
        description: "Search anything from Urban Dictionary. Will return the most popular result for a word, or a random word.",
        shortDescription: "Search Urban Dictionary",
        args: [{
            argName: "query",
            argDescription: "A search term to query. If there is no query, this will return the definition for a random word.",
            required: false
        }],
        admin: false,
        bypassCooldown: false,
        nsfw: true
    };
    async run(p: ICommandPayload): Promise<void> {
        const data: IUrbanDictionaryAPIResponse = await axios.get(`http://api.urbandictionary.com/v0/define?term=${p.args.join(" ")}`).then((res) => {
            return res.data;
        }).catch(() => {
            throw new BotError(`Cannot retrieve definition due to unexpected error.`);
        });
        if (data.list.length === 0) {
            throw new BotError(`No definition matched the query \`${p.args.join(" ")}\`.`)
        }
        let topDefinition = data.list[0];
        p.msg.channel.send(MessageBuilder.buildEmbed({
            title: `UD: **${topDefinition.word}**`,
            url: topDefinition.permalink,
            description: `${topDefinition.definition.length > 500 ? topDefinition.definition.slice(0, 500) + "..." : topDefinition.definition}`,
            fields: [{
                name: "**Example**",
                value: `${topDefinition.example.length > 500 ? topDefinition.example.slice(0, 500) + "..." : topDefinition.example}`
            }],
            footer: {
                text: `Written by ${topDefinition.author} / ID: ${topDefinition.defid} / Rating: +${topDefinition.thumbs_up} | -${topDefinition.thumbs_down} (${Math.floor((topDefinition.thumbs_up / (topDefinition.thumbs_up + topDefinition.thumbs_down)) * 100)}% pos.)`
            }
        }));
    }
}
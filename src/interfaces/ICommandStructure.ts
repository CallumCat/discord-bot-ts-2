import {ICommandPayload} from "./ICommandPayload";
import {PermissionString} from "discord.js";

export interface ICommandStructure {
    conf: ICommandConfig;
    run(p: ICommandPayload): Promise<void>
}

export interface ICommandConfig {
    name: string;
    shorthands: string[];
    args: ICommandArgs[];
    description: string;
    shortDescription: string;
    admin: boolean;
    bypassCooldown: boolean;
    botRequires?: PermissionString[];
    userRequires?: PermissionString[];
    nsfw?: boolean
}

export interface ICommandArgs {
    required?: boolean;
    argName: string;
    argDescription: string;
}
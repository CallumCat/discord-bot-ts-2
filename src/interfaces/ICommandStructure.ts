import {ICommandPayload} from "./ICommandPayload";

export interface ICommandStructure {
    conf: ICommandConfig;
    run(p: ICommandPayload): Promise<void>
}

export interface ICommandConfig {
    name: string;
    aliases: string[];
    args: ICommandArgs[];
    description: string;
    admin: boolean;
    bypassCooldown: boolean;
}

export interface ICommandArgs {
    required?: boolean;
    argName: string;
    argDescription: string;
}
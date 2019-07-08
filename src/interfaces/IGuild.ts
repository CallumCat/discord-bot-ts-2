import {IData} from "./IData";

export interface IGuild extends IData {
    commandsUsed: number;
    prefix: string;
}
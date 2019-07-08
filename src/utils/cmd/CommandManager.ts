import {ICommandStructure} from "../../interfaces/ICommandStructure";
import {GlobalVars} from "../../global";

export class CommandManager {
    static findCommand(name: string): ICommandStructure {
        let cmd = GlobalVars.commands.find((cmd) => { return cmd.conf.name == name.toLowerCase() });
        if (!cmd) {
            cmd = GlobalVars.commands.find((cmd) => { return cmd.conf.aliases.includes(name.toLowerCase()) });
            if (!cmd) {
                return null;
            }
        }
        return cmd;
    }
}
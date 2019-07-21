import {GlobalVars} from "../global";
import {config} from "../config/config";

export class ClientStatusManager {
    static async change(id: number): Promise<void> {
        GlobalVars.statusNumber++;
        if (GlobalVars.statusNumber === 3) {
            GlobalVars.statusNumber = 0;
        }
        let statusStr;
        switch(GlobalVars.statusNumber) {
            case 0:
                statusStr = `${GlobalVars.client.guilds.size} guilds`;
                break;
            case 1:
                statusStr = `${GlobalVars.client.users.size} users`;
                break;
            case 2:
                statusStr = `shard ${id}`;
        }
        await GlobalVars.client.user.setPresence({
            activity: {
                type: "STREAMING",
                url: "https://www.twitch.tv/imvysion",
                name: `${config.defaultPrefix}help :: ${statusStr}`
            },
            shardID: id
        });
        setTimeout(async() => {
            await this.change(id);
        }, 1000 * 60);
    }
}
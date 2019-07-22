export interface IShardStatus {
    id: number;
    status: shardStatusType;
    lastUpdate: string;
}

export type shardStatusType = "ONLINE"|"OFFLINE"|"ERROR"|"RECONNECT";
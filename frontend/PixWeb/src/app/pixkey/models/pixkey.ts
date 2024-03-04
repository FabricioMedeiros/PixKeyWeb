import { PixKeyType } from "./pixkeytype";

export interface PixKey {
    id: number;
    description: string;
    key: string;
    keyType: PixKeyType;
    isPersonalKey: boolean;
    creationDate: Date;
    lastUpdateDate: Date;
}
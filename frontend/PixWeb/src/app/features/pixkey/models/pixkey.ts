import { PixKeyType } from "./pixkeytype";

export interface PixKey {
    id: number;
    description: string;
    isPersonalKey: boolean;
    keyType: PixKeyType;
    key: string; 
    creationDate: Date;
    lastUpdateDate: Date;
}
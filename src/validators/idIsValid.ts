import { validate as isValidUUID } from "uuid";

export const isIDValid = (id: string): boolean => {
    return isValidUUID(id);
};

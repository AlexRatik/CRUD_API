import { USER_FIELDS } from "../enums/userFields";
import { IUser } from "../interfaces/IUser";

export const userIsValid = (user: IUser): boolean => {
    let isValid: boolean = true;
    if (
        !user[USER_FIELDS.USERNAME] ||
        !user[USER_FIELDS.AGE] ||
        !user[USER_FIELDS.HOBBIES]
    ) {
        isValid = false;
    }
    Object.values(user).map((value) => {
        if (!value) {
            isValid = false;
        }
    });
    return isValid;
};

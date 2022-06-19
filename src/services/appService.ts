import { IncomingMessage, ServerResponse } from "http";
import { DataBase } from "../dataBase";
import { sendResponse } from "./sendResponse";
import { METHODS } from "../enums/methods";
import { isIDValid } from "../validators/idIsValid";

const DATABASE = new DataBase();
export const appService = (req: IncomingMessage, res: ServerResponse) => {
    try {
        const baseURL = "/api/users";
        const id = req.url?.split("/")[3] || "";

        if (!req.url?.startsWith(baseURL)) {
            sendResponse(res, 404, { error: "Page not found" });
            return;
        }
        switch (req.method) {
            case METHODS.GET: {
                if (!id) {
                    const users = DATABASE.getUsers();
                    sendResponse(res, 200, users);
                } else {
                    if (isIDValid(id)) {
                        const user = DATABASE.getUserById(id);
                        if (user) {
                            sendResponse(res, 200, { data: user });
                        } else {
                            sendResponse(res, 404, {
                                error: `User with id ${id} doesn't exists`,
                            });
                        }
                    } else {
                        sendResponse(res, 400, { error: "Invalid ID" });
                    }
                }
                break;
            }
            case METHODS.POST: {
                if (req.url !== baseURL) {
                    sendResponse(res, 400, {
                        error: "No such opportunity at this URL",
                    });
                } else {
                    let body = "";
                    req.on("data", (data) => {
                        body += data.toString();
                    });
                    req.on("end", () => {
                        const result = DATABASE.addUser(JSON.parse(body));
                        if (result.error) {
                            sendResponse(res, 400, result);
                        } else {
                            sendResponse(res, 201, result);
                        }
                    });
                }
                break;
            }
            case METHODS.PUT: {
                if (isIDValid(id)) {
                    let body = "";
                    req.on("data", (data) => {
                        body += data.toString();
                    });
                    req.on("end", () => {
                        const result = DATABASE.updateUser(
                            id,
                            JSON.parse(body)
                        );
                        if (result.error) {
                            sendResponse(res, 404, result);
                        } else {
                            sendResponse(res, 200, result);
                        }
                    });
                } else {
                    sendResponse(res, 400, { error: "Invalid ID" });
                }
                break;
            }
            case METHODS.DELETE: {
                if (isIDValid(id)) {
                    if (DATABASE.deleteUser(id)) {
                        sendResponse(res, 204, {});
                    } else {
                        sendResponse(res, 404, {
                            error: `User with id ${id} doesn't exists`,
                        });
                    }
                } else {
                    sendResponse(res, 400, { error: "Invalid ID" });
                }
                break;
            }
            default: {
                sendResponse(res, 404, { error: "Page not found" });
            }
        }
    } catch (e) {
        let errMSG: string = "";
        if (e instanceof Error) {
            errMSG = e.message;
        }
        sendResponse(res, 500, { error: `Server error: ${errMSG}` });
    }
};

import { ServerResponse } from "http";

export function sendResponse(
    res: ServerResponse,
    status: number,
    body: object
) {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
}

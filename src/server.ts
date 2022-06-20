import http, { IncomingMessage, ServerResponse } from "node:http";
import "dotenv/config";
import { appService } from "./services/appService";

export const startServer = (): http.Server => {
    const server = http.createServer(
        (req: IncomingMessage, res: ServerResponse) => {
            appService(req, res);
        }
    );

    const PORT = process.env.PORT || 8080;
    const { pid } = process;
    server.listen(PORT, () => {
        console.log(`server is listening on ${PORT}, process id: ${pid}`);
    });
    return server;
};

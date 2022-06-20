import cluster from "node:cluster";
import { cpus } from "node:os";
import { startServer } from "./server";

const multi = () => {
    const { pid } = process;
    if (cluster.isPrimary) {
        console.log(`Primary ${pid} is starting`);
        for (let i = 0; i < cpus().length; i++) {
            cluster.fork();
        }

        cluster.on("exit", (worker, _, __) => {
            console.log(`Worker ${worker.process.pid} died`);
        });
    } else {
        startServer();
    }
};

multi();

const app = require("./app");
const connectDatabase = require("./config/db");
const { port } = require("./config/env");

const {
    connectRabbitMQ,
} = require("./config/rabbitmq");

const startServer = async () => {
    try {
        await connectDatabase();

        await connectRabbitMQ();

        app.listen(
            port,
            () => {
                console.log(
                    `Server running on port ${port}`
                );
            }
        );
    } catch (error) {
        console.error(
            "Server startup failed:",
            error
        );

        process.exit(1);
    }
};

startServer();
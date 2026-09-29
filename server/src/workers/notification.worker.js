const connectDatabase =
    require("../config/db");

const {
    connectRabbitMQ,
} = require("../config/rabbitmq");

const {
    startNotificationConsumer,
} = require("../modules/notifications/notification.consumer");

const startWorker = async () => {
    await connectDatabase();
    await connectRabbitMQ();
    await startNotificationConsumer();

    console.log(
        "Notification worker started"
    );
};

startWorker().catch((error) => {
    console.error(
        "Notification worker startup failed:",
        error
    );
    process.exit(1);
});

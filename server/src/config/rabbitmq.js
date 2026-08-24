const amqp =
    require("amqplib");

let connection = null;
let channel = null;

const connectRabbitMQ =
    async () => {
        if (channel) {
            return channel;
        }

        const url =
            process.env.RABBITMQ_URL ||
            "amqp://localhost:5672";

        connection =
            await amqp.connect(url);

        channel =
            await connection.createChannel();

        await channel.assertExchange(
            "lastmile.events",
            "topic",
            {
                durable: true,
            }
        );

        console.log(
            "RabbitMQ connected"
        );

        return channel;
    };

const getChannel = () => {
    if (!channel) {
        throw new Error(
            "RabbitMQ is not connected"
        );
    }

    return channel;
};

module.exports = {
    connectRabbitMQ,
    getChannel,
};
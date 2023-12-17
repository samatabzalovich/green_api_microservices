const amqp = require('amqplib');

async function processQueue() {
    try {
        const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const inputQueue = 'inputQueue';
    const outputQueue = 'outputQueue';

    channel.assertQueue(inputQueue, { durable: false });
    channel.assertQueue(outputQueue, { durable: false });

    console.log(`Microservice 2: Waiting for messages. To exit press CTRL+C`);
    process.once("SIGINT", async () => {
        await channel.close();
        await connection.close();
    });
    channel.consume(inputQueue, (msg) => {
    if (msg !== null) {
        const receivedNumber = parseInt(msg.content.toString());
        const result = receivedNumber * 2;
        setTimeout(() => {
            console.log(`Microservice 2: Received number: ${receivedNumber}, SENDING Result: ${result}`);
        channel.sendToQueue(outputQueue, Buffer.from(result.toString()));
        }, 5000);
        
    }
    }, { noAck: true });
    } catch (error) {
        console.warn(error);
    }
}

module.exports = processQueue;

const amqp = require('amqplib')
async function producer (inputNumber) {
  let connection
  try {
    const inputQueue = 'inputQueue'
    const outputQueue = 'outputQueue'
    connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    process.once('SIGINT', async () => {
      await channel.close()
      await connection.close()
    })
    await channel.assertQueue(inputQueue, { durable: false })
    
    channel.sendToQueue(inputQueue, Buffer.from(JSON.stringify(inputNumber)))
    console.log(" [x] Sent '%s'", inputNumber)
    channel.consume(outputQueue, msg => {
      if (msg !== null) {
        const result = parseInt(msg.content.toString())
        console.log(
          `Microservice 1: Received result from Microservice 2: ${result}`
        )
      }
    }, { noAck: true });
  } catch (err) {
    console.warn(err)
  }
}

module.exports = producer

const { Consumer, Producer, Kafka, logLevel } = require("kafkajs");

class KafkaMessageBroker {
  constructor(config = {}) {
    this.clientId = config.clientId || "my-app";
    this.groupId = config.groupId || "my-group";
    this.brokers = config.brokers || ["localhost:9092"];
    this.sessionTimeout = config.sessionTimeout || 10000,
    this.heartbeatInterval= config.heartbeatInterval ||3000, 
    this.topics = config.topics || ["UserEvent"];

    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
      // logLevel: logLevel.INFO
    });
    this.producer = null;
    this.consumer = null;
  }

  async createTopics(topics) {
    const topicConfigs = topics.map(t => ({
      topic: t,
      numPartitions: 2,
      replicationFactor: 1 // based on available broker
    }));

    const admin = this.kafka.admin();
    const topicExists = await admin.listTopics();

    for (const t of topicConfigs) {
      if (!topicExists.includes(t.topic)) {
        await admin.createTopics({
          topics: [t]
        });
      }
    }
    await admin.disconnect();
  }

  async connectProducer() {
    await this.createTopics(this.topics);

    if (this.producer) {
      return this.producer;
    }

    this.producer = this.kafka.producer();
    await this.producer.connect();
    return this.producer;
  }

  async disconnectProducer() {
    if (this.producer) {
      await this.producer.disconnect();
    }
  }

  async publish(data) {
    const producer = await this.connectProducer();
    const result = await producer.send({
      topic: data.topic,
      messages: [
        {
          headers: data.headers,
          key: data.event,
          value: JSON.stringify(data.message)
        }
      ],
      acks: 1 
    });
    return result;
  }

  async connectConsumer() {
    if (this.consumer) {
      return this.consumer;
    }
    this.consumer = this.kafka.consumer({ 
      groupId: this.groupId,
      sessionTimeout: this.sessionTimeout, // Example value, adjust as needed
      heartbeatInterval: this.heartbeatInterval, // Example value, adjust as needed
      autoOffsetReset: 'earliest', // Start reading from the beginning if no offset is found
     });
    await this.consumer.connect();
    return this.consumer;
  }

  async disconnectConsumer() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }

  async subscribe(messageHandler, topic) {
    const consumer = await this.connectConsumer();
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // if (topic !== "UserEvent") {
        //   return;
        // }
        if (message.key && message.value) {
          const inputMessage = {
            headers: message.headers,
            event: message.key.toString(),
            data: message.value ? JSON.parse(message.value.toString()) : null
          };
          await messageHandler(inputMessage);
          await consumer.commitOffsets([
            { topic, partition, offset: (Number(message.offset) + 1).toString() }
          ]);
        }
      },
    });
    return consumer;
  }
}

module.exports = KafkaMessageBroker;

// test/exampleUsage.js
const KafkaMessageBroker = require('../src/KafkaMessageBroker');

const config = {
  clientId: 'custom-app',
  groupId: 'custom-group',
  brokers: ['localhost:9092']
};

const broker = new KafkaMessageBroker(config);

const messageHandler = async (message) => {
  console.log('Received message:', message);
};

// Example usage
(async () => {
  await broker.publish({
    topic: 'UserEvent',
    headers: { 'content-type': 'application/json' },
    event: 'user_create',
    message: { userId: 1, name: 'John Doe' }
  });

  await broker.subscribe(messageHandler, 'UserEvent');
})();

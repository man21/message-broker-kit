# KafkaMessageBroker

`message-broker-kit` is a simple and flexible Kafka client for managing both producers and consumers. This package provides an easy-to-use API for publishing and subscribing to Kafka topics, including automatic topic creation and offset management.

## Installation

To install the package, use npm:

```bash
npm install message-broker-kit

## Usage
Configuration

You can configure the KafkaMessageBroker with various options:

```javascript
const KafkaMessageBroker = require('message-broker-kit');

const kafkaConfig = {
  clientId: 'my-app',
  groupId: 'my-group',
  brokers: ['localhost:9092'],
  sessionTimeout: 10000,
  heartbeatInterval: 3000,
  topics: ['UserEvent']
};

const broker = new KafkaMessageBroker(kafkaConfig);
```


## Creating Topics
Create topics if they don't already exist:

```javascript
await broker.createTopics(['event1', 'event2']);
```

## Publishing Messages
Publish messages to a topic:

```javascript
const message = {
  topic: 'UserEvent',
  headers: { key: 'value' },
  event: 'event-key',
  message: { key: 'value' }
};

await broker.publish(message);
```

## Subscribing to Topics
Subscribe to a topic and handle incoming messages:

```javascript
const messageHandler = async (message) => {
  console.log('Received message:', message);
};

await broker.subscribe(messageHandler, 'UserEvent');
```

## Methods

### `constructor(config)`

Initializes the Kafka client with the provided configuration.

**Parameters:**
- `config` (Object): Configuration options for the Kafka client. It includes properties like `clientId`, `groupId`, `brokers`, `sessionTimeout`, `heartbeatInterval`, and `topics`.

### `createTopics(topics)`

Creates topics if they do not exist.

**Parameters:**
- `topics` (Array): An array of topic names to be created.

### `connectProducer()`

Connects the Kafka producer.

**Returns:**
- `Promise`: Resolves to the Kafka producer instance.

### `disconnectProducer()`

Disconnects the Kafka producer.

**Returns:**
- `Promise`: Resolves when the Kafka producer has been disconnected.

### `publish(data)`

Publishes a message to a topic.

**Parameters:**
- `data` (Object): The message data to be published. It includes:
  - `topic` (String): The name of the topic.
  - `headers` (Object): Optional headers for the message.
  - `event` (String): The key for the message.
  - `message` (Object): The message payload.

**Returns:**
- `Promise`: Resolves with the result of the publish operation.

### `connectConsumer()`

Connects the Kafka consumer.

**Returns:**
- `Promise`: Resolves to the Kafka consumer instance.

### `disconnectConsumer()`

Disconnects the Kafka consumer.

**Returns:**
- `Promise`: Resolves when the Kafka consumer has been disconnected.

### `subscribe(messageHandler, topic)`

Subscribes to a topic and processes incoming messages using the provided handler.

**Parameters:**
- `messageHandler` (Function): A function to handle incoming messages. It receives an object containing `headers`, `event`, and `data`.
- `topic` (String): The name of the topic to subscribe to.

**Returns:**
- `Promise`: Resolves when the subscription is complete and the consumer starts processing messages.


## Contributing
Feel free to open issues or pull requests to contribute to the project.


This format will ensure that the configuration and usage examples are properly highlighted in the `README.md` file.





# Message Queue Module for Baileys WhatsApp Integration

## Overview
This module implements a professional, scalable, and persistent asynchronous message queue for sending WhatsApp messages using the Baileys library. It replaces direct calls to `sock.sendMessage()` with a queue-based system that ensures reliable message delivery with retries, delays, and logging.

## Features
- Uses BullMQ with Redis for persistence and job management.
- FIFO message processing with concurrency set to 1.
- Configurable delay between messages with optional randomization to simulate human behavior.
- Automatic retries with exponential backoff on failures.
- Structured logging of message sends, errors, and retries.
- Clean integration with Baileys socket.
- Optional Bull Board dashboard for visual monitoring of the queue.
- Easy integration with existing message handlers via `enqueueMessage(jid, message)`.

## Integration Instructions

### Redis Installation and Configuration

#### Local Installation
- Install Redis locally:
  - On Windows, use [Memurai](https://www.memurai.com/) or [Redis on WSL](https://docs.microsoft.com/en-us/windows/wsl/install).
  - On macOS, use `brew install redis`.
  - On Linux, use your package manager, e.g., `sudo apt install redis-server`.
- Start Redis server locally (default port 6379).
- Ensure Redis is running before starting the backend.

#### Production Setup
- Use a managed Redis service (e.g., AWS ElastiCache, Azure Redis Cache).
- Configure `redisUrl` in `config/config.js` to point to your Redis instance.

### Using the Message Queue

- The queue is automatically registered with the Baileys socket in `connectionManager.js` via `registerProcessor(botInstance)`.
- Replace all direct `botInstance.sendMessage()` calls in handlers with `enqueueMessage(jid, message)`.
- Example:
  ```js
  import { enqueueMessage } from '../messageQueue.js';
  await enqueueMessage(userId, { text: 'Your message here' });
  ```

### Running Bull Board Dashboard

- The message queue module includes optional Bull Board integration.
- To start the dashboard, call `startDashboard(port)` from your backend entry point or a dedicated admin server.
- Default port is 3001.
- Access the dashboard at `http://localhost:3001/admin/queues`.
- You can also integrate the dashboard router into an existing Express app using `getDashboardRouter()`.

### Scaling to Multiple Processes

- BullMQ with Redis supports multiple workers.
- To scale, run multiple instances of your backend with the same Redis configuration.
- The queue ensures messages are processed once in FIFO order.
- Adjust concurrency in `messageQueue.js` if needed.

## Summary

This message queue system improves reliability, scalability, and observability of WhatsApp message sending in your backend. It integrates seamlessly with Baileys and your existing modular architecture.

For any questions or issues, please refer to the code comments or contact the development team.

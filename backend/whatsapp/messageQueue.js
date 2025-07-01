/**
 * messageQueue.js
 * 
 * Implements an asynchronous, persistent, and scalable message queue for sending WhatsApp messages using Baileys.
 * Uses BullMQ with Redis for persistence, supports FIFO processing, configurable delays with randomization,
 * automatic retries with exponential backoff, and structured logging.
 * Optionally integrates Bull Board for visual monitoring.
 */

const Queue = require('bull');
const IORedis = require('ioredis');
const { logInfo, logError } = require('./utils.js');
const config = require('../config/config.js');

const redisConnection = new IORedis(config.redisUrl || 'redis://127.0.0.1:6379');

const queueName = 'whatsapp-message-queue';

// Create the message queue
const messageQueue = new Queue(queueName, {
  redis: redisConnection,
  defaultJobOptions: {
    attempts: config.messageQueue?.maxRetries || 5,
    backoff: {
      type: 'exponential',
      delay: config.messageQueue?.initialBackoffMs || 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Variables to hold the Baileys socket instance and processing state
let sock = null;

/**
 * Enqueue a message to be sent.
 * @param {string} jid - The WhatsApp JID to send the message to.
 * @param {object} message - The message object as expected by Baileys sendMessage.
 * @returns {Promise<Job>} The Bull job instance.
 */
async function enqueueMessage(jid, message) {
  if (!jid || !message) {
    throw new Error('jid and message are required to enqueue a message');
  }
  const job = await messageQueue.add('sendMessage', { jid, message });
  logInfo(`Enqueued message to ${jid} with job id ${job.id}`);
  return job;
}

/**
 * Register the Baileys socket instance to process the message queue.
 * @param {object} baileysSock - The active Baileys socket instance.
 */
function registerProcessor(baileysSock) {
  if (!baileysSock) {
    throw new Error('Baileys socket instance is required to register processor');
  }
  sock = baileysSock;

  // Process jobs from the queue
  messageQueue.process('sendMessage', async (job) => {
    const { jid, message } = job.data;

    // Configurable delay with randomization to simulate human behavior
    const baseDelayMs = config.messageQueue?.baseDelayMs || 1000;
    const randomizeDelay = config.messageQueue?.randomizeDelay ?? true;
    let delayMs = baseDelayMs;
    if (randomizeDelay) {
      delayMs = baseDelayMs + Math.floor(Math.random() * baseDelayMs);
    }

    logInfo(`Processing job ${job.id} to send message to ${jid} after delay ${delayMs}ms`);

    // Wait for the delay before sending
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    try {
      await sock.sendMessage(jid, message);
      logInfo(`Message sent successfully to ${jid} for job ${job.id}`);
      return Promise.resolve();
    } catch (error) {
      logError(`Error sending message to ${jid} for job ${job.id}: ${error.message}`);
      return Promise.reject(error); // Trigger retry with backoff
    }
  });

  messageQueue.on('completed', (job) => {
    logInfo(`Job ${job.id} completed successfully.`);
  });

  messageQueue.on('failed', (job, err) => {
    logError(`Job ${job.id} failed with error: ${err.message}`);
  });

  logInfo('Message queue processor registered and worker started.');
}

/**
 * Optional: Function to close the queue gracefully.
 */
async function shutdown() {
  await messageQueue.close();
  await redisConnection.quit();
  logInfo('Message queue and Redis connection closed.');
}

module.exports = {
  enqueueMessage,
  registerProcessor,
  shutdown,
  messageQueue,
};

const amqp = require('amqplib');
const queue = "task_queue";
const consumer = require('./consumer');

consumer();
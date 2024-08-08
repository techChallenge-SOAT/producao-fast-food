import { sqs } from '../../config/sqs';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function processPayment(productionData: any) {
  await axios.post(
    `${process.env.PRODUCAO_FAST_FOOD_URL}/pedido`,
    productionData,
  );
}

export async function pollQueue() {
  const params = {
    QueueUrl: process.env.SQS_RECEIVE_TO_PRODUCTION!,
    MaxNumberOfMessages: 10,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 10,
  };

  const data = await sqs.receiveMessage(params).promise();
  if (data.Messages) {
    for (const message of data.Messages) {
      if (message.ReceiptHandle && message.Body) {
        const productionData = JSON.parse(message.Body);
        await processPayment(productionData);
        await sqs
          .deleteMessage({
            QueueUrl: process.env.SQS_RECEIVE_TO_PRODUCTION!,
            ReceiptHandle: message.ReceiptHandle!,
          })
          .promise();
      }
    }
  }
}

setInterval(pollQueue, 5000);

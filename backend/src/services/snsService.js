import { SNSClient, PublishCommand, SubscribeCommand } from '@aws-sdk/client-sns';

const REGION = process.env.AWS_REGION || 'us-east-1';
const TOPIC_ARN = process.env.SNS_TOPIC_ARN || 'arn:aws:sns:us-east-1:654524017474:CloudMart360-OrderUpdates';

const snsClient = new SNSClient({ region: REGION });

export const snsService = {
  getTopicArn() {
    return TOPIC_ARN;
  },

  async subscribeCustomer(email) {
    if (!email || !email.includes('@')) return null;
    try {
      const command = new SubscribeCommand({
        TopicArn: TOPIC_ARN,
        Protocol: 'email',
        Endpoint: email.trim().toLowerCase()
      });
      const res = await snsClient.send(command);
      console.log(`[SNS] Subscribed customer email ${email} to topic. SubscriptionArn:`, res.SubscriptionArn);
      return res;
    } catch (err) {
      console.warn(`[SNS] Could not subscribe ${email}:`, err.message);
      return null;
    }
  },

  async publishOrderConfirmation(order) {
    try {
      const subject = `Order Confirmed #${order.orderId || 'CM360'} - CloudMart 360`;
      const itemsList = (order.items && order.items.length > 0)
        ? order.items.map((it, idx) => `  ${idx + 1}. ${it.product?.name || 'Item'} (Qty: ${it.quantity || 1}) - $${Number(it.product?.price || 0).toFixed(2)} each`).join('\n')
        : '  1. Catalog Order Items';

      const message = `
======================================================
  CLOUDMART 360 - ORDER CONFIRMATION & PAYMENT APPROVED
======================================================

Dear ${order.customer || 'Customer'},

Thank you for shopping with CloudMart 360! Your payment was successfully authorized and your order is confirmed.

------------------------------------------------------
ORDER DETAILS:
------------------------------------------------------
Order Reference:  ${order.orderId}
Order Date:       ${order.date || new Date().toLocaleString()}
Payment Method:   ${order.paymentMethod || 'Credit / Debit Card (Verified)'}
Total Amount:     $${Number(order.grandTotal || 0).toFixed(2)}
Fulfillment Hub:  CloudMart 360 Primary US-East Center

------------------------------------------------------
SHIPPING & TRACKING:
------------------------------------------------------
Carrier:          ${order.carrier || 'FedEx Express Worldwide'}
Tracking Number:  ${order.trackingNumber || 'FDX-88291049210'}
Delivery Address: ${order.address || 'Standard Destination'}
Initial Status:   ${order.status || 'Processing'}

------------------------------------------------------
PURCHASED ITEMS:
------------------------------------------------------
${itemsList}

We will notify you via Amazon SNS as your package moves through dispatch and final delivery.

Thank you for choosing CloudMart 360!
AWS Serverless Architecture | Amazon SNS Notifications
`;

      const command = new PublishCommand({
        TopicArn: TOPIC_ARN,
        Subject: subject.slice(0, 100),
        Message: message
      });

      const res = await snsClient.send(command);
      console.log(`[SNS] Published Order Confirmation email for #${order.orderId}. MessageId:`, res.MessageId);
      return res;
    } catch (err) {
      console.error('[SNS] Failed to publish order confirmation:', err.message);
      return null;
    }
  },

  async publishDeliveryUpdate(orderId, newStatus, order = {}) {
    try {
      const subject = `Delivery Update: #${orderId} is now ${newStatus} - CloudMart 360`;
      const message = `
======================================================
  CLOUDMART 360 - DELIVERY STATUS UPDATE
======================================================

Dear ${order.customer || 'Valued Customer'},

Your order #${orderId} has advanced to a new delivery stage:

  CURRENT STATUS:  >>> ${newStatus.toUpperCase()} <<<

------------------------------------------------------
LOGISTICS DETAILS:
------------------------------------------------------
Order Reference:  ${orderId}
Carrier:          ${order.carrier || 'FedEx Express Worldwide'}
Tracking Number:  ${order.trackingNumber || 'FDX-88291049210'}
Destination:      ${order.address || 'Destination on file'}
Updated At:       ${new Date().toLocaleString()}

You can track your order in real time on the CloudMart 360 Storefront.

Thank you for choosing CloudMart 360!
AWS Serverless Architecture | Amazon SNS Notifications
`;

      const command = new PublishCommand({
        TopicArn: TOPIC_ARN,
        Subject: subject.slice(0, 100),
        Message: message
      });

      const res = await snsClient.send(command);
      console.log(`[SNS] Published Delivery Status update for #${orderId} (${newStatus}). MessageId:`, res.MessageId);
      return res;
    } catch (err) {
      console.error('[SNS] Failed to publish status update:', err.message);
      return null;
    }
  }
};

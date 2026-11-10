import { ticketsService } from '../db.js';

export async function getTicketsHandler(event) {
  try {
    const tickets = await ticketsService.getAllTickets();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        count: tickets.length,
        tickets,
        databaseTable: ticketsService.getTableName(),
        storageEngine: ticketsService.isUsingAWS() ? 'Amazon DynamoDB' : 'Local DocumentClient'
      })
    };
  } catch (err) {
    console.error('[GetTicketsHandler] Error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to retrieve support tickets from DynamoDB',
        details: err.message
      })
    };
  }
}

export async function createTicketHandler(event) {
  try {
    const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {};

    if (!body.name || !body.email || !body.message) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: 'Name, email, and message are required' })
      };
    }

    const savedTicket = await ticketsService.createTicket(body);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: `Support Ticket #${savedTicket.ticketId} logged in DynamoDB table: ${ticketsService.getTableName()}`,
        ticket: savedTicket,
        databaseTable: ticketsService.getTableName()
      })
    };
  } catch (err) {
    console.error('[CreateTicketHandler] Error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to persist support ticket in DynamoDB',
        details: err.message
      })
    };
  }
}

export async function updateTicketStatusHandler(event) {
  try {
    const ticketId = event.pathParameters?.id || event.params?.id;
    const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {};
    const { status } = body;

    if (!ticketId || !status) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: 'Missing ticketId or status' })
      };
    }

    const updated = await ticketsService.updateTicketStatus(ticketId, status);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: `Support Ticket #${ticketId} status updated to '${status}' in DynamoDB`,
        ticket: updated
      })
    };
  } catch (err) {
    console.error('[UpdateTicketStatusHandler] Error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to update support ticket in DynamoDB',
        details: err.message
      })
    };
  }
}


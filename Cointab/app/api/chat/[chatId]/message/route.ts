import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { OllamaClient } from '@/lib/ollama';

const ollamaClient = new OllamaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = parseInt(params.chatId);
    const { message } = await request.json();
    
    // Save user message
    await pool.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
      [chatId, 'user', message]
    );
    
    // Update chat timestamp
    await pool.query(
      'UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [chatId]
    );
    
    // Generate title if this is the first message
    const messageCount = await pool.query(
      'SELECT COUNT(*) as count FROM messages WHERE chat_id = $1',
      [chatId]
    );
    
    if (parseInt(messageCount.rows[0].count) === 1) {
      // Auto-generate title from first message
      const title = message.length > 50 ? message.substring(0, 47) + '...' : message;
      await pool.query(
        'UPDATE chats SET title = $1 WHERE id = $2',
        [title, chatId]
      );
    }
    
    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';
          
          for await (const chunk of ollamaClient.generateStream(message)) {
            fullResponse += chunk;
            controller.enqueue(`data: ${JSON.stringify({ chunk, done: false })}\n\n`);
          }
          
          // Save assistant response
          await pool.query(
            'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
            [chatId, 'assistant', fullResponse]
          );
          
          controller.enqueue(`data: ${JSON.stringify({ chunk: '', done: true })}\n\n`);
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
          controller.close();
        }
      },
    });
    
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

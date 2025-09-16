import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = parseInt(params.chatId);
    
    // Get chat details
    const chatResult = await pool.query('SELECT * FROM chats WHERE id = $1', [chatId]);
    
    if (chatResult.rows.length === 0) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    // Get messages
    const messagesResult = await pool.query(
      'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [chatId]
    );
    
    return NextResponse.json({
      chat: chatResult.rows[0],
      messages: messagesResult.rows,
    });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = parseInt(params.chatId);
    
    await pool.query('DELETE FROM chats WHERE id = $1', [chatId]);
    
    return NextResponse.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = parseInt(params.chatId);
    const { title } = await request.json();
    
    const result = await pool.query(
      'UPDATE chats SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [title, chatId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json({ error: 'Failed to update chat' }, { status: 500 });
  }
}

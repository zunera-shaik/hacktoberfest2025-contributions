import { NextRequest, NextResponse } from 'next/server';
import getDatabase from '@/lib/sqlite-db';

export async function GET() {
  try {
    const db = getDatabase();
    
    const chats = db.prepare(`
      SELECT c.*, 
             COUNT(m.id) as message_count,
             MAX(m.created_at) as last_message_at
      FROM chats c
      LEFT JOIN messages m ON c.id = m.chat_id
      GROUP BY c.id
      ORDER BY c.updated_at DESC
    `).all();
    
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDatabase();
    const { title = 'New Chat' } = await request.json();
    
    const result = db.prepare(
      'INSERT INTO chats (title) VALUES (?) RETURNING *'
    ).get(title);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}

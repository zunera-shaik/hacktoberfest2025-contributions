import { NextRequest, NextResponse } from 'next/server';
import { OllamaClient } from '@/lib/ollama';

const ollamaClient = new OllamaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    ollamaClient.stopGeneration();
    return NextResponse.json({ message: 'Generation stopped' });
  } catch (error) {
    console.error('Error stopping generation:', error);
    return NextResponse.json({ error: 'Failed to stop generation' }, { status: 500 });
  }
}

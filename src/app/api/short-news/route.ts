import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// GET all short news
export async function GET(request: NextRequest) {
  try {
    // Check for authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/short-news`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching short news:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST new short news
export async function POST(request: NextRequest) {
  try {
    // Check for authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('POST /api/short-news - Body:', body);
    console.log('Backend URL:', BACKEND_URL);

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/short-news`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const responseText = await response.text();
    console.log('Backend response status:', response.status);
    console.log('Backend response:', responseText);

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}: ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data, { status: 201 });
    } catch (parseError) {
      console.error('Failed to parse backend response:', parseError);
      throw new Error('Invalid JSON response from backend');
    }
  } catch (error) {
    console.error('Error creating short news:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
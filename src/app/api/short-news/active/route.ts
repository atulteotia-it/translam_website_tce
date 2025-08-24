import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// GET active short news (public endpoint, no authentication required)
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/short-news/active`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching active short news:', error);
    // Return empty array on error so ticker still works
    return NextResponse.json({ shortNews: [] });
  }
}
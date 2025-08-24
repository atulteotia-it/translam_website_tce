import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// GET gallery data (public endpoint, no authentication required)
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/gallery`, {
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
    console.error('Error fetching gallery data:', error);
    // Return default gallery structure on error
    return NextResponse.json({
      heroImage: '/images/commonBanner.png',
      heroTitle: 'Gallery',
      sections: []
    });
  }
}
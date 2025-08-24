import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// GET events data (public endpoint, no authentication required)
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/events`, {
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
    console.error('Error fetching events data:', error);
    // Return default events structure on error
    return NextResponse.json({
      id: 1,
      slug: 'events',
      title: 'Events',
      content: '<p>Explore our latest events and activities.</p>',
      bannerImage: '/images/commonBanner.png',
      sections: []
    });
  }
}
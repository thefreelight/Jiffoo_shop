import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

// Configure the API route
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Define allowed methods
export async function POST(req: Request) {
  try {
    const { email = 'jordan@lafdru.com' } = await req.json();
    console.log('Sending test email to:', email);
    
    const result = await sendWelcomeEmail(email, 'Jordan');
    
    console.log('Test email result:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result
    });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const email = 'jordan@lafdru.com';
    console.log('Sending test email to:', email);
    
    const result = await sendWelcomeEmail(email, 'Jordan');
    
    console.log('Test email result:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result
    });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 
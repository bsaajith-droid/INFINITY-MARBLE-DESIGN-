import { NextRequest, NextResponse } from 'next/server';

interface QuotationRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  productType: string;
  quantity: string;
  details: string;
  timeline?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuotationRequest = await request.json();

    // Validate required fields
    const { name, email, phone, productType, quantity, details } = body;
    
    if (!name || !email || !phone || !productType || !quantity || !details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // TODO: Integrate with email service (e.g., SendGrid, Resend, Nodemailer)
    // TODO: Store quotation in database
    // TODO: Send confirmation email

    console.log('Quotation request received:', {
      name,
      email,
      phone,
      company: body.company,
      productType,
      quantity,
      details,
      timeline: body.timeline,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Quotation request received successfully. We will contact you shortly.',
        requestId: `QT-${Date.now()}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing quotation request:', error);
    return NextResponse.json(
      { error: 'Failed to process quotation request' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

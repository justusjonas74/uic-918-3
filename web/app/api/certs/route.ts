import { NextResponse } from 'next/server';
import { listCertificates } from 'uic-918-3';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const certs = listCertificates();
    return NextResponse.json({ success: true, certs });
  } catch (error: any) {
    console.error('Failed to list certificates:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to list certificates' }, { status: 500 });
  }
}

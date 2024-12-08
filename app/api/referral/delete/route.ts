import { NextResponse } from 'next/server';
import { getServerSession as getServerSessionHelper } from 'next-auth/next';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';
import type { Session } from 'next-auth';

export async function DELETE(req: Request) {
  try {
    const session = await getServerSessionHelper(authOptions) as Session | null;
// ... existing code ...
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
} 
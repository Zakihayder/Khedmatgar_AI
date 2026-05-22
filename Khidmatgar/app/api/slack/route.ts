import { NextResponse } from 'next/server';
import { notifyNewSignup, notifyUserLogin, notifyBookingCreated, notifySystemAlert } from '@/lib/slack';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, ...params } = body;

    let result;
    switch (type) {
      case 'signup':
        result = await notifyNewSignup(params);
        break;
      case 'login':
        result = await notifyUserLogin(params);
        break;
      case 'booking':
        result = await notifyBookingCreated(params);
        break;
      case 'alert':
        result = await notifySystemAlert(params);
        break;
      default:
        return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

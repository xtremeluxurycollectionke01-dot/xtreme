/*import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { fcmToken } = await req.json();
    
    if (!fcmToken) {
      return NextResponse.json(
        { error: "FCM token required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Add FCM token to user's tokens array
    await User.findByIdAndUpdate(session._id, {
      $addToSet: { fcmTokens: fcmToken }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { fcmToken } = await req.json();

    await dbConnect();

    // Remove FCM token from user
    await User.findByIdAndUpdate(session._id, {
      $pull: { fcmTokens: fcmToken }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}*/
//C:\Users\Administrator\Desktop\xtreme\app\api\notifications\register-token\route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const user = await requireAuth(req);

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { fcmToken } = await req.json();

    if (!fcmToken) {
      return NextResponse.json(
        { error: "FCM token required" },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { fcmTokens: fcmToken },
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendTwilioOtp } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();

    // Check if phone number is already registered and verified
    const existingUser = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (existingUser && existingUser.phoneVerified) {
      return NextResponse.json(
        { error: "This phone number is already registered." },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Delete any existing OTPs for this number
    await prisma.otp.deleteMany({
      where: { email: cleanPhone }, // Storing phone number in the 'email' field of Otp table
    });

    // Save OTP to DB
    await prisma.otp.create({
      data: {
        email: cleanPhone,
        code: otp,
        expiresAt,
      },
    });

    // Send SMS OTP via Twilio
    const smsResult = await sendTwilioOtp(cleanPhone, otp);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully.",
        mock: smsResult.mock,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Twilio send-otp API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during OTP generation." },
      { status: 500 }
    );
  }
}

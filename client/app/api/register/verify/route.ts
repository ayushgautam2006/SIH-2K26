import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();

    // Find the latest OTP record for this email
    const otpRecord = await prisma.otp.findFirst({
      where: {
        email: emailLower,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "No verification code has been sent to this email." },
        { status: 400 }
      );
    }

    // Check if expired
    const isExpired = new Date() > otpRecord.expiresAt;
    if (isExpired) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Validate code
    if (otpRecord.code !== otp) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email: emailLower },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete all OTPs for this email
    await prisma.otp.deleteMany({
      where: { email: emailLower },
    });

    return NextResponse.json(
      { success: true, message: "Email verified successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during OTP verification." },
      { status: 500 }
    );
  }
}

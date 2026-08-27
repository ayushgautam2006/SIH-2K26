import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email. Please register first." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "This email is already verified. Please sign in." },
        { status: 400 }
      );
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Delete existing OTPs for this email
    await prisma.otp.deleteMany({
      where: { email: emailLower },
    });

    // Save new OTP
    await prisma.otp.create({
      data: {
        email: emailLower,
        code: otp,
        expiresAt,
      },
    });

    // Send new OTP email
    await sendOtpEmail(emailLower, otp);

    return NextResponse.json(
      { success: true, message: "A new verification code has been sent to your email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while resending the code." },
      { status: 500 }
    );
  }
}

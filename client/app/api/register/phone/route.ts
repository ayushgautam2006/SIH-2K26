import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, phone, password, otp } = await req.json();

    if (!name || !phone || !password || !otp) {
      return NextResponse.json(
        { error: "Please fill in all fields including the OTP." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();

    // Verify OTP against Database
    const otpRecord = await prisma.otp.findFirst({
      where: { email: cleanPhone },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "No verification code has been sent to this phone number." },
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

    // Check if user already exists with this phone number
    const existingUser = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (existingUser && existingUser.phoneVerified) {
      return NextResponse.json(
        { error: "This phone number is already registered." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      // Update existing user
      await prisma.user.update({
        where: { phone: cleanPhone },
        data: {
          name,
          password: hashedPassword,
          phoneVerified: new Date(),
        },
      });
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          name,
          phone: cleanPhone,
          password: hashedPassword,
          phoneVerified: new Date(),
        },
      });
    }

    // Delete all OTPs for this phone number
    await prisma.otp.deleteMany({
      where: { email: cleanPhone },
    });

    return NextResponse.json(
      { success: true, message: "Phone registration successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Phone registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during phone registration." },
      { status: 500 }
    );
  }
}

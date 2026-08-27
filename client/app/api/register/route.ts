import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please fill in all fields." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: "This email is already registered." },
          { status: 400 }
        );
      }
      // If user exists but is not verified, we can update their name and password
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { email: emailLower },
        data: {
          name,
          password: hashedPassword,
        },
      });
    } else {
      // Create user with null emailVerified
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          name,
          email: emailLower,
          password: hashedPassword,
          emailVerified: null,
        },
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Delete any existing OTP for this email
    await prisma.otp.deleteMany({
      where: { email: emailLower },
    });

    // Save OTP to DB
    await prisma.otp.create({
      data: {
        email: emailLower,
        code: otp,
        expiresAt,
      },
    });

    // Send OTP
    await sendOtpEmail(emailLower, otp);

    return NextResponse.json(
      { success: true, email: emailLower, message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}

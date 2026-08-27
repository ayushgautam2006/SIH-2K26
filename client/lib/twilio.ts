import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

export const isTwilioConfigured = () => {
  return (
    !!accountSid &&
    !!authToken &&
    !!fromPhone &&
    accountSid !== "" &&
    !accountSid.includes("placeholder")
  );
};

export const sendTwilioOtp = async (phone: string, otp: string) => {
  const body = `Your disaster response registration OTP is: ${otp}. Valid for 5 minutes.`;

  console.log("\n=========================================");
  console.log(`[TWILIO SMS SENDER]`);
  console.log(`To: ${phone}`);
  console.log(`Code: ${otp}`);
  console.log(`Expires: 5 minutes`);
  console.log("=========================================\n");

  if (!isTwilioConfigured()) {
    // Mock Mode
    return { success: true, mock: true };
  }

  try {
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body,
      from: fromPhone,
      to: phone,
    });
    return { success: true, mock: false };
  } catch (error) {
    console.error("Twilio SMS send error:", error);
    // In dev mode we return mock success so we don't break register flow
    if (process.env.NODE_ENV === "development") {
      return { success: true, mock: true, error: (error as Error).message };
    }
    throw error;
  }
};

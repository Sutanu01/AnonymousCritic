import connectToDatabase from "@/lib/db";
import UserModel from "@/models/User";

export const POST = async (request: Request): Promise<Response> => {
  await connectToDatabase();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    const isCodeValid =
      user.verifyCode === code && new Date(user.verifyCodeExpiry) > new Date();
    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid or expired verification code",
        },
        {
          status: 400,
        }
      );
    }
    user.isVerified = true;
    await user.save();
    return Response.json(
      {
        success: true,
        message: "User verified successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
};

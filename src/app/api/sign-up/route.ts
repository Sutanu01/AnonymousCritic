import connectToDatabase from "@/lib/db";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerficationEmail } from "@/helpers/sendVerificationEmail";

export const POST = async (request: Request): Promise<Response> => {
  await connectToDatabase();
  try {
    const { username, email, password } = await request.json();

    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json({
        success: false,
        message: "Username already exists. Please choose a different username.",
      });
    }

    const userExists = await UserModel.findOne({ email: email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (userExists) {
      if (userExists.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email. Please login.",
          },
          {
            status: 401,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        userExists.username = username;
        userExists.password = hashedPassword;
        userExists.verifyCode = verifyCode;
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        userExists.verifyCodeExpiry = expiryDate;
        await userExists.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        messages: [],
      });
    }

    // Send verification email
    const emailResponse = await sendVerficationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      success: true,
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Error Registering User : ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register user. Please try again later.",
      },
      { status: 500 }
    );
  }
};

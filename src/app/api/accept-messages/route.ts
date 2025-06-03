import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDatabase from "@/lib/db";
import UserModel from "@/models/User";

export const POST = async (req: Request) => {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const user: User = session?.user;
  const userId = user._id;
  const { acceptMessages } = await req.json();
  try {
    const userDetails = await UserModel.findById(userId);
    if (!userDetails) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    userDetails.isAcceptingMessages = acceptMessages;
    await userDetails.save();
    return Response.json(
      {
        success: true,
        message: "Status updated successfully",
        updatedUser: userDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating status:", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request) => {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const user: User = session?.user;
  const userId = user._id;
  try {
    const userDetails = await UserModel.findById(userId);
    if (!userDetails) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: userDetails.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating status:", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

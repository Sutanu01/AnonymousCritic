import { getServerSession, User } from "next-auth";
import connectToDatabase from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export const DELETE = async (
  request: Request,
  { params }: { params: { messageid: string } }
): Promise<Response> => {
  await connectToDatabase();
  const messageId = params.messageid;
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return Response.json(
      { success: false, message: "Invalid message ID" },
      { status: 400 }
    );
  }
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
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const updateResult = await UserModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }
    );
    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

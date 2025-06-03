import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDatabase from "@/lib/db";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export const GET = async (req: Request): Promise<Response> => {
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
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const userDetails = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if( !userDetails || userDetails.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found or no messages available",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: userDetails[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};

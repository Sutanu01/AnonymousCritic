import connectToDatabase from "@/lib/db";
import UserModel from "@/models/User";
import { z } from "zod";
import { UsernameValidation } from "@/schemas/SignUpSchema";

const usernameQuerySchema = z.object({
  username: UsernameValidation,
});

export const GET = async (request: Request): Promise<Response> => {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query format",
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result.data;
    const user = await UserModel.findOne({
      username: username,
      isVerified: true,
    });
    if (user) {
      return Response.json({
        success: false,
        message: "Username already taken",
      });
    }
    return Response.json({
      success: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
};

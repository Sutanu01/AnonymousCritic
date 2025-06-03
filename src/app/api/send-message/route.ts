import connectToDatabase from "@/lib/db";
import UserModel from "@/models/User";
import { Message } from "@/models/User";


export const POST = async (request: Request): Promise<Response> => {
    await connectToDatabase();
    const {username,content}=await request.json();
    try{
        const user = await UserModel.findOne({username});
        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }
        if(!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages",
                },
                { status: 403 }
            );
        }
        
        const newMessage = {
            content,
            createdAt: new Date(),
        }
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 200 }
        );
         
    }catch(error) {
        console.error("Error sending message:", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
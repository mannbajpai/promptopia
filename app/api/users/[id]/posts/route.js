import { connectToDatabase } from "@utils/db"
import Prompt from "@models/prompt";

export const GET = async (request, { params }) => {
    try {
        await connectToDatabase()

        const prompts = await Prompt
            .find({
                creator: params.id
            })
            .populate({
                path: 'creator',
                model: 'User'
            })

        return new Response(JSON.stringify(prompts), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
}
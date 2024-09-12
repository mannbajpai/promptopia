import { connectToDatabase } from "@utils/db"
import Prompt from "@models/prompt";

// GET
export const GET = async (request, { params }) => {
    try {
        await connectToDatabase()

        const prompt = await Prompt
            .findById(
                params.id
            )
            .populate({
                path: 'creator',
                model: 'User'
            })

        if (!prompt) {
            return new Response({status: 404, message:"No prompt found."})
        }

        return new Response(JSON.stringify(prompt), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch prompt", { status: 500, error:error })
    }
}

// PATCH
export const PATCH = async (request, {params}) => {
    const {prompt, tag} = await request.json();

    try {
        await connectToDatabase();

        // Find the existing prompt by ID
        const existingPrompt = await Prompt.findById(params.id);

        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Update the prompt with new data
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response("Successfully updated the Prompts", { status: 200 });
    } catch (error) {
        return new Response("Error Updating Prompt",{status: 500, error: error})
    }
}

// DELETE
export const DELETE = async (request, { params }) => {
    try {
        await connectToDatabase();

        // Find the prompt by ID and remove it
        await Prompt.findByIdAndRemove(params.id);

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting prompt", { status: 500, error });
    }
};
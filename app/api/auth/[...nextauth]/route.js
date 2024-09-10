import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { connectToDatabase } from "@utils/db"
import User from "@models/user"
const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId:process.env.OAUTH_CLIENT_ID,
            clientSecret:process.env.OAUTH_CLIENT_SECRET,
        })
    ],
    async session({session}){
        const sessionUser = await User.findOne({
            email: session.user.email
        });

        session.user.id = sessionUser._id.toString();

        return session;
    },
    async signIn({profile}){
        try {
            await connectToDatabase()

            // If user already exists
            const userExists = await User.findOne({
                email: profile.email
            });

            // If not, create a new user
            if (!userExists) {
                await User.create({
                    email: profile.email,
                    username: profile.name.replace(" ", "").toLowerCase(),
                    image: profile.picture
                })
            }

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
})

export {handler as GET, handler as POST}
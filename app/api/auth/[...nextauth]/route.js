import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import { connectToDatabase } from '@utils/db';

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL,
    providers: [
        GoogleProvider({
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async session({ session }) {
            // store the user id from MongoDB to session
            const sessionUser = await User.findOne({ email: session.user.email });
            session.user.id = sessionUser._id.toString();

            return session;
        },
        async signIn({ profile }) {
            try {
                await connectToDatabase();

                // check if user already exists
                const userExists = await User.findOne({ email: profile.email });

                // if not, create a new document and save user in MongoDB
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image: profile.picture,
                    });
                }

                return true;
            } catch (error) {
                console.log("Error checking if user exists: ", error.message);
                return false
            }
        },
    }
})

export { handler as GET, handler as POST }
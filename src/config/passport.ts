import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as GithubStrategy } from "passport-github2"
import prisma from "./db.js"

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_ID as string,
    callbackURL: process.env.GOOGLE_CALLBACK_URL as string
}, async (accessToken, refreshToken, profile, done) => {
    // step1. find if user is present in DB with this googleId 
    let user = await prisma.user.findUnique({
        where: { googleId: profile.id }
    })

    //handle error and create new user with googleId
    try {

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: profile.displayName || profile.username || "Github User",
                    email: profile.emails?.[0]?.value as string,
                    googleId: profile.id,
                    provider: "google",
                }
            })
        }

        return (
            done(null, user)
        )
    } catch (error) {
        return (
            done(error as Error, undefined)
        )
    }




}))

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: process.env.GITHUB_CALLBACK_URL as string
}, async (accessToken, refreshToken, profile: any, done: any) => {
    try {

        // step1. find user in DB with github profile id 
        let user = await prisma.user.findUnique({
            where: { githubId: profile.id }
        })

        //if user in not aslready present create new one
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value as string,
                    githubId: profile.id,
                    provider: "github"
                }
            })
        }

        return (
            done(null, user)
        )
    } catch (error) {
        console.log("error ->", error);

        return (
            done(error as Error, undefined)
        )
    }
}))

export default passport;
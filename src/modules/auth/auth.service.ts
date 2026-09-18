import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../../config/db.js"
import { AppError } from "../../utils/AppError.js"

const SALT_DIGIT = 10;
const JWT_SECRET = process.env.JWT_SECRET as string

export const registerUser = async (name: string, email: string, password: string) => {

    //check if user already exist with email
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        throw new AppError("User already Exist", 409)
    }

    //encrypt password
    const hashedPassword = await bcrypt.hash(password, SALT_DIGIT)

    // create new user in DB
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            provider: "manual"
        }
    })

    return (
        buildWithResponse(user.id, user.name, user.email)
    )
}

export const loginUser = async (email: string, password: string) => {

    // check if user already exist
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
        throw new AppError("Invalid Email or Password ", 401)
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Password not correct", 401)
    }

    return (
        buildWithResponse(user.id, user.email, user.name)
    )
}

const buildWithResponse = (userId: string, name: string, email: string,) => {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })

    return ({
        token,
        user: {
            id: userId,
            name,
            email
        }
    })
}
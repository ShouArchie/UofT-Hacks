"use server"

import { prisma } from "@/db"

export async function saveUser(name: string, email: string, password: string) {
    await prisma.user.create({
        data: {
            name, email, password
        }
    })
}
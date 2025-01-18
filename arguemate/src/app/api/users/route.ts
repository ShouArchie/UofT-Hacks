import { prisma } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
try {
    // Test a basic query
    const users = await prisma.user.findFirst();

    console.log(users);

    return NextResponse.json(
        {
          users: users
        },
        { status: 200 }
      );

    }catch(error) {
      if (error instanceof Error){
          console.log("Error: ", error.stack)
      }
  }
  
}

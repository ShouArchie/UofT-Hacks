import { prisma } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Test a basic query
    prisma.user.findFirst();
    
    return NextResponse.json({
      message: "Database connection successful",
    });
  } catch (error: any) {
    console.error("Error testing the database connection:", error);

    return NextResponse.json(
      {
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Assuming you have a user ID from the session
    // You'll need to implement authentication and get the actual user ID
    const userId = '...'; 

    const profile = await prisma.profile.create({
      data: {
        preferredName: data.preferredName,
        age: parseInt(data.age),
        gender: data.gender,
        city: data.city,
        bio: data.bio,
        userId: userId, // Link to user
      },
    });

    return NextResponse.json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error: any) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      {
        message: "Failed to create profile",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
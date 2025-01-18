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

// Handle unsupported HTTP methods if needed
export function POST() {
  return NextResponse.json(
    { message: "Method Not Allowed" },
    { status: 405 }
  );
}

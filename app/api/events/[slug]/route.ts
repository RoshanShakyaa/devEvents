import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import next from "next";
import { NextRequest, NextResponse } from "next/server";

type RouteParam = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: RouteParam) {
  try {
    await connectDB();
    const { slug } = await params;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 }
      );
    }

    const sanitizeSlug = slug.trim().toLowerCase();

    const event = await Event.findOne({ slug: sanitizeSlug }).lean();

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug ${sanitizeSlug} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Error fetching events by slug`, error);
    }

    if (error instanceof Error) {
      if (error.message.includes("MONGODB_URI")) {
        return NextResponse.json(
          { message: "Database configuration error" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: "Failed to fetch events", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

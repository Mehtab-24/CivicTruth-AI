import { NextRequest, NextResponse } from "next/server";
import { getTicketById } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const ticket = getTicketById(id);

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "TICKET_NOT_FOUND",
            message: `Ticket with ID '${id}' was not found.`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch ticket";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TICKET_FETCH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}

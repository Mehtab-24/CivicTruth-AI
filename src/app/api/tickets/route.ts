import { NextRequest, NextResponse } from "next/server";
import { getTickets, TicketStatus, TicketCategory } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wardParam = searchParams.get("wardNumber");
    const statusParam = searchParams.get("status") as TicketStatus | null;
    const categoryParam = searchParams.get("category") as TicketCategory | null;

    const filters = {
      wardNumber: wardParam ? parseInt(wardParam, 10) : undefined,
      status: statusParam || undefined,
      category: categoryParam || undefined,
    };

    const tickets = getTickets(filters);

    return NextResponse.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve tickets";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TICKET_QUERY_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}

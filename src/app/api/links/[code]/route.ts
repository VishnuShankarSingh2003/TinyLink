import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { deleteLink, getLinkByCode } from "@/lib/links";
import { isValidCode } from "@/lib/code";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const params = await context.params;
  const { code } = params;
  if (!isValidCode(code)) {
    return NextResponse.json({ message: "Invalid code." }, { status: 400 });
  }

  const link = await getLinkByCode(code);
  if (!link) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ data: link });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const params = await context.params;
  const { code } = params;
  if (!isValidCode(code)) {
    return NextResponse.json({ message: "Invalid code." }, { status: 400 });
  }

  try {
    await deleteLink(code);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to delete link." },
      { status: 500 },
    );
  }
}




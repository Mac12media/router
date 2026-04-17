import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { upsertPostSubmission } from "@/lib/data/post-submissions";
import { submitPostProfileSchema } from "@/lib/data/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id: postId } = await context.params;

  try {
    const body = await req.json();
    const parsed = submitPostProfileSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Invalid submission payload";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    await upsertPostSubmission(userId, postId, parsed.data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit profile" },
      { status: 500 }
    );
  }
}

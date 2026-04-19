import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase config");
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: RouteContext) {
  try {
    const { id: postId } = await params;
    const supabase = getAdminSupabase();

    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("likes")
      .eq("id", postId)
      .maybeSingle();

    if (fetchError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const nextViews = Number(post.likes ?? 0) + 1;

    const { error: updateError } = await supabase
      .from("posts")
      .update({ likes: nextViews })
      .eq("id", postId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ views: nextViews });
  } catch {
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}

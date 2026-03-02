import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!(file instanceof File) || typeof userId !== "string" || !userId) {
      return NextResponse.json({ error: "Invalid upload payload" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: "Missing Supabase config" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, Buffer.from(arrayBuffer), {
        contentType: file.type || "image/png",
        upsert: true,
        cacheControl: "3600",
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

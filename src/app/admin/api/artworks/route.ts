import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

function validImageSignature(buffer: Buffer, type: string) {
  if (type === "image/jpeg") {
    return (
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  if (type === "image/png") {
    return buffer.subarray(0, 8).equals(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    );
  }

  if (type === "image/webp") {
    return (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }

  return false;
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");

  return origin === new URL(request.url).origin;
}

// GET: Fetch artworks
export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Unable to retrieve artworks." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { artworks: data },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Artwork GET error:", error);

    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}

// POST: Upload artwork
export async function POST(request: Request) {
  let uploadedPath: string | null = null;

  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const title = String(formData.get("title") || "").trim();
    const medium = String(formData.get("medium") || "").trim();
    const collection = String(
      formData.get("collection") || ""
    ).trim();
    const description = String(
      formData.get("description") || ""
    ).trim();

    const year = Number(formData.get("year"));

    if (!title || title.length > 150) {
      return NextResponse.json(
        { error: "Enter a valid artwork title." },
        { status: 400 }
      );
    }

    if (
      medium.length > 100 ||
      collection.length > 100 ||
      description.length > 2000
    ) {
      return NextResponse.json(
        { error: "Artwork information is too long." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > 2100
    ) {
      return NextResponse.json(
        { error: "Enter a valid year." },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Select an artwork image." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must be smaller than 10 MB." },
        { status: 400 }
      );
    }

    const mimeType = file.type as keyof typeof ALLOWED_TYPES;
    const extension = ALLOWED_TYPES[mimeType];

    if (!extension) {
      return NextResponse.json(
        { error: "Only JPG, PNG and WEBP are supported." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!validImageSignature(buffer, mimeType)) {
      return NextResponse.json(
        { error: "Invalid image file." },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const filePath = `${year}/${randomUUID()}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("artworks")
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });



    if (uploadError) {
       console.error("SUPABASE STORAGE ERROR:", {
        message: uploadError.message,
        name: uploadError.name,
    });

    return NextResponse.json(
        {
          error: "Image upload failed.",
          details:
            process.env.NODE_ENV === "development"
            ? uploadError.message
            : undefined,
        },
        { status: 500 }
    );
    }

    uploadedPath = filePath;

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("artworks")
      .getPublicUrl(filePath);

    // Save artwork details in database
    const { data: artwork, error: databaseError } =
      await supabaseAdmin
        .from("artworks")
        .insert({
          title,
          medium: medium || null,
          collection: collection || null,
          year,
          description: description || null,
          image_url: publicUrlData.publicUrl,
          storage_path: filePath,
          featured: false,
        })
        .select()
        .single();

if (databaseError) {
  console.error("SUPABASE DATABASE ERROR:", {
    message: databaseError.message,
    details: databaseError.details,
    hint: databaseError.hint,
    code: databaseError.code,
  });

  await supabaseAdmin.storage
    .from("artworks")
    .remove([filePath]);

  uploadedPath = null;

  return NextResponse.json(
    {
      error: "Could not save artwork details.",
      details:
        process.env.NODE_ENV === "development"
          ? databaseError.message
          : undefined,
      code:
        process.env.NODE_ENV === "development"
          ? databaseError.code
          : undefined,
    },
    { status: 500 }
  );
}

    uploadedPath = null;

    return NextResponse.json(
      {
        success: true,
        message: "Artwork uploaded successfully.",
        artwork,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Artwork API error:", error);

    if (uploadedPath) {
      await supabaseAdmin.storage
        .from("artworks")
        .remove([uploadedPath]);
    }

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
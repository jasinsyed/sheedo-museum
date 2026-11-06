
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase-admin";
import { createAdminSession, isAdminAuthConfigured } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured() || !isAdminAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin sign-in is not configured yet. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and ADMIN_SESSION_SECRET.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    const username =
      typeof body.username === "string" ? body.username.trim() : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (
      username.length < 3 ||
      username.length > 50 ||
      password.length < 1 ||
      password.length > 200
    ) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 400 }
      );
    }

    const { data: admin, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, password_hash")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error("Admin lookup failed:", error.message);

      return NextResponse.json(
        { error: "Unable to sign in right now." },
        { status: 500 }
      );
    }

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    await createAdminSession(admin.id);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}


import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretValue = process.env.ADMIN_SESSION_SECRET;

if (!secretValue || Buffer.byteLength(secretValue) < 32) {
  throw new Error("ADMIN_SESSION_SECRET must be at least 32 bytes.");
}

const secret = new TextEncoder().encode(secretValue);

export const SESSION_COOKIE = "sheedo_admin_session";

export async function createAdminSession(adminId: string) {
  const token = await new SignJWT({
    role: "admin",
    sub: adminId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (payload.role !== "admin" || !payload.sub) {
      return null;
    }

    return { adminId: payload.sub as string };
  } catch {
    return null;
  }
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

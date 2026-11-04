
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowUpRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (!username.trim() || !password) {
      setMessage("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/admin/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.error || "Invalid username or password."
        );
        return;
      }

      // Authentication successful.
      setPassword("");

      router.replace("/admin/dashboard");
      router.refresh();

    } catch (error) {
      console.error("Login request failed:", error);

      setMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">

      {/* LEFT: BRANDING AND ARTWORK */}

      <section className="login-visual">

        <Link href="/" className="login-brand">
          SHEEDO<span>.</span>
        </Link>

        <div className="login-visual-content">

          <p className="login-eyebrow">
            <Sparkles size={14} />
            THE ARTIST'S PRIVATE SPACE
          </p>

          <h1>
            Every creation
            <br />
            has a <em>story.</em>
          </h1>

          <p>
            A private space to create, curate and
            share your artistic world with everyone.
          </p>

        </div>

        <div className="login-artwork">

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=90"
            alt="Artwork displayed in an art gallery"
          />

          <div className="login-artwork-caption">
            <span>THE WORLD OF SHEEDO</span>
            <span>BASRA · IRAQ</span>
          </div>

        </div>

        <div className="login-visual-footer">
          <span>ART · EXPRESSION · CREATIVITY</span>
          <span>EST. 2026</span>
        </div>

      </section>


      {/* RIGHT: LOGIN FORM */}

      <section className="login-panel">

        <Link href="/" className="login-back">
          <ArrowLeft size={15} />
          Back to museum
        </Link>

        <div className="login-content">

          <div className="login-lock-icon">
            <LockKeyhole size={23} />
          </div>

          <p className="login-form-eyebrow">
            PRIVATE ARTIST ACCESS
          </p>

          <h2>
            Welcome <em>back.</em>
          </h2>

          <p className="login-subtitle">
            Sign in to manage your artwork and collections.
          </p>


          {/* LOGIN FORM */}

          <form onSubmit={handleSubmit}>

            {/* USERNAME */}

            <label htmlFor="artist-username">
              ADMIN USERNAME
            </label>

            <input
              id="artist-username"
              type="text"
              placeholder="Enter your admin username"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setMessage("");
              }}
              disabled={loading}
              required
            />


            {/* PASSWORD */}

            <div className="login-password-heading">
              <label htmlFor="artist-password">
                PASSWORD
              </label>
            </div>

            <div className="login-password-input">

              <input
                id="artist-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage("");
                }}
                disabled={loading}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>


            {/* LOGIN OPTIONS */}

            <div className="login-options">

              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) =>
                    setRemember(e.target.checked)
                  }
                  disabled={loading}
                />

                <span>Remember me</span>
              </label>

              <span className="login-forgot">
                PRIVATE ACCOUNT
              </span>

            </div>


            {/* ERROR MESSAGE */}

            {message && (
              <div
                className="login-feedback"
                role="alert"
                aria-live="polite"
              >
                {message}
              </div>
            )}


            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  Signing in...
                  <Loader2
                    size={17}
                    className="login-spinner"
                  />
                </>
              ) : (
                <>
                  Sign in to your studio
                  <ArrowUpRight size={17} />
                </>
              )}
            </button>

          </form>


          {/* SECURITY */}

          <div className="login-security">
            <ShieldCheck size={17} />
            <span>PRIVATE ARTIST ACCESS</span>
          </div>

          <p className="login-bottom-note">
            A personal space for Sheedo's creative journey.
          </p>

        </div>


        {/* FOOTER */}

        <footer className="login-panel-footer">
          <span>SHEEDO ART MUSEUM</span>
          <span>© 2026</span>
        </footer>

      </section>

    </main>
  );
}

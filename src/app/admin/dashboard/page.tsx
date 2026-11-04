
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  LayoutDashboard,
  Images,
  Settings,
  LogOut,
  UploadCloud,
  ImagePlus,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  X,
  FileImage,
  Eye,
  CheckCircle2,
} from "lucide-react";

type Artwork = {
  id: string;
  title: string;
  medium: string | null;
  collection: string | null;
  year: number;
  description: string | null;
  image_url: string;
  storage_path: string;
  featured: boolean;
  created_at: string;
};

export default function AdminDashboardPage() {
  // Upload states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [medium, setMedium] = useState("");
  const [collection, setCollection] = useState("");
  const [year, setYear] = useState("2026");
  const [description, setDescription] = useState("");

  // Application states
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Database artworks
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Image preview
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Fetch artworks from Supabase through the server API
  async function fetchArtworks() {
    try {
      const response = await fetch("/admin/api/artworks", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Your admin session has expired.");
        }

        throw new Error("Unable to load artworks.");
      }

      const result = await response.json();

      setArtworks(result.artworks || []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load artworks."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchArtworks();
  }, []);

  // Search artworks
  const filteredArtworks = useMemo(() => {
    const query = search.toLowerCase().trim();

    return artworks.filter((art) =>
      [
        art.title,
        art.collection || "",
        art.medium || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [artworks, search]);

  // Statistics
  const collectionCount = new Set(
    artworks
      .map((art) => art.collection)
      .filter(Boolean)
  ).size;

  const featuredCount = artworks.filter(
    (art) => art.featured
  ).length;

  // File validation
  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selected = event.target.files?.[0];

    if (!selected) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selected.type)) {
      setMessage("Only JPG, PNG and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setMessage("Image must be smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    setFile(selected);
    setMessage("");
  }

  // Reset form
  function resetUpload() {
    setFile(null);
    setTitle("");
    setMedium("");
    setCollection("");
    setYear("2026");
    setDescription("");
    setMessage("");

    const input = document.getElementById(
      "artwork-file"
    ) as HTMLInputElement | null;

    if (input) input.value = "";
  }

  // Upload artwork to Supabase
  async function handleUpload() {
    if (!file || !title.trim()) {
      setMessage("Select an image and enter an artwork title.");
      return;
    }

    if (
      !Number.isInteger(Number(year)) ||
      Number(year) < 1900 ||
      Number(year) > 2100
    ) {
      setMessage("Please enter a valid artwork year.");
      return;
    }

    setUploading(true);
    setMessage("Uploading artwork...");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("medium", medium.trim());
      formData.append("collection", collection.trim());
      formData.append("year", year);
      formData.append("description", description.trim());

      const response = await fetch("/admin/api/artworks", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Artwork upload failed."
        );
      }

      setMessage("Artwork uploaded successfully!");

      resetUpload();

      await fetchArtworks();

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="studio-layout">

      {/* SIDEBAR */}

      <aside className="studio-sidebar">

        <Link href="/" className="studio-brand">
          SHEEDO<span>.</span>
        </Link>

        <div className="studio-profile">
  <div className="studio-avatar">
    <img src="/images/sheedoart.png" alt="Sheedo's profile" />
  </div>

  <div>
    <strong>Sheedo</strong>
    <span>Artist account</span>
  </div>
</div>

        <p className="studio-label">WORKSPACE</p>

        <nav className="studio-navigation">

          <a href="#overview" className="studio-nav-active">
            <LayoutDashboard size={18} />
            Overview
          </a>

          <a href="#artworks">
            <Images size={18} />
            My artworks
          </a>

          <a href="#upload">
            <UploadCloud size={18} />
            Upload artwork
          </a>

          <a href="#settings">
            <Settings size={18} />
            Settings
          </a>

        </nav>

        <div className="studio-sidebar-bottom">

          <div className="studio-help">
            <span>YOUR CREATIVE SPACE</span>
            <p>
              Every artwork deserves a place to be seen.
            </p>
          </div>

          <Link href="/" className="studio-exit">
            <LogOut size={17} />
            Return to museum
          </Link>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="studio-main">

        {/* TOP BAR */}

        <header className="studio-topbar">

          <div>
            <p className="eyebrow">
              SHEEDO'S PRIVATE STUDIO
            </p>

            <span className="studio-breadcrumb">
              Workspace / Overview
            </span>
          </div>

          <div className="studio-top-actions">

            <button
              type="button"
              className="studio-icon-button"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={19} />
            </button>

            <div className="studio-small-avatar">
          <img src=" /images/sheedoart.png" alt="Sheedo's profile" />
            </div>

          </div>

        </header>


        {/* WELCOME */}

        <section className="studio-welcome" id="overview">

          <div>
            <p className="eyebrow">
              YOUR ARTISTIC WORLD
            </p>

            <h1>
              Good day, <em>Sheedo.</em>
            </h1>

            <p>
              Welcome back to your creative studio.
              Let's make something beautiful today.
            </p>
          </div>

          <a href="#upload" className="studio-create-button">
            <Plus size={17} />
            Add new artwork
          </a>

        </section>


        {/* STATISTICS */}

        <section className="studio-stats">

          <div className="studio-stat-card">

            <div className="studio-stat-heading">
              <span>TOTAL ARTWORKS</span>
              <Images size={19} />
            </div>

            <strong>{artworks.length}</strong>
            <small>In your collection</small>

          </div>


          <div className="studio-stat-card">

            <div className="studio-stat-heading">
              <span>COLLECTIONS</span>
              <FileImage size={19} />
            </div>

            <strong>{collectionCount}</strong>
            <small>Creative categories</small>

          </div>


          <div className="studio-stat-card">

            <div className="studio-stat-heading">
              <span>FEATURED WORKS</span>
              <Eye size={19} />
            </div>

            <strong>{featuredCount}</strong>

            <small>Featured in the museum</small>

          </div>

        </section>


        {/* UPLOAD SECTION */}

        <section
          className="studio-upload-section"
          id="upload"
        >

          <div className="studio-section-heading">

            <div>
              <p className="eyebrow">
                EXPAND YOUR COLLECTION
              </p>

              <h2>
                Add new <em>artwork.</em>
              </h2>

              <p>
                Give your latest creation a place in the museum.
              </p>
            </div>

          </div>


          <div className="studio-upload-layout">

            {/* IMAGE PREVIEW */}

            <div className="studio-dropzone">

              {previewUrl ? (

                <div className="studio-preview">

                  <img
                    src={previewUrl}
                    alt="Selected artwork preview"
                  />

                  <button
                    type="button"
                    className="studio-remove-preview"
                    onClick={() => {
                      setFile(null);

                      const input = document.getElementById(
                        "artwork-file"
                      ) as HTMLInputElement | null;

                      if (input) input.value = "";
                    }}
                    aria-label="Remove selected image"
                  >
                    <X size={18} />
                  </button>

                </div>

              ) : (

                <div className="studio-empty-preview">

                  <div className="studio-upload-icon">
                    <UploadCloud size={28} />
                  </div>

                  <h3>Your next masterpiece.</h3>

                  <p>
                    Choose an image from your device
                    to preview your artwork.
                  </p>

                  <label className="studio-file-button">

                    <ImagePlus size={17} />
                    Choose image

                    <input
                      id="artwork-file"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                    />

                  </label>

                  <span>
                    PNG, JPG or WEBP · Maximum 10 MB
                  </span>

                </div>

              )}

              {previewUrl && (

                <div className="studio-selected-file">
                  <CheckCircle2 size={16} />
                  <span>{file?.name}</span>
                </div>

              )}

            </div>


            {/* ARTWORK DETAILS */}

            <div className="studio-upload-form">

              <div className="studio-form-heading">
                <h3>Artwork information</h3>
                <span>NEW ENTRY</span>
              </div>


              <label className="studio-field">
                Artwork title

                <input
                  value={title}
                  maxLength={150}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your artwork a name"
                />

              </label>


              <label className="studio-field">
                Medium

                <input
                  value={medium}
                  maxLength={100}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="e.g. Watercolour, Oil, Pencil"
                />

              </label>


              <div className="studio-form-row">

                <label className="studio-field">
                  Collection

                  <input
                    value={collection}
                    maxLength={100}
                    onChange={(e) =>
                      setCollection(e.target.value)
                    }
                    placeholder="e.g. Portraits"
                  />

                </label>


                <label className="studio-field">
                  Year

                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />

                </label>

              </div>


              <label className="studio-field">
                Description

                <textarea
                  value={description}
                  maxLength={2000}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Tell visitors something about this artwork..."
                  rows={4}
                />

              </label>


              {message && (
                <p
                  className="studio-message"
                  role="status"
                >
                  {message}
                </p>
              )}


              <div className="studio-form-actions">

                <button
                  type="button"
                  className="studio-reset-button"
                  onClick={resetUpload}
                  disabled={uploading}
                >
                  Clear form
                </button>


                <button
                  type="button"
                  className="studio-save-button"
                  onClick={handleUpload}
                  disabled={
                    !file ||
                    !title.trim() ||
                    uploading
                  }
                >

                  {uploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      Upload artwork
                      <ArrowUpRight size={16} />
                    </>
                  )}

                </button>

              </div>


              <p className="studio-security-note">
                Your artwork is securely stored in Supabase
                and saved to your museum collection.
              </p>

            </div>

          </div>

        </section>


        {/* ARTWORK COLLECTION */}

        <section
          className="studio-artworks-section"
          id="artworks"
        >

          <div className="studio-section-heading studio-artwork-heading">

            <div>
              <p className="eyebrow">
                YOUR CREATIVE ARCHIVE
              </p>

              <h2>
                My <em>artworks.</em>
              </h2>

              <p>
                Browse the artwork stored in your museum.
              </p>
            </div>

            <a href="#upload" className="studio-text-link">
              Add artwork <Plus size={15} />
            </a>

          </div>


          {/* SEARCH */}

          <div className="studio-search">

            <Search size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artworks or collections..."
            />

          </div>


          {/* ARTWORK LIST */}

          {loading ? (

            <div className="studio-no-results">
              Loading your artworks...
            </div>

          ) : (

            <div className="studio-artwork-grid">

              {filteredArtworks.map((art) => (

                <article
                  className="studio-artwork-card"
                  key={art.id}
                >

                  <div className="studio-artwork-image">

                    <img
                      src={art.image_url}
                      alt={art.title}
                      loading="lazy"
                    />

                    {art.featured && (
                      <span className="studio-featured-badge">
                        FEATURED
                      </span>
                    )}

                  </div>


                  <div className="studio-artwork-info">

                    <div>
                      <h3>{art.title}</h3>
                      <p>{art.medium || "Artwork"}</p>
                    </div>

                    <span>{art.year}</span>

                  </div>


                  <div className="studio-artwork-collection">
                    {art.collection || "Uncategorized"}
                  </div>

                </article>

              ))}

            </div>

          )}


          {!loading && filteredArtworks.length === 0 && (

            <div className="studio-no-results">

              {search
                ? "No artworks found. Try another search."
                : "Your museum is waiting for its first artwork."}

            </div>

          )}

        </section>


        {/* FOOTER */}

        <footer className="studio-footer" id="settings">

          <span>SHEEDO ART STUDIO</span>

          <span>CREATED WITH LOVE FOR ART.</span>

        </footer>

      </main>

    </section>
  );
}

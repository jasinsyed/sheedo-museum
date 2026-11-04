
import Link from "next/link";
import { Instagram, Youtube, ArrowUpRight, ArrowDown } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="artist-page">

      {/* HERO */}
      <section className="artist-hero">
        <div className="artist-hero-copy">
          <p className="eyebrow">
            THE ARTIST BEHIND THE CANVAS
          </p>

          <h1>
            Art is how<br />
            I express the<br />
            <em>unspoken.</em>
          </h1>

          <p className="artist-location">
            AN ARTIST FROM BASRA, IRAQ
          </p>

          <p className="artist-intro">
            Welcome to my creative world. A collection
            of paintings, drawings and expressions that
            bring imagination to life, one canvas at a time.
          </p>

          <a href="#artist-story" className="artist-discover">
            DISCOVER MY STORY
            <ArrowDown size={15} />
          </a>
        </div>

        <div className="artist-hero-visual">
          <div className="artist-image-frame">
            {/* Replace this image with Sheedo's actual artwork */}
            <img
              src="/images/nature.png"
              alt="Artistic painting displayed in the Sheedo museum"
            />
          </div>

          <div className="artist-image-caption">
            <span>THE WORLD OF SHEEDO</span>
            <span>BASRA · IRAQ</span>
          </div>

          <div className="artist-side-text">
            A LIFE THROUGH ART · MMXXVI
          </div>
        </div>

        <div className="artist-hero-number">01 — THE ARTIST</div>
      </section>


      {/* INTRODUCTION */}
      <section className="artist-story section" id="artist-story">
        <div className="artist-section-label">
          <span>01</span>
          <span>HER STORY</span>
        </div>

        <div className="artist-story-content">
          <p className="eyebrow">A LITTLE INTRODUCTION</p>

          <h2>
            Every artist<br />
            has a world of<br />
            <em>their own.</em>
          </h2>

          <div className="artist-story-text">
            <p className="artist-large-text">
              Meet Sheedo — an artist from Basra, Iraq,
              whose creative world lives through paintings
              and drawings.
            </p>

            <p>
              This museum is a space dedicated to her
              artistic expression. Every artwork has a
              place here, allowing visitors to slow down,
              appreciate the details and experience
              creativity through her perspective.
            </p>

            <p>
              From individual sketches to finished
              paintings, this collection celebrates
              the beauty of creating something by hand.
            </p>
          </div>
        </div>
      </section>


      {/* ARTISTIC PHILOSOPHY */}
      <section className="artist-philosophy">
        <div className="philosophy-inner">
          <p className="eyebrow">BEYOND THE CANVAS</p>

          <h2>
            Not everything<br />
            needs <em>words.</em>
          </h2>

          <p>
            Sometimes colours speak. Sometimes a single
            line tells a story. Art gives imagination
            a place to exist beyond words.
          </p>

          <span className="philosophy-signature">
            — THE WORLD OF SHEEDO
          </span>
        </div>
      </section>


      {/* BASRA */}
      <section className="basra-section section">
        <div className="basra-image">
<img
  src="/images/basra.jpg"
  alt="Architectural street map of Basra, Iraq"
/>
        </div>

        <div className="basra-copy">
          <p className="eyebrow">HER PLACE IN THE WORLD</p>

          <h2>
            From <em>Basra,</em><br />
            with creativity.
          </h2>

          <p>
            Basra, Iraq. A place that forms part of
            Sheedo's story and identity as an artist.
            Her digital museum brings her creative
            work to an audience beyond geographical
            boundaries.
          </p>

          <span className="basra-coordinate">
            BASRA · IRAQ
          </span>
        </div>
      </section>


      {/* SOCIAL MEDIA */}
      <section className="artist-social section">
        <p className="eyebrow">FOLLOW THE CREATIVE JOURNEY</p>

        <h2>
          Stay close to<br />
          the <em>art.</em>
        </h2>

        <p className="social-description">
          Explore more of Sheedo's creative world
          through her social platforms.
        </p>

        <div className="social-links">
          <Link
            href="https://www.instagram.com/sheedoart/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
          >
            <Instagram size={23} />
            <div>
              <span>INSTAGRAM</span>
              <strong>@sheedoart</strong>
            </div>
            <ArrowUpRight size={19} />
          </Link>

          <Link
            href="https://www.youtube.com/@Sheedo-w2w"
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
          >
            <Youtube size={23} />
            <div>
              <span>YOUTUBE</span>
              <strong>Sheedo</strong>
            </div>
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>


      {/* CLOSING */}
      <section className="artist-closing">
        <p className="eyebrow">THANK YOU FOR VISITING</p>

        <h2>
          Stay curious.<br />
          Keep <em>creating.</em>
        </h2>

        <Link href="/gallery" className="primary-link">
          EXPLORE THE COLLECTION
          <ArrowUpRight size={16} />
        </Link>
      </section>

    </div>
  );
}

import React from "react";

export default function VideosSection() {
  const videos = [
    {
      thumb: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
      avatar: "images/assets/avatar.png",
      title: "Lorem Ipsum Sit Amet",
      meta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit cras aliquet iaculis luctus.",
      cta: "#",
      alt: "Video 1",
    },
    {
      thumb: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      avatar: "images/assets/avatar.png",
      title: "Lorem Ipsum Sit Amet",
      meta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit cras aliquet iaculis luctus.",
      cta: "#",
      alt: "Video 2",
    },
    {
      thumb: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80",
      avatar: "images/assets/avatar.png",
      title: "Lorem Ipsum Sit Amet",
      meta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit cras aliquet iaculis luctus.",
      cta: "#",
      alt: "Video 3",
    },
    {
      thumb: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      avatar: "images/assets/avatar.png",
      title: "Lorem Ipsum Sit Amet",
      meta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit cras aliquet iaculis luctus.",
      cta: "#",
      alt: "Video 4",
    },
  ];

  return (
    <section className="videos-section" aria-label="Videos mas recientes">
      <div className="videos-inner">
        <h2 className="videos-title">Videos mas recientes</h2>
        <p className="videos-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet iaculis luctus.
          Mauris lacus mi, ornare vel nulla et, facilisis rutrum velit. Vivamus ut dui molestie.
        </p>
        <div className="videos-grid">
          {videos.map((video, idx) => (
            <article className="video-card" key={idx}>
              <div className="video-thumb">
                <img src={video.thumb} alt={video.alt} />
                <div className="play" aria-hidden="true">
                  <span>
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M8 5l12 7-12 7z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="video-body">
                <div className="video-head">
                  <img className="video-avatar" src={video.avatar} alt="Avatar" />
                  <h3 className="video-title">{video.title}</h3>
                </div>
                <div className="video-meta">{video.meta}</div>
                <a className="video-cta" href={video.cta}>
                  {video.title}
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5l12 7-12 7z" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="videos-action">
          <button className="btn about" type="button">Lorem Ipsum</button>
        </div>
      </div>
    </section>
  );
}

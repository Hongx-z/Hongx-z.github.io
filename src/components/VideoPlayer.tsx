import { withBase } from '@/lib/base';
import type { VideoSource } from '@/lib/documentaries';
import { posterBackground } from '@/lib/poster';

const PROVIDER_LABEL: Record<VideoSource['provider'], string> = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  bilibili: 'Bilibili',
  file: 'Self-hosted file',
};

interface VideoPlayerProps {
  title: string;
  source: VideoSource | null;
  poster?: string;
  /** The frontmatter key to name in the placeholder instructions. */
  slug: string;
}

export function VideoPlayer({ title, source, poster, slug }: VideoPlayerProps) {
  if (!source) {
    return (
      <div className="player">
        <div
          className="player__frame"
          style={{ background: posterBackground(slug), borderColor: 'transparent' }}
        >
          <div className="player__placeholder">
            <div className="player__placeholder-inner">
              <p className="player__placeholder-title">{title}</p>
              <p className="player__placeholder-text">
                No video source is set for this film yet. Add a <code>videoUrl</code> to the
                frontmatter of <code>content/documentaries/{slug}.md</code>.
              </p>
              <p className="player__placeholder-text">
                YouTube, Vimeo, Bilibili links and direct <code>.mp4</code> / <code>.webm</code>{' '}
                files are all recognised.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      <div className="player__frame">
        {source.provider === 'file' ? (
          <video
            controls
            preload="metadata"
            playsInline
            poster={poster ? withBase(poster) : undefined}
          >
            <source src={withBase(source.embedUrl)} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={source.embedUrl}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>

      <div className="player__caption">
        <span>
          {PROVIDER_LABEL[source.provider]} · {source.provider === 'file' ? 'streaming directly' : 'embedded player'}
        </span>
        <a
          href={source.watchUrl}
          className="link-underline"
          target="_blank"
          rel="noreferrer noopener"
        >
          Open on {PROVIDER_LABEL[source.provider]}
        </a>
      </div>
    </div>
  );
}

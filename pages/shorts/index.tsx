import React, {
  useEffect, useRef, useState, useMemo, createContext, useContext
} from 'react';
import {
  ThumbsUp, MessageCircle, Share2, VolumeOff, Volume2, EllipsisVertical, Play, Pause
} from 'lucide-react';
import styles from './ReelFeed.module.scss';

const videos = [
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  '/tiny.mp4'
];

const MuteContext = createContext<{ isMuted: boolean; toggleMute:() => void }>({ isMuted: true, toggleMute: () => {} });

export default function Index() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState<true | false>(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const contextValue = useMemo(() => ({
    isMuted,
    toggleMute: () => setIsMuted((prev) => !prev)
  }), [isMuted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setCurrentIndex((prev) => Math.min(prev + 1, videos.length - 1));
      } else if (e.key === 'ArrowUp') {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const target = container?.querySelectorAll(`.${styles.reel}`)[currentIndex];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [currentIndex]);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) video.muted = isMuted;
    });
  }, [isMuted]);

  return (
    <MuteContext.Provider value={contextValue}>
      <div className={styles.feedContainer}>
        <div className={styles.reelsSection} ref={containerRef}>
          {videos.map((src, index) => (
            <Reel
              key={src}
              src={src}
              index={index}
              videoRefs={videoRefs}
            />
          ))}
        </div>
      </div>
    </MuteContext.Provider>
  );
}

function Reel({ src, index, videoRefs }: {
  src: string;
  index: number;
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState(false);
  const { isMuted, toggleMute } = useContext(MuteContext);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    videoRefs.current[index] = videoRef.current;
  }, [index, videoRefs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting && video) {
          try {
            await video.play();
            video.muted = isMuted;
          } catch (err) {
            setError(true);
          }
        } else {
          video?.pause();
        }
      },
      { threshold: 0.7 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isMuted]);

  useEffect(() => {
    if (!isPaused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isPaused]);

  return (
    <div className={styles.reel}>
      {error ? (
        <div className={styles.error}>Error loading video</div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            className={styles.video}
            loop
            autoPlay
            muted={isMuted}
            controls={false}
          />
          <div className={styles.topAction}>
            <button type="button" onClick={() => setIsPaused((prev) => !prev)}>
              {isPaused ? <Play /> : <Pause />}
            </button>
            <button type="button" onClick={toggleMute}>
              {isMuted ? <VolumeOff /> : <Volume2 />}
            </button>
          </div>
          <div className={styles.overlay}>
            <div className={styles.videoInfo}>
              <div className={styles.userprofile}>
                <img src="/no-avatar.jpg" alt="user-profile" />
                {' '}
                <span>@TestUsers</span>
                <button type="button">follow</button>
              </div>
              <h3>
                Video
                {index + 1}
              </h3>
              <p>
                This is the description of video
                {index + 1}
              </p>
            </div>
            <div className={styles.actions}>
              <div className={styles.actionWrapper}>
                <div>
                  <button type="button" aria-label="Like"><ThumbsUp /></button>
                  <span>1.5K</span>
                </div>
                <div>
                  <button type="button" aria-label="Comment"><MessageCircle /></button>
                  <span>65</span>
                </div>
                <div>
                  <button type="button" aria-label="Share"><Share2 /></button>
                </div>
                <div>
                  <button type="button" aria-label="Share"><EllipsisVertical /></button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

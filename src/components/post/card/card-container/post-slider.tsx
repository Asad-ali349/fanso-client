import { Button } from 'antd';
import { IFeed } from '@interfaces/feed';
import dynamic from 'next/dynamic';
import { isMobile } from 'react-device-detect';
import classNames from 'classnames';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useViewPopup } from 'src/context/view-media-popup/view-media-popup-container';
import { SkeletonPlayer } from '@components/video/player/skeleton-player';
import style from './post-slider.module.scss';

const ImageWithFallback = dynamic(() => import('@components/common/base/image-fallback'));
const VideoPlayer = dynamic(() => import('@components/video/player/video-player'), { ssr: false, loading: () => <SkeletonPlayer /> });
const VideoStatusPlayer = dynamic(() => import('@components/video/player/video-player-with-file-status'), { ssr: false, loading: () => <SkeletonPlayer /> });

interface IProps {
  feed: IFeed;
  priority?: boolean;
}

export default function FeedSlider({ feed, priority }: IProps) {
  const { showPopup } = useViewPopup();
  const file = feed.files[0];
  return (
    <div className={classNames(style['feed-slider'])}>
      {file.type.includes('photo') ? (
        <ImageWithFallback
          key={file._id}
          options={{
            unoptimized: true,
            quality: 80,
            width: file.width || 360,
            height: file.height || 500,
            priority,
            sizes: '(max-width: 768px) 80vw, (max-width: 2100px) 40vw'
          }}
          alt="post-photo"
          fallbackSrc="/no-image.jpg"
          src={file?.url || '/no-image.jpg'}
          onClick={() => {
            showPopup(feed.files, 0);
          }}
        />
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {file.status === 'finished' ? (
            <VideoPlayer
              key={file._id}
              onPlaying={(isPlayed, player) => {
                if (file.type !== 'feed-audio' && feed.thumbnail) return;
                player.poster(isPlayed ? '/audio-playing.webp' : '/audio-paused.jpg');
              }}
              options={{
                active: true,
                classes: 'feed-player',
                playInview: true,
                controls: true,
                playsinline: true,
                fluid: true,
                loop: true,
                audioPosterMode: file.type === 'feed-audio',
                poster: (feed?.thumbnail?.url || (file?.thumbnails && file?.thumbnails[0])) || (file.type === 'feed-audio' && '/audio-paused.jpg'),
                sources: [
                  {
                    src: file.url,
                    type: 'video/mp4'
                  }
                ]
              }}
            />
          ) : (
            <VideoStatusPlayer
              target="feedId"
              fileId={file._id}
              targetId={feed._id}
              thumbUrl={(feed?.thumbnail?.url) || (file?.thumbnails && file?.thumbnails[0]) || '/leaf.jpg'}
              onPlaying={(isPlayed, player) => {
                if (file.type !== 'feed-audio' && feed.thumbnail) return;
                player.poster(isPlayed ? '/audio-playing.webp' : '/audio-paused.jpg');
              }}
              options={{
                isActive: true,
                classes: 'feed-player',
                autoplay: false,
                controls: true,
                playsinline: true,
                fluid: true,
                loop: true,
                audioPosterMode: file.type === 'feed-audio',
                poster: file.type === 'feed-audio' ? '/audio-paused.jpg' : (isMobile && file.thumbnails && file.thumbnails[0]) || null,
                sources: [
                  {
                    src: file.url,
                    type: 'video/mp4'
                  }
                ]
              }}
            />
          )}
        </>
      )}
      {feed.files && feed.files.length > 1 && (
        <div
          className={style['slide-top']}
        >
          <span
            aria-hidden
            className={style.count}
            onClick={() => {
              showPopup(feed.files, 0);
            }}
          >
            {`${1} / ${feed.files.length}`}
          </span>
          <span className={style['btn-grp']}>
            <Button onClick={() => showPopup(feed.files, feed.files.length - 1)}><LeftOutlined /></Button>
            <Button onClick={() => showPopup(feed.files, 1)}><RightOutlined /></Button>
          </span>
        </div>
      )}
    </div>
  );
}

FeedSlider.defaultProps = {
  priority: false
};

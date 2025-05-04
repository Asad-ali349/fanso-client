import {
  ArrowLeftOutlined, FireOutlined, PictureOutlined, ShoppingOutlined, VideoCameraOutlined,
  StarOutlined
} from '@ant-design/icons';
import StatsRow from '@components/performer/profile/stats-row';
import { IPerformer } from '@interfaces/performer';
import {
  Button, Tabs
} from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { TickIcon } from 'src/icons';
import { ImageWithFallback } from '@components/common';
import { IFeed } from '@interfaces/feed';
import style from './profile-container.module.scss';
import LiveButton from '../buttons/live-button';

const PostTab = dynamic(() => import('./contents-tabs/post-tab'));
const GalleryTab = dynamic(() => import('./contents-tabs/gallery-tab'));
const ProductTab = dynamic(() => import('./contents-tabs/product-tab'));
const VideoTab = dynamic(() => import('./contents-tabs/video-tab'));
const SubscribeButtons = dynamic(() => import('../buttons/subscribe-buttons'));
const UserActionsGroup = dynamic(() => import('./user-actions-group'));
const AboutPerformer = dynamic(() => import('./about-profile'));
const ModalWelcomeVideo = dynamic(() => import('./modal-welcome-video'), { ssr: false });

type IProps = {
  initPosts: {
    data: IFeed[];
    total: number;
  }
  performer: IPerformer;
  previousRoute: string;
};

function ProfileContainer({
  initPosts, performer, previousRoute
}: IProps) {
  const router = useRouter();

  const items = [
    {
      key: 'post',
      label: <FireOutlined />,
      children: <PostTab performer={performer} initPosts={initPosts} />
    },
    {
      key: 'video',
      label: <VideoCameraOutlined />,
      children: <VideoTab performer={performer} />
    },
    {
      key: 'photo',
      label: <PictureOutlined />,
      children: <GalleryTab performer={performer} />
    },
    {
      key: 'store',
      label: <ShoppingOutlined />,
      children: <ProductTab performer={performer} />
    }
  ];

  return (
    <div className={style['performer-profile']}>
      <div className="main-container">
        <div className={style['top-profile']}>
          <ImageWithFallback
            options={{
              priority: true,
              width: 1080,
              height: 230,
              sizes: '(max-width: 768px) 100vw, (max-width: 2100px) 50vw, 1080px'
            }}
            alt="creator-cover"
            fallbackSrc="/default-banner.jpeg"
            src={performer.cover || '/default-banner.jpeg'}

          />
          <div className={style['bg-2nd']} />
          <div className={style['top-right-profile']}>
            {previousRoute && (
              <Button className={style['arrow-back']} onClick={() => router.back()}>
                <ArrowLeftOutlined />
                BACK
              </Button>
            )}
            <StatsRow performer={performer} />
          </div>
        </div>
        <div className={style['main-profile']}>
          <div className={style['img-name-grp']}>
            <div className={style['left-col']}>
              <div className={style['left-col-photo']}>
                <ImageWithFallback
                  options={{
                    width: 104,
                    height: 104,
                    quality: 50,
                    priority: true,
                    sizes: '(max-width: 768px) 20vw, (max-width: 2100px) 15vw'
                  }}
                  fallbackSrc="/no-avatar.jpg"
                  src={performer.avatar || '/no-avatar.jpg'}
                  alt="creator-avatar"
                />
                <LiveButton performer={performer} />
              </div>
              <div className={style['m-user-name']}>
                <div className={style.name}>
                  {performer.name || 'N/A'}
                  &nbsp;
                  {performer.verifiedAccount && (
                    <TickIcon />
                  )}
                  &nbsp;
                  {performer.isFeatured && <StarOutlined />}
                </div>
                <div className={style.username}>
                  {`@${performer.username || 'n/a'}`}
                </div>
              </div>
            </div>
            <UserActionsGroup performer={performer} />
          </div>
          <AboutPerformer performer={performer} />
          <SubscribeButtons performer={performer} />
        </div>
        <div className={style['model-content']}>
          <Tabs
            defaultActiveKey="post"
            items={items}
            size="large"
          />
        </div>
      </div>
      {performer.welcomeVideoPath && performer.activateWelcomeVideo && <ModalWelcomeVideo performer={performer} />}
    </div>
  );
}

export default ProfileContainer;

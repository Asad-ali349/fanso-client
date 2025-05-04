import { IFeed } from '@interfaces/feed';
import Link from 'next/link';
import { formatDate } from '@lib/date';
import { TickIcon } from 'src/icons';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { ImageWithFallback } from '@components/common';
import { StarFilled } from '@ant-design/icons';
import DropdownActions from './dropdown-actions';
import style from './card-top.module.scss';

const JoinStreamButton = dynamic(() => import('@components/action-buttons/join-live-button'), { ssr: false });

interface IProps {
  feed: IFeed;
  priority: boolean;
}

export default function PostTopCard({ feed, priority }: IProps) {
  const user = useSelector((state: any) => state.user.current);
  const { performer } = feed;

  return (
    <div className={style['feed-top']}>
      <Link href={{ pathname: '/[profileId]', query: { profileId: performer?.username } }} as={`/${performer?.username}`}>
        <div className={style['feed-top-left']}>
          <ImageWithFallback
            options={{
              width: 100,
              height: 100,
              quality: 30,
              priority,
              sizes: '(max-width: 767px) 10vw, (min-width: 768px) 5vw'
            }}
            alt="per_atv"
            fallbackSrc="/no-avatar.jpg"
            src={performer?.avatar || '/no-avatar.jpg'}
          />
          <div className={style['feed-name']}>
            <div className={style.name}>
              {performer?.name || 'N/A'}
              {' '}
              {performer?.verifiedAccount && <TickIcon />}
              &nbsp;
              {performer?.isFeatured && <StarFilled />}
              &nbsp;&nbsp;
              {performer?.streamingStatus === 'public' && user?._id !== performer?._id && <JoinStreamButton feed={feed} user={user} />}
            </div>
            <div className={style.username}>
              @
              {performer?.username || 'n/a'}
            </div>
          </div>
          <span className={classNames({
            [style['online-status']]: true,
            [style.active]: performer?.isOnline
          })}
          />
        </div>
      </Link>
      <div className={style['feed-top-right']}>
        <span className={style['feed-time']}>{formatDate(feed.updatedAt, 'MMM DD')}</span>
        <DropdownActions feed={feed} />
      </div>
    </div>
  );
}

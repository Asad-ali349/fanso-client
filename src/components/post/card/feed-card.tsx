import { IFeed } from '@interfaces/feed';
import dynamic from 'next/dynamic';
import style from './feed-card.module.scss';

const PostTopCard = dynamic(() => import('./card-container/card-top'));
const PostCardMiddle = dynamic(() => import('./card-container/card-middle'));
const PostCardBottom = dynamic(() => import('./card-container/card-bottom'));

type Props = {
  feed: IFeed;
  priority?: boolean;
};

export default function FeedCard({
  feed, priority = false
}: Props) {
  return (
    <div className={style['feed-card']}>
      <PostTopCard feed={feed} priority={priority} />
      <PostCardMiddle feed={feed} priority={priority} />
      <PostCardBottom feed={feed} />
    </div>
  );
}

FeedCard.defaultProps = {
  priority: false
};

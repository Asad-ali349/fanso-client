import { IFeed } from '@interfaces/feed';
import { IPerformer } from '@interfaces/performer';
import dynamic from 'next/dynamic';

const ScrollListPerformerFeed = dynamic(() => (import('@components/post/list/scroll-list')));
const FilterContentsBar = dynamic(() => (import('./search-bar')));

type Props = {
  performer: IPerformer;
  initPosts: {
    data: IFeed[];
    total: number;
  }
};

export default function PostTab({
  performer, initPosts
}: Props) {
  return (
    <>
      <div className="heading-tab">
        <h4>
          {initPosts.total > 0 && initPosts.total}
          {' '}
          {initPosts.total > 1 ? 'POSTS' : 'POST'}
        </h4>
        <FilterContentsBar tab="post" performerId={performer._id} />
      </div>
      <ScrollListPerformerFeed
        initPosts={initPosts}
      />
    </>
  );
}

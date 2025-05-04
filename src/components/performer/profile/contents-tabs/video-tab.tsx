import { IPerformer } from '@interfaces/performer';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ScrollListVideo = dynamic(() => (import('@components/video/scroll-list-item')));
const FilterContentsBar = dynamic(() => (import('./search-bar')));

type Props = {
  performer: IPerformer
};

export default function VideoTab({
  performer
}: Props) {
  const [total, setTotal] = useState(performer?.stats?.totalVideos || 0);

  return (
    <>
      <div className="heading-tab">
        <h4>
          {total > 0 && total}
          {' '}
          {total > 1 ? 'VIDEOS' : 'VIDEO'}
        </h4>
        <FilterContentsBar tab="video" performerId={performer._id} />
      </div>
      <ScrollListVideo
        query={{
          performerId: performer._id
        }}
        getTotal={(t) => setTotal(t)}
      />
    </>
  );
}

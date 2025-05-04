import { IFeed } from '@interfaces/index';
import { showError } from '@lib/utils';
import { feedService } from '@services/feed.service';
import { Alert, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import style from './scroll-list.module.scss';

const FeedCard = dynamic(() => import('../card/feed-card'));
const FeedGridCard = dynamic(() => import('../card/grid-card'));
const ViewMediaPopupContainer = dynamic(() => import('src/context/view-media-popup/view-media-popup-container'));
interface IProps {
  initPosts: {
    data: IFeed[];
    total: number;
  }
}

function ScrollListPerformerFeed({
  initPosts
}: IProps) {
  const [fetching, setFetching] = useState(false);
  const [items, setItems] = useState<IFeed[]>(initPosts.data);
  const offset = useRef<number>(0);
  const router = useRouter();

  const getMore = async () => {
    offset.current += 1;
    try {
      setFetching(true);
      const resp = await feedService.userSearch({
        limit: 12,
        offset: offset.current * 12,
        ...router.query
      });
      setItems([...items, ...resp.data.data]);
    } catch (e) {
      showError(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    offset.current = 0;
    setItems(initPosts.data);
  }, [JSON.stringify(router.query)]);

  return (
    <InfiniteScroll
      dataLength={items.length}
      hasMore={initPosts.total > items.length}
      loader={null}
      next={() => {
        !fetching && getMore();
      }}
      endMessage={null}
      scrollThreshold={0.7}
    // scrollableTarget="primaryLayout"
    >
      <ViewMediaPopupContainer>
        <div className={router?.query?.isGrid === 'true' ? style['grid-view'] : style['fixed-scroll']}>
          {items.map((item: any, index: number) => {
            if (router?.query?.isGrid === 'true') {
              return <FeedGridCard feed={item} key={item._id} />;
            }
            return (
              <FeedCard
                priority={index < 5}
                feed={item}
                key={item._id}
              />
            );
          })}
        </div>
      </ViewMediaPopupContainer>
      {!items.length && !fetching && (
        <div className={style['fixed-scroll']}>
          <Alert
            className="text-center"
            message="No post was found"
            type="info"
          />
        </div>
      )}
      {fetching && (
        <div className="text-center">
          <Spin />
        </div>
      )}
    </InfiniteScroll>
  );
}

export default ScrollListPerformerFeed;

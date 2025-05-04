import { IFeed } from '@interfaces/index';
import { showError } from '@lib/utils';
import { feedService } from '@services/feed.service';
import { Alert, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import dynamic from 'next/dynamic';
import ViewMediaPopupContainer from 'src/context/view-media-popup/view-media-popup-container';
import Link from 'next/link';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import style from './scroll-list.module.scss';

const FeedCard = dynamic(() => import('../card/feed-card'));

interface IProps {
  initPosts: {
    data: IFeed[];
    total: number;
  }
}

function ScrollListHomeFeed({
  initPosts
}: IProps) {
  const [fetching, setFetching] = useState(false);
  const [items, setItems] = useState<IFeed[]>(initPosts.data);
  const offset = useRef<number>(0);
  const router = useRouter();

  const moreItems = async () => {
    try {
      setFetching(true);
      const resp = await feedService.userSearch({
        ...router.query,
        limit: 12,
        offset: offset.current * 12,
        isHome: true
      });
      setItems([...items, ...resp.data.data]);
    } catch (e) {
      showError(e);
    } finally {
      setFetching(false);
    }
  };

  const getMore = () => {
    offset.current += 1;
    moreItems();
  };

  useEffect(() => {
    offset.current = 0;
    setItems(initPosts.data);
  }, [JSON.stringify(initPosts)]);

  return (
    <InfiniteScroll
      dataLength={items?.length}
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
        <div className={style['fixed-scroll']}>
          {items.map((item: any, index: number) => (
            <FeedCard
              priority={index < 5}
              feed={item}
              key={item._id}
            />
          ))}
        </div>
      </ViewMediaPopupContainer>
      {!items.length && !fetching && (
      <div className="main-container custom text-center" style={{ margin: '10px 0' }}>
        <Alert
          type="warning"
          message={(
            <Link href="/creator">
              <SearchOutlined />
              {' '}
              Find someone to follow
            </Link>
           )}
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

export default ScrollListHomeFeed;

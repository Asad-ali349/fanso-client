import { IFeed } from '@interfaces/index';
import { showError } from '@lib/utils';
import { Alert, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { reactionService } from '@services/reaction.service';
import dynamic from 'next/dynamic';
import ViewMediaPopupContainer from 'src/context/view-media-popup/view-media-popup-container';
import style from './scroll-list.module.scss';

const FeedCard = dynamic(() => import('../card/feed-card'));

interface IProps {
  getTotal: Function;
}

function ScrollListBookmarkFeed({
  getTotal
}: IProps) {
  const [fetching, setFetching] = useState(true);
  const [items, setItems] = useState<IFeed[]>([]);
  const [total, setTotal] = useState(0);
  const offset = useRef<number>(0);

  const getItems = async (more = false) => {
    try {
      setFetching(true);
      const resp = await reactionService.getBookmarks('feeds', {
        limit: 12,
        offset: offset.current * 12
      });
      !more ? setItems(resp.data.data) : setItems([...items, ...resp.data.data]);
      const totalFeedBookmark = resp.data.data.filter((item) => item.objectInfo).length;
      setTotal(totalFeedBookmark);
      getTotal && getTotal(totalFeedBookmark);
    } catch (e) {
      showError(e);
    } finally {
      setFetching(false);
    }
  };

  const getMore = () => {
    if (Math.round(total / 12) === offset.current) return;
    offset.current += 1;
    getItems(true);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <InfiniteScroll
      dataLength={items.length}
      hasMore={total > items.length}
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
          {items.map((item: any, index: number) => {
            if (!item?.objectInfo) {
              return null;
            }
            return (
              <FeedCard
                priority={index < 5}
                feed={{ ...item?.objectInfo, isBookMarked: true }}
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

export default ScrollListBookmarkFeed;

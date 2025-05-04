import { IFeed } from '@interfaces/feed';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import {
  useContext, useEffect, useRef, useState
} from 'react';
import { SocketContext } from 'src/socket';
import style from './card-middle.module.scss';

const FeedSlider = dynamic(() => import('./post-slider'));
const ScheduledStreamingContent = dynamic(() => import('./scheduled-streaming'));
const LockContentMiddle = dynamic(() => import('./lock-content-middle'));
const FeedPolls = dynamic(() => import('./post-polls-list'));

interface IProps {
  feed: IFeed;
  priority: boolean;
}

export default function PostCardMiddle({ feed, priority }: IProps) {
  const user = useSelector((state: any) => state.user.current);
  const { socket } = useContext(SocketContext);
  const [isBought, setIsBought] = useState(feed.isBought);
  const init = useRef(false);

  const onPaymentSuccess = ({ item }) => {
    // TODO refetch url video if S3
    if (!item || item._id !== feed._id || isBought) return;
    setIsBought(true);
  };

  useEffect(() => {
    if (!init.current && socket) {
      socket.on('token_transaction_success', onPaymentSuccess);
      init.current = true;
    }
    return () => {
      socket && socket.off('token_transaction_success', onPaymentSuccess);
    };
  }, [socket]);

  let canView = (!feed.isSale && feed.isSubscribed)
    || isBought
    || ['text', 'scheduled-streaming'].includes(feed.type)
    || (feed.isSale && !feed.price);

  if (!user._id || (`${user._id}` !== `${feed.fromSourceId}` && user.isPerformer)) {
    canView = false;
  }

  return (
    <div className={style['feed-container']}>
      {/* eslint-disable-next-line react/no-danger */}
      <div className={style['feed-text']} dangerouslySetInnerHTML={{ __html: feed.text }} />
      {feed.polls && feed.polls.length > 0 && <FeedPolls feed={feed} />}
      {feed.type === 'scheduled-streaming' && <ScheduledStreamingContent feed={feed} />}
      {!['text', 'scheduled-streaming'].includes(feed.type) && (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {canView && feed?.files?.length ? <FeedSlider feed={feed} priority={priority} /> : <LockContentMiddle feed={feed} />}
        </>
      )}
    </div>
  );
}

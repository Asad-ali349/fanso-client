import dynamic from 'next/dynamic';
import { IFeed } from '@interfaces/feed';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { IUser } from '@interfaces/user';
import { message } from 'antd';
import style from './card-bottom.module.scss';

const TipBtn = dynamic(() => import('@components/performer/tip/tip-btn'));
const BookmarkButton = dynamic(() => import('@components/action-buttons/bookmark-button'));
const LikeButton = dynamic(() => import('@components/action-buttons/like-button'));
const ReportBtn = dynamic(() => import('@components/report/report-btn'));
const CommentButton = dynamic(() => import('@components/action-buttons/comment-button'));
const CommentWrapper = dynamic(() => import('@components/comment/comment-wrapper'), { ssr: false });

interface IProps {
  feed: IFeed;
}

export default function PostCardBottom({ feed }: IProps) {
  const user: IUser = useSelector((state: any) => state.user.current);
  const [isOpenComment, setOpenComment] = useState(false);

  const onOpenComment = () => {
    if (!user._id) {
      message.error('Please log in or register!');
      return;
    }
    setOpenComment((s) => !s);
  };

  return (
    <div className={style['feed-bottom']}>
      <div className={style['feed-actions']}>
        <div className={style['action-item']}>
          <LikeButton
            objectId={feed._id}
            objectType="feed"
            displayType="feed"
            performerId={feed.fromSourceId}
            totalLike={feed.totalLike}
            liked={feed.isLiked}
          />
          <CommentButton
            totalComment={feed.totalComment}
            active={isOpenComment}
            onClick={() => onOpenComment()}
          />
          <TipBtn performer={feed.performer} />
        </div>
        <div className={style['action-item']}>
          <ReportBtn target="feed" targetId={feed._id} performer={feed.performer} />
          <BookmarkButton objectId={feed._id} objectType="feed" bookmarked={feed.isBookMarked} />
        </div>
      </div>
      {isOpenComment && (
        <CommentWrapper objectId={feed._id} objectType="feed" />
      )}
    </div>
  );
}

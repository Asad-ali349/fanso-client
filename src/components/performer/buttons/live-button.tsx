import { IPerformer } from '@interfaces/performer';
import { IUser } from '@interfaces/user';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { performerService } from '@services/performer.service';
import style from './live-button.module.scss';

interface P {
  performer: IPerformer;
}

function LiveButton({ performer }: P) {
  if (!performer) return null;
  const user = useSelector((state: any) => state.user.current) as IUser;
  const [live, setLive] = useState(performer.live);
  const [online, setOnline] = useState(performer.isOnline);
  const timeout = useRef(null) as any;

  const fetchPerformer = async () => {
    try {
      const resp = (await performerService.findOne(performer._id)).data;
      setLive(resp.live);
      setOnline(resp.isOnline);
      timeout.current = setTimeout(() => fetchPerformer(), 15000);
    } catch (e) {
      const err = await e;
      Router.replace({
        pathname: '/[profileId]',
        query: {
          profileId: performer.username,
          message: err?.message || 'Not Found',
          statusCode: err?.statusCode || 404
        }
      }, `/${performer.username}?message=${err?.message || 'Not Found'}&statusCode=${err?.statusCode || 404}`);
    }
  };

  // TODO - move to other component
  const handleJoinStream = () => {
    if (!user._id) {
      message.error('Please log in or register!');
      return;
    }
    if (user.isPerformer) return;
    if (!performer.isSubscribed) {
      message.error('Please subscribe to this creator!');
      return;
    }
    Router.push({
      pathname: '/streaming/[username]',
      query: {
        performer: JSON.stringify(performer),
        username: performer.username || performer._id
      }
    }, `/streaming/${performer.username || performer._id}`);
  };

  useEffect(() => {
    fetchPerformer();
    return () => {
      timeout.current && clearTimeout(timeout.current);
    };
  }, [performer._id]);

  return (
    <>
      <span className={online ? style['online-status'] : `${style['online-status']} ${style.off}`} />
      {performer.streamingStatus === 'public' && live && (
        <button type="button" aria-hidden onClick={() => handleJoinStream()} className={style['live-status']}>
          <i />
          {' '}
          Live
        </button>
      )}
    </>

  );
}

export default LiveButton;

import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import {
  bannerService, feedService
} from '@services/index';
import {
  Alert, Button, Input
} from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  IBanner, IFeed, ISettings, IUser
} from 'src/interfaces';
import SeoMetaHead from '@components/common/seo-meta-head';
import nextCookie from 'next-cookies';

import { useRouter } from 'next/router';
import { getIpFromHeaders } from '@lib/request';
import style from './home.module.scss';

const Banners = dynamic(() => import('@components/common/banner'));
const HomePerformers = dynamic(() => import('@components/performer/list/home-listing'));
const StreamActiveItems = dynamic(() => import('@components/streaming/list/active-list-items'));
const ScrollListHomeFeed = dynamic(() => import('@components/post/list/scroll-list-home'));

interface IProps {
  banners: IBanner[];
  settings: ISettings;
  user: IUser;
  initPosts: {
    data: IFeed[];
    total: number;
  }
}

function HomePage({
  user, settings, banners, initPosts
}: IProps) {
  const [openSearch, setOpenSearch] = useState(false);
  const router = useRouter();

  const onSearchFeed = debounce((q) => {
    router.push({
      pathname: '/home',
      query: {
        q,
        type: router?.query?.type || ''
      }
    }, undefined, { shallow: false });
  }, 600);

  const setFeedType = (type: string) => {
    router.push({
      pathname: '/home',
      query: {
        q: router?.query?.q || '',
        type
      }
    }, undefined, { shallow: false });
  };

  // const topBanners = banners && banners.length > 0 && banners.filter((b) => b.position === 'top');
  const feedType = router?.query?.type || '';

  return (
    <>
      <SeoMetaHead pageTitle="Home" />
      <div className={style['home-page']}>
        <Banners banners={banners} />
        <div className="main-container">
          <div className={style['home-heading']}>
            <div className={style['left-side']}>
              <h3>
                HOME
              </h3>
            </div>
            <div className={style['search-bar-feed']}>
              <Input
                className={openSearch ? style.active : ''}
                prefix={<SearchOutlined />}
                placeholder="Type to search here ..."
                onChange={(e) => {
                  e.persist();
                  onSearchFeed(e.target.value);
                }}
              />
              <a aria-hidden className={style['open-search']} onClick={() => setOpenSearch(!openSearch)}>
                {!openSearch ? <SearchOutlined /> : <CloseOutlined />}
              </a>
            </div>
          </div>
          <div className={style['home-container']}>
            <div className={style['left-container']}>
              {user._id && !user.verifiedEmail && settings.requireEmailVerification && <Link href={user.isPerformer ? '/creator/account' : '/user/account'}><Alert type="error" style={{ margin: '15px 0', textAlign: 'center' }} message="Please verify your email address, click here to update!" /></Link>}
              <StreamActiveItems />
              <div className={style['filter-wrapper']}>
                <Button className={classNames({ active: feedType === '' })} onClick={() => setFeedType('')}>All Posts</Button>
                <Button className={classNames({ active: feedType === 'text' })} onClick={() => setFeedType('text')}>Text</Button>
                <Button className={classNames({ active: feedType === 'video' })} onClick={() => setFeedType('video')}>Video</Button>
                <Button className={classNames({ active: feedType === 'photo' })} onClick={() => setFeedType('photo')}>Photos</Button>
                <Button className={classNames({ active: feedType === 'audio' })} onClick={() => setFeedType('audio')}>Audio</Button>
                <Button className={classNames({ active: feedType === 'scheduled-streaming' })} onClick={() => setFeedType('scheduled-streaming')}>Scheduled Streaming</Button>
              </div>
              <ScrollListHomeFeed initPosts={initPosts} />
            </div>
            <div className={style['right-container']} id="home-right-container">
              <HomePerformers />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

HomePage.authenticate = true;
HomePage.noredirect = true;
HomePage.layout = 'home';

export const getServerSideProps = async (ctx) => {
  try {
    const { query } = ctx;
    const { token } = nextCookie(ctx);

    const [banners, feeds] = await Promise.all([
      bannerService.search({ limit: 99 }),
      feedService.userSearch({
        limit: 12,
        offset: 0 * 12,
        isHome: true,
        q: query?.q || '',
        type: query?.type || '',
        fromServerRequest: true
      }, {
        Authorization: token || '',
        'x-client-ip': getIpFromHeaders(ctx.req)
      })
    ]);
    return {
      props: {
        banners: banners?.data?.data || [],
        initPosts: feeds.data
      }
    };
  } catch (e) {
    return {
      props: {
        banners: [],
        initPosts: []
      }
    };
  }
};

const mapStates = (state: any) => ({
  user: { ...state.user.current },
  settings: { ...state.settings }
});

const mapDispatch = {};
export default connect(mapStates, mapDispatch)(HomePage);

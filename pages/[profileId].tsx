import SeoMetaHead from '@components/common/seo-meta-head';
import { IPerformer } from '@interfaces/performer';
import { performerService } from '@services/performer.service';
import { Button, Result, message } from 'antd';
import { useRouter } from 'next/router';
import nextCookie from 'next-cookies';
import { useEffect, useState } from 'react';
import { NextPageContext } from 'next/types'; import {
  ContactsOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { IError } from '@interfaces/setting';
import getConfig from 'next/config';
import { feedService } from '@services/feed.service';
import { IFeed } from '@interfaces/feed';
import ProfileContainer from '@components/performer/profile/profile-container';
import { getIpFromHeaders } from '@lib/request';

const { publicRuntimeConfig } = getConfig();

type IProps = {
  performer: IPerformer;
  previousRoute: string;
  error: IError;
  initPosts: {
    data: IFeed[];
    total: number;
  }
};

function Profile({
  performer, previousRoute, error, initPosts
}: IProps) {
  const router = useRouter();
  const [err, setErr] = useState(error);

  useEffect(() => {
    if (router.query.msg) {
      message.info(router.query.msg);
    }
    if (error || (router.query.message && router.query.statusCode)) {
      setErr({
        statusCode: error?.statusCode || parseInt(`${router.query.statusCode || '404'}`, 10),
        message: (error?.message || router.query.message) as string
      });
    }
  }, [router.query, error]);

  if (err) {
    return (
      <Result
        status={err?.statusCode as any || 404}
        title={err?.message || 'Not found'}
        extra={[
          <Button className="secondary" key="console" onClick={() => router.push('/home')}>
            <HomeOutlined />
            BACK HOME
          </Button>,
          <Button key="buy" className="primary" onClick={() => router.push('/contact')}>
            <ContactsOutlined />
            CONTACT US
          </Button>
        ]}
      />
    );
  }

  return (
    <>
      <SeoMetaHead
        canonicalUrl={`${publicRuntimeConfig.SITE_URL}${router.asPath}`}
        item={performer}
        imageUrl={performer?.avatar}
      />
      <ProfileContainer
        performer={performer}
        previousRoute={previousRoute}
        initPosts={initPosts}
      />
    </>
  );
}

Profile.authenticate = true;
Profile.noredirect = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const { query } = ctx;
    const { token } = nextCookie(ctx);
    const headers = {
      Authorization: token || '',
      'x-client-ip': getIpFromHeaders(ctx.req)
    };
    const [performer, posts] = await Promise.all([
      performerService.findOne(`${query.profileId}?fromServerRequest=true`, headers),
      feedService.userSearchWithUsername(`${query.profileId}`, {
        limit: 12,
        offset: 0 * 12,
        type: query?.type || '',
        fromServerRequest: true
      }, headers)
    ]);
    const previousRoute = ctx?.req?.headers?.referer || null;
    return {
      props: {
        initPosts: posts.data,
        performer: performer.data,
        previousRoute
      }
    };
  } catch (e) {
    console.log(await e);
    return {
      props: {
        error: await e
      }
    };
  }
};

export default Profile;

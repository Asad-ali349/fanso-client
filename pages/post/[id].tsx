import { ArrowLeftOutlined } from '@ant-design/icons';
import SeoMetaHead from '@components/common/seo-meta-head';
import {
  IFeed
} from '@interfaces/index';
import { feedService } from '@services/index';
import nextCookie from 'next-cookies';
import FeedCard from '@components/post/card/feed-card';
import PageHeading from '@components/common/page-heading';
import { NextPageContext } from 'next/types';
import ViewMediaPopupContainer from 'src/context/view-media-popup/view-media-popup-container';
import { getIpFromHeaders } from '@lib/request';

interface IProps {
  feed: IFeed;
  previousRoute: string;
}

function PostDetails({
  feed, previousRoute
}: IProps) {
  return (
    <>
      <SeoMetaHead pageTitle={`${feed?.slug || ''}`} />
      <div className="main-container">
        {previousRoute && <PageHeading title="Back" icon={<ArrowLeftOutlined />} />}
        <div
          className="main-container"
          style={{
            maxWidth: 680,
            margin: '10px auto'
          }}
        >

          <ViewMediaPopupContainer>
            <FeedCard feed={feed} />
          </ViewMediaPopupContainer>
        </div>
      </div>
    </>
  );
}

PostDetails.authenticate = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const { token } = nextCookie(ctx);
    const res = await feedService.findOne(`${ctx.query.id}?fromServerRequest=true`, {
      Authorization: token || '',
      'x-client-ip': getIpFromHeaders(ctx.req)
    });

    const previousRoute = ctx.req.headers?.referer || null;
    return {
      props: {
        feed: res.data,
        previousRoute
      }
    };
  } catch {
    return { notFound: true };
  }
};

export default PostDetails;

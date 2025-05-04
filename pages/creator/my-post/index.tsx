import { FireOutlined, PlusCircleOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import PerformerPostListing from '@components/performer/list/performer-post-list';
import Link from 'next/link';

function PostListing() {
  return (
    <>
      <SeoMetaHead pageTitle="My Posts" />
      <div className="main-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <PageHeading title="My Posts" icon={<FireOutlined />} />
          <Link href="/creator/my-post/create">
            <PlusCircleOutlined />
            {' '}
            New Post
          </Link>
        </div>
        <PerformerPostListing />
      </div>
    </>
  );
}

PostListing.authenticate = true;
PostListing.onlyPerformer = true;

export default PostListing;

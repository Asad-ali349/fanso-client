import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import PerformerGridCard from '@components/performer/card/grid-card';
import {
  Col, Pagination, Row
} from 'antd';
import { ModelIcon } from 'src/icons';
import { performerService } from 'src/services';
import { showError } from '@lib/utils';
import { isMobile } from 'react-device-detect';
import PerformerAdvancedFilter from '@components/performer/common/performer-advanced-filter';
import { useEffect, useRef, useState } from 'react';
import SkeletonPerformerCard from '@components/performer/card/skeleton-grid';

function Performers() {
  const [data, setData] = useState({ data: [], total: 0 });
  const [fetching, setFetching] = useState(true);
  const page = useRef(1);
  const filters = useRef({});

  const getData = async () => {
    try {
      setFetching(true);
      const resp = await performerService.search({
        limit: 12,
        offset: 12 * (page.current - 1),
        sortBy: 'live', // default
        ...filters.current
      });
      setData(resp.data);
    } catch (e) {
      showError(e);
    } finally {
      setFetching(false);
    }
  };

  const handleFilter = (val) => {
    page.current = 1;
    filters.current = val;
    getData();
  };

  const handlePaginationChange = (current: number) => {
    page.current = current;
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <SeoMetaHead pageTitle="Creators" />
      <div className="main-container">
        <PageHeading title="Creators" icon={<ModelIcon />} />
        <PerformerAdvancedFilter onSubmit={handleFilter} />
        <Row>
          {!fetching && data.data.length > 0 && data.data.map((p) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
              <PerformerGridCard performer={p} />
            </Col>
          ))}
          {fetching && Array.from({ length: 12 }).map((_, i) => (
            <Col xs={24} sm={12} md={8} lg={6} key={`skeleton_loading_${i + 1}`}>
              <SkeletonPerformerCard />
            </Col>
          ))}
        </Row>
        {!data.total && !fetching && <p className="text-center" style={{ margin: 20 }}>No profile was found</p>}
        <div className="text-center" style={{ margin: '20px 0' }}>
          {data.total > 0 && data.total > 12 && (
          <Pagination
            current={page.current}
            total={data.total}
            pageSize={12}
            onChange={handlePaginationChange}
            showSizeChanger
            simple={isMobile}
          />
          )}
        </div>
      </div>
    </>
  );
}

Performers.authenticate = true;

export default Performers;

import { IPerformer } from '@interfaces/performer';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ScrollListProduct = dynamic(() => (import('@components/product/scroll-list-item')));
const FilterContentsBar = dynamic(() => (import('./search-bar')));

type Props = {
  performer: IPerformer
};

function ProductTab({
  performer
}: Props) {
  const [total, setTotal] = useState(performer?.stats?.totalProducts || 0);

  return (
    <>
      <div className="heading-tab">
        <h4>
          {total > 0 && total}
          {' '}
          {total > 1 ? 'PRODUCTS' : 'PRODUCTS'}
        </h4>
        <FilterContentsBar tab="store" performerId={performer._id} />
      </div>
      <ScrollListProduct
        query={{
          performerId: performer._id
        }}
        getTotal={(t) => setTotal(t)}
      />
    </>
  );
}

export default ProductTab;

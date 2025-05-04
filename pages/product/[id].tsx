import SeoMetaHead from '@components/common/seo-meta-head';
import {
  productService
} from '@services/index'; import { IProduct } from 'src/interfaces';
import nextCookie from 'next-cookies';
import ProductDetailsWrapper from '@components/product/details/product-details-wrapper';
import { NextPageContext } from 'next/types';
import { getIpFromHeaders } from '@lib/request';

interface IProps {
  product: IProduct;
}

function ProductViewPage({
  product
}: IProps) {
  return (
    <>
      <SeoMetaHead item={product} />
      <ProductDetailsWrapper product={product} />
    </>
  );
}

ProductViewPage.authenticate = true;

ProductViewPage.getInitialProps = async (ctx: NextPageContext) => {
  try {
    const { query } = ctx;
    const { token } = nextCookie(ctx);
    const product = await productService.userView(`${query.id}?fromServerRequest=true`, {
      Authorization: token || '',
      'x-client-ip': getIpFromHeaders(ctx.req)
    });
    return {
      product: product.data
    };
  } catch {
    return { notFound: true };
  }
};

export default ProductViewPage;

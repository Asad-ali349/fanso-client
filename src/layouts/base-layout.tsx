import { ConfigProvider } from 'antd';
import dynamic from 'next/dynamic';

const PublicLayout = dynamic(() => import('./public-layout'));
const BlankLayout = dynamic(() => import('./blank-layout'));
const GEOLayout = dynamic(() => import('./geoBlocked-layout'));
const MaintenaceLayout = dynamic(() => import('./maintenance-layout'));
const PrimaryLayout = dynamic(() => import('./primary-layout'));
const HomeLayout = dynamic(() => import('./home-layout'));
const GlobalEffect = dynamic(() => import('@components/common/base/global-effect'), { ssr: false });

declare global {
  interface Window {
    addToHomescreen: () => void;
  }
}
interface DefaultProps {
  children: any;
  layout: string;
  maintenance: boolean;
  geoBlocked: boolean;
}

const LayoutMap = {
  geoBlock: GEOLayout,
  maintenance: MaintenaceLayout,
  primary: PrimaryLayout,
  public: PublicLayout,
  blank: BlankLayout,
  home: HomeLayout
};

export default function BaseLayout({
  children, layout, maintenance = false, geoBlocked = false
}: DefaultProps) {
  // eslint-disable-next-line no-nested-ternary
  const Container = maintenance ? LayoutMap.maintenance : geoBlocked ? LayoutMap.geoBlock : layout && LayoutMap[layout] ? LayoutMap[layout] : LayoutMap.primary;
  return (
    <ConfigProvider theme={{
      hashed: false
    }}
    >
      <Container>
        {children}
        <GlobalEffect />
      </Container>
    </ConfigProvider>
  );
}

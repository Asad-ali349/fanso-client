import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loader from './loader';

export default function GlobalEffect() {
  const [routerChange, setRouterChange] = useState(false);

  const router = useRouter();

  const onRouterChangComplete = () => {
    setTimeout(() => setRouterChange(false), 500);
  };

  const onRouterChangeStart = (url, { shallow }) => {
    !shallow && setRouterChange(true);
  };

  useEffect(() => {
    router.events.on('routeChangeStart', onRouterChangeStart);
    router.events.on('routeChangeComplete', onRouterChangComplete);
    return () => {
      router.events.off('routeChangeStart', onRouterChangeStart);
      router.events.off('routeChangeComplete', onRouterChangComplete);
    };
  }, [router.pathname]);

  useEffect(() => {
    process.env.NODE_ENV === 'production' && document.addEventListener('contextmenu', (event) => event.preventDefault());
    // isMobile && window.addToHomescreen && window.addToHomescreen();
    return () => {
      process.env.NODE_ENV === 'production' && document.removeEventListener('contextmenu', (event) => event.preventDefault());
    };
  }, []);

  return <Loader active={routerChange} customText="" />;
}

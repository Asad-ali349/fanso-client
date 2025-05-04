import AgoraRTC, { ClientConfig, IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import Router from 'next/router';
import {
  createElement,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import Player from 'video.js/dist/types/player';

type Props = {
  config: ClientConfig;
  appConfiguration: AppConfiguration
};

type AgoraRTCProviderState = {
  client: IAgoraRTCClient;
  appConfiguration: AppConfiguration;
  config: ClientConfig;
  setPublishRef: (player: Player) => void;
  getPublishRef: () => Player;
  setPlayRef: (player: Player) => void;
  getPlayRef: () => Player;
};

type AppConfiguration = {
  agoraAppId: string;
  agoraEnable: boolean;
};

const AgoraContext = createContext<AgoraRTCProviderState>(null);

function AgoraProvider({
  config,
  children,
  appConfiguration
}: PropsWithChildren<Props>) {
  const [client, setClient] = useState<IAgoraRTCClient>();

  const publishRef = useRef<Player>();
  const playRef = useRef<Player>();

  const onbeforeunload = () => {
    if (client) {
      client.removeAllListeners();
    }
  };

  useEffect(() => {
    Router.events.on('routeChangeStart', onbeforeunload);
    window.addEventListener('beforeunload', onbeforeunload);

    const _client = AgoraRTC.createClient(config);
    if (_client) {
      setClient(_client);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
      Router.events.off('routeChangeStart', onbeforeunload);
    };
  }, []);

  const setPublishRef = (player) => {
    publishRef.current = player;
  };

  const getPublishRef = () => publishRef.current;

  const setPlayRef = (player) => {
    playRef.current = player;
  };

  const getPlayRef = () => playRef.current;

  const value = useMemo(
    () => ({
      client,
      appConfiguration,
      config,
      setPublishRef,
      getPublishRef,
      setPlayRef,
      getPlayRef
    }),
    [
      client,
      appConfiguration,
      config,
      setPublishRef,
      getPublishRef,
      setPlayRef,
      getPlayRef]
  );

  return createElement(AgoraContext.Provider, { value }, children);
}

AgoraProvider.displayName = 'AgoraProvider';

export const useAgora = () => useContext(AgoraContext);

export default AgoraProvider;

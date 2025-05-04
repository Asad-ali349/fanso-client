import dynamic from 'next/dynamic';
import SeoMetaHead from '@components/common/seo-meta-head';
import { settingService } from '@services/setting.service';
import FanRegisterForm from '@components/auth/fan-register-form';

type P = {
  loginPlaceholderImage: string;
  googleLoginClientId: string;
  googleLoginEnabled: boolean;
  twitterLoginEnabled: boolean
}

function FanRegister({
  loginPlaceholderImage,
  googleLoginClientId,
  googleLoginEnabled,
  twitterLoginEnabled
}: P) {
  return (
    <>
      <SeoMetaHead pageTitle="Fans Sign Up" />
      <FanRegisterForm
        loginPlaceholderImage={loginPlaceholderImage}
        googleLoginClientId={googleLoginClientId}
        googleLoginEnabled={googleLoginEnabled}
        twitterLoginEnabled={twitterLoginEnabled}
      />
    </>
  );
}

FanRegister.authenticate = false;
FanRegister.layout = 'public';

export const getServerSideProps = async () => {
  const meta = await settingService.valueByKeys([
    'loginPlaceholderImage',
    'googleLoginClientId',
    'googleLoginEnabled',
    'twitterLoginEnabled'
  ]);

  return {
    props: {
      loginPlaceholderImage: meta?.loginPlaceholderImage || '',
      googleLoginClientId: meta?.googleLoginClientId || '',
      googleLoginEnabled: meta?.googleLoginEnabled || false,
      twitterLoginEnabled: meta?.twitterLoginEnabled || false
    }
  };
};

export default FanRegister;

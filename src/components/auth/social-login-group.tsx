import dynamic from 'next/dynamic';
import { Divider } from 'antd';
import { GoogleOAuthProvider } from '@react-oauth/google';
import style from './social-login-group.module.scss';

const TwitterLoginButton = dynamic(() => import('@components/auth/twitter-login-button'));
const GoogleLoginButton = dynamic(() => import('@components/auth/google-login-button'));

export function SocialLoginGroup({
  googleLoginEnabled,
  googleLoginClientId,
  twitterLoginEnabled
}: {
  googleLoginEnabled: boolean;
  googleLoginClientId: string;
  twitterLoginEnabled: boolean;
}) {
  return (
    <div className={style['social-login']}>
      {twitterLoginEnabled && <TwitterLoginButton />}
      {googleLoginClientId && googleLoginEnabled && (
      <GoogleOAuthProvider clientId={googleLoginClientId}>
        <GoogleLoginButton
          googleLoginClientId={googleLoginClientId}
        />
      </GoogleOAuthProvider>
      )}
      <Divider>Or</Divider>
    </div>
  );
}

export default SocialLoginGroup;

import SeoMetaHead from '@components/common/seo-meta-head';
import { settingService } from '@services/setting.service';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect } from 'react';
import { authService } from '@services/auth.service';
import { userService } from '@services/user.service';
import Router from 'next/router';
import SocialLoginGroup from '@components/auth/social-login-group';
import LoginForm from '@components/auth/login-form';
import style from './login.module.scss';

const Logo = dynamic(() => import('@components/common/base/logo'), { ssr: false });

type Props = {
  title: string;
  metaKeywords: string;
  metaDescription: string;
  loginPlaceholderImage: string;
  googleLoginClientId: string;
  googleLoginEnabled: boolean;
  twitterLoginEnabled: boolean
};

function Login({
  title,
  metaKeywords,
  metaDescription,
  loginPlaceholderImage,
  googleLoginClientId,
  googleLoginEnabled,
  twitterLoginEnabled
}: Props) {
  const handleLoggedInRedirect = async () => {
    const token = authService.getToken();
    if (!token) return;
    try {
      const user = await userService.me({
        Authorization: token || ''
      });

      if (user.data.isPerformer) {
        Router.push(`/${user.data.username}`);
        return;
      }
      Router.push('/home');
    } catch (e) {
      authService.removeToken();
    }
  };

  useEffect(() => {
    handleLoggedInRedirect();
  }, []);

  return (
    <>
      <SeoMetaHead
        pageTitle={title || 'Login'}
        keywords={metaKeywords}
        description={metaDescription}
      />
      <div className="main-container">
        <div className={style['login-box']}>
          <div className={`${style['content-left']}`}>
            <Image
              alt="welcome-placeholder"
              fill
              priority
              quality={70}
              sizes="(max-width: 768px) 100vw, (max-width: 2100px) 40vw"
              src={loginPlaceholderImage || '/auth-img.png'}
            />
          </div>
          <div className={`${style['content-right']}`}>
            <div className={style.logo}>
              <Logo />
            </div>
            <p className="text-center">
              <small>Sign up to make money and interact with your fans!</small>
            </p>
            <SocialLoginGroup
              googleLoginClientId={googleLoginClientId}
              googleLoginEnabled={googleLoginEnabled}
              twitterLoginEnabled={twitterLoginEnabled}
            />
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}

Login.authenticate = false;
Login.layout = 'public';

export const getServerSideProps = async () => {
  const meta = await settingService.valueByKeys([
    'homeTitle',
    'homeMetaKeywords',
    'homeMetaDescription',
    'loginPlaceholderImage',
    'googleLoginClientId',
    'googleLoginEnabled',
    'twitterLoginEnabled'
  ]);
  return {
    props: {
      title: meta?.homeTitle || '',
      metaKeywords: meta?.homeMetaKeywords || '',
      metaDescription: meta?.homeMetaDescription || '',
      loginPlaceholderImage: meta?.loginPlaceholderImage || '',
      googleLoginClientId: meta?.googleLoginClientId || '',
      googleLoginEnabled: meta?.googleLoginEnabled || false,
      twitterLoginEnabled: meta?.twitterLoginEnabled || false
    }
  };
};

export default Login;

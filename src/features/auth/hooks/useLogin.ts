import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { service } from '../../../service';
import { setIsLogin } from '../../../store/reducer/AuthHelper';
import { StorageManager } from '../../../storagemanager';
import { SnackNotification } from '../../../helper/snackMessage';
import type { ILoginPayload } from '../../../service/service';

const EMAIL_DOMAINS = ['neosoftmail.com', 'neosoft.in', 'neosoft.com'] as const;

export const useLogin = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [emailUsername, setEmailUsername] = useState('');
  const [emailDomain, setEmailDomain] = useState<string>(EMAIL_DOMAINS[0]);
  const [credentials, setCredentials] = useState<ILoginPayload>({ username: '', password: '' });

  const handleUsernameChange = (value: string) => {
    const sanitized = value.replace(/\s|@/g, '');
    setEmailUsername(sanitized);
    setCredentials(prev => ({
      ...prev,
      username: sanitized ? `${sanitized}@${emailDomain}` : '',
    }));
  };

  const handleDomainChange = (domain: string) => {
    setEmailDomain(domain);
    setCredentials(prev => ({
      ...prev,
      username: emailUsername ? `${emailUsername}@${domain}` : '',
    }));
  };

  const handlePasswordChange = (value: string) => {
    setCredentials(prev => ({ ...prev, password: value.replace(/\s/g, '') }));
  };

  const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    if (!credentials.username) {
      SnackNotification('Please enter email.', 'error');
      return;
    }
    if (!credentials.password) {
      SnackNotification('Please enter password.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await service.userlogin(credentials);
      if (response.status === 200) {
        StorageManager.setAccessToken(response.data?.accessToken);
        StorageManager.setRefreshToken(response.data?.refreshToken);
        dispatch(setIsLogin({ isLogin: true }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    showPassword,
    remember,
    emailUsername,
    emailDomain,
    credentials,
    emailDomains: EMAIL_DOMAINS,
    setShowPassword,
    setRemember,
    handleUsernameChange,
    handleDomainChange,
    handlePasswordChange,
    submitLogin,
  };
};

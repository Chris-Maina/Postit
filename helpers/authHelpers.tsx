import { createContext, useContext, useEffect, useState } from "react";
import {useRouter} from 'next/router';
import Api from "./apiHelpers";
import { IUser } from '../common/interfaces';

/**
 * @description gets token exipiration date in milliseconds
 * @param {string} jwtToken
 * @returns {number || null}
 */
export const getExpirationDate = (jwtToken: string): number => {
  if (!jwtToken) return null;

  const jwt = JSON.parse(atob(jwtToken.split('.')[1]));
  // multiply by 1000 to convert seconds into milliseconds
  return jwt && jwt.exp && jwt.exp * 1000 || null
}

/**
 * 
 * @param {number} expDate 
 * @returns {boolean}
 */
export const isExpired = (expDate: any): boolean => {
  if (!expDate) return false;
  return Date.now() > expDate;
}


interface IUserPayload extends IUser {
  password: string,
  confirmPassword?: string,
}

interface IAuthContext {
  user: IUser,
  loading: boolean,
  error: string,
  token: string,
  getToken?: () => any,
  isLoggedIn?: () => boolean,
  register?: (data: IUserPayload) => void,
  login?: (data: IUserPayload) => void,
  fetchUser?: () => void,
  logout?: () => void,
  updateUser?: (user:IUser) => void,
}

const AuthContext = createContext<IAuthContext>({
  user: {
    email: '',
  },
  loading: false,
  error: '',
  token: ''
});

// Hook to access AuthContext
export const useAuthContext = () => {
  return useContext(AuthContext);
}

// Component wrapper to share auth value
export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

const useProvideAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  const router = useRouter();

  const register = async payload => {
    try {
      setLoading(true);
      const response = await Api.register(payload);
      setLoading(false);

      const  { first_name, last_name, email, id} = response.data;
      setUser({
        id,
        email,
        first_name,
        last_name,
      });
      router.push('/login');
    } catch (error) {
      setLoading(false);
      
      if (error.response && error.response.data.error.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Could not complete registration. Try again');
      }
    }
  }

  const login = async payload => {
    try {
      setLoading(true);
      const response = await Api.login(payload);
      setLoading(false);
      const  { first_name, last_name, email, id, access_token } = response.data;
      
      setUser({
        id,
        email,
        first_name,
        last_name,
      });

      setToken(access_token);
      router.push('/');
    } catch (error) {
      setLoading(false);
      
      if (error.response && error.response.data.error.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Could not complete login. Try again');
      }
    }
  }

  const logout = (): void => {
    setToken('');
    setUser(null);
    router.push('/');
  }

  /**
   * Check if there is a token
   * @returns {boolean}
   */
  const isLoggedIn = ():boolean => !!token;


  const getUserId = (): any=> {
    if (user && user.id) return user.id;
    if (token) {
      const mid = token.split('.')[1];
      const decodedToken: any = JSON.parse(window.atob(mid));
      return decodedToken.id;
    }
    return null;
  }

  /**
   * Refreshes token
   * @returns void
   */
  const getToken = async () => {
    let newToken = null;
    if (!token) {
      try {
        newToken = await Api.getAccessRefreshToken();
        setToken(newToken.data.access_token);
        return;
      } catch (error) {
        router.push('/');
      }
    } 
    const expDate = getExpirationDate(token);
    if (isExpired(expDate)) {
      try {
        newToken = await Api.getAccessRefreshToken();
        setToken(newToken.data.access_token);
      } catch (error) {
        router.push('/');
      }
    }
    return;
  }

  const fetchUser = async () => {
    try {
      const userId = getUserId();
      const response = await Api.fetchUser({ userId, token });
      const  { first_name, last_name, email, id } = response.data;
      setUser({
        id,
        email,
        first_name,
        last_name,
        posts: response.data?.posts || []
      });
    } catch (error) {
      if (error.response && error.response.data.error.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Could not fetch user. Try again');
      }
    }
  }

  const updateUser = async (data) => {
    try {
      let userId = data.id;
      if (!userId) {
        userId = getUserId();
      }
      const response = await Api.updateUser({
        ...data,
        id: userId,
        token,
      });
      const  { first_name, last_name, email, id } = response.data;
      setUser({
        id,
        email,
        first_name,
        last_name,
        posts: response.data?.posts || []
      });
    } catch (error) {
      if (error.response && error.response.data.error.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Could not update user. Try again');
      }
    }
  }

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    getToken,
    register,
    fetchUser,
    isLoggedIn,
    updateUser,
  }
}
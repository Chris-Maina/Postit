import { createContext, useContext, useEffect, useState } from "react";
import {useRouter} from 'next/router';
import Api from "./apiHelpers";
import { IUser } from '../common/interfaces';

/** 
 * @name createTokenProvider - Token Provider
 * @description Works directly with local storage and 
 * all changes of token will be done through it.
 * 
 */
export const createTokenProvider = () => {
  let _token = null;
  if (typeof window !== 'undefined') {
    _token = JSON.parse(localStorage.getItem('TOKENS'));
  }
  /**
   * @description gets etoken exipiration date in milliseconds
   * @param {string} jwtToken
   * @returns {number || null}
   */
  const getExpirationDate = (jwtToken: string): number => {
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
  const isExpired = (expDate: any): boolean => {
    if (!expDate) return false;
    return Date.now() > expDate;
  }

  const getToken = async () => {
    if (!_token) return null;
    const expDate = getExpirationDate(_token.access_token);
    if (isExpired(expDate)) {
      // get access token
      const updatedToken = await Api.getAccessRefreshToken(_token.refresh_token);
      setToken(updatedToken.data);
    }
    return _token && _token.access_token;
  }

  const getUserId = () => {
    if (!_token) return null;
    const mid = _token.access_token.split('.')[1];
    const decodedToken = JSON.parse(window.atob(mid));
    return decodedToken.id;
  }

  /**
   * Check if there is a token
   * @returns {boolean}
   */
  const isLoggedIn = ():boolean => !!_token;

  /**
   * Using the Observer pattern create a variable array to hold observers(functions)
   * and notify them of any state changes
   * 
   * observers: Array<(isLoggedIn: Boolean) => void>
   * NB: each element in this array is the function we should call after each change of tokens
   */
  let observers = [];

  /**
   * Adds a new observer
   * @param {func} observer - (isLogged) => void
   */
  const subscribe = (observer) => {
    observers.push(observer)
  }

  /**
   * Removes an observer - (isLogged) => void
   * @param {func} observer 
   */
  const unsubscribe = observer => {
    observers = observers.filter(ob => ob !== observer);
  }

  /**
   * Notifies observers of changes in the token obj i.e isLogged
   */
  const notify = () => {
    const isLogged = isLoggedIn();
    observers.forEach(observer => observer(isLogged));
  }

  /**
   * @description saving tokens in local storage (or clean local storage if the token is empty).
   *  Notifies observers about changes.
   * @param {object || null} token - { accessToken, refreshToken }
   */
  const setToken = (token): void => {
    if (typeof window === 'undefined') return;

    if (token) {
      localStorage.setItem('TOKENS', JSON.stringify(token))
    } else {
      localStorage.removeItem('TOKENS');
    }
    _token = token;
    notify();
  }
  return {
    getToken,
    isLoggedIn,
    setToken,
    subscribe,
    getUserId,
    unsubscribe,
  };
}

/**
 * @name useAuth
 * Custom hook that subscribes and unsubscribes to isLogged changes
 */
export const useIsLogged = () => {
  const tokenProvider = createTokenProvider();
  const [isLogged, setIsLogged] = useState(tokenProvider.isLoggedIn());
  useEffect(() => {
    const observer = (newIsLogged) => {
      setIsLogged(newIsLogged);
    }
    tokenProvider.subscribe(observer);
    return () => {
      tokenProvider.unsubscribe(observer)
    }
  }, []);

  return isLogged;
}


interface IUserPayload extends IUser {
  password: string,
  confirmPassword?: string,
}

interface IAuthContext {
  user: any,
  loading: boolean,
  error: string,
  register?: (data: IUserPayload) => void,
  login?: (data: IUserPayload) => void,
  fetchUser?: () => void,
  logout?: () => void,
}

const AuthContext = createContext<IAuthContext>({
  user: {},
  loading: false,
  error: '',
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
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const router = useRouter();
  const tokenProvider = createTokenProvider();

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
      router.push('/');
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
      
      const  { first_name, last_name, email, id, access_token, refresh_token} = response.data;
      
      setUser({
        id,
        email,
        first_name,
        last_name,
      });

      //  add tokens to local storage
      tokenProvider.setToken({ access_token, refresh_token });
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
    tokenProvider.setToken(null);
    setUser({});
  }

  const fetchUser = async () => {
    try {
      const userId = tokenProvider.getUserId();

      const response = await Api.fetchUser(userId);
      const  { first_name, last_name, email, id } = response.data;
      setUser({
        id,
        email,
        first_name,
        last_name,
      });
    } catch (error) {
      if (error.response && error.response.data.error.message) {
        setError(error.response.data.error.message);
      } else {
        setError('Could not fetch user. Try again');
      }
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    fetchUser,
  }
}
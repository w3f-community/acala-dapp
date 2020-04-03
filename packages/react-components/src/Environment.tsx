import React, { ReactNode, FC, useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { options } from '@acala-network/api';

const DEFAULT_ENDPOINT = 'wss://node-6640517791634960384.jm.onfinality.io/ws';

const CONNECT_TIMEOUT = 1000 * 60; // one minute

interface EnvironmentProps {
  children: ReactNode;
  endpoint?: string;
}

interface ConnectStatus {
  connected: boolean;
  error: boolean;
  loading: boolean;
}

export interface EnvironmentData {
  api: ApiPromise;
  connected: boolean;
  error: boolean;
  endpoint: string;
  loading: boolean;
  setEndpoint: (enpoint: string) => void;
}

export const EnvironmentContext = React.createContext<EnvironmentData>(
  {} as EnvironmentData
);

/**
 * @name Environment
 * @description connect chain in the Environment Higher-Order Component.
 * @example
 * ```js
 *  <Environment endpoint={ENDPOINT} >
 *      {...something}
 *  </Environment>
 * ```
 */
export const Environment: FC<EnvironmentProps> = ({
  endpoint = DEFAULT_ENDPOINT,
  children
}) => {
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>(
    {} as ConnectStatus
  );
  const [_endpoint, _setEndpoint] = useState<string>(endpoint);
  const [api, setApi] = useState<ApiPromise>({} as ApiPromise);
  const setEndpoint = (endpoint: string): void => _setEndpoint(endpoint);

  useEffect(() => {
    // reset connect status
    setConnectStatus({ connected: false, error: false, loading: true });
    // content endpoint
    const provider = new WsProvider(_endpoint);
    const timeout = (time: number): Promise<void> =>
      new Promise((resolve, reject) => setTimeout(() => { reject(new Error('timeout')); }, time));

    Promise.race([
      ApiPromise.create(options({ provider })),
      timeout(CONNECT_TIMEOUT)
    ])
      .then((api: any) => {
        setApi(api as ApiPromise);
        setConnectStatus({ connected: true, error: false, loading: false });
      })
      .catch(() => {
        setConnectStatus({ connected: false, error: true, loading: false });
      });
  }, [_endpoint]);

  useEffect(() => {
    if (!connectStatus.connected) return;
    api.on('disconnected', () => {
      setConnectStatus({ connected: false, error: true, loading: false });
    });
    api.on('error', () => {
      setConnectStatus({ connected: false, error: true, loading: false });
    });

    return (): void => api.disconnect();
  }, [api, connectStatus]);

  return (
    <EnvironmentContext.Provider
      value={{
        api,
        endpoint: _endpoint,
        setEndpoint,
        ...connectStatus
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};

Environment.propTypes = {
  children: propTypes.element,
  endpoint: propTypes.string
};

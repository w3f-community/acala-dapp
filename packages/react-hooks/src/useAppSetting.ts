import { useEffect, useState } from 'react';
import parse from 'url-parse';

const DEFAULT_ENDPOINT = [
  'wss://node-6661046769230852096.jm.onfinality.io/ws',
  'wss://node-6661046769218965504.rz.onfinality.io/ws',
  'wss://testnet-node-1.acala.laminar.one/ws',
];

interface HooksReturnType {
  endpoints: string | string[];
}

export const useAppSetting = (): HooksReturnType => {
  const [endpoints, setEndpoints] = useState<string | string[]>('');
  const url = parse(window.location.href, true);

  useEffect(() => {
    // read url config
    if (url.query.endpoint) {
      setEndpoints(url.query.endpoint);
    } else {
      setEndpoints(DEFAULT_ENDPOINT);
    }
  }, [url.query.endpoint]);

  return { endpoints };
};

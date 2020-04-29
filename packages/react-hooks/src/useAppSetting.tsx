import { useEffect, useState } from "react";
import parse from 'url-parse';

const DEFAULT_ENDPOINT = 'wss://testnet-node-1.acala.laminar.one/ws';

export const useAppSetting = ({ defaultEndpoint } = { defaultEndpoint: DEFAULT_ENDPOINT }) => {
  const [endpoint, setEndpoint] = useState<string>('');
  const url = parse(window.location.href, true);

  useEffect(() => {
    // read url config
    if (url.query.endpoint) {
      setEndpoint(url.query.endpoint);
    } else {
      setEndpoint(DEFAULT_ENDPOINT);
    }
  }, []);

  return { endpoint };
}

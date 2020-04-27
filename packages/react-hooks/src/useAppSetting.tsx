import { useEffect, useState } from "react";
import parse from 'url-parse';

const DEFAULT_ENDPOINT = 'wss://node-6655590520181506048.jm.onfinality.io/ws?apikey=5fb96acf-6839-484f-9f3d-8784f26df699';

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

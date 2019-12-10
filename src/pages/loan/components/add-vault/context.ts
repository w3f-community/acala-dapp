import React from 'react';
import { ProviderData } from '@/hooks/form';

export const formContext = React.createContext<ProviderData>({} as ProviderData);

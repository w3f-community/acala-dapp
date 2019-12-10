import { RootState } from 'typesafe-actions';

export type Selector<Config, Result> = (state: RootState, config?: Config) => Result;

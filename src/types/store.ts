import { RootState } from 'typesafe-actions';

interface BaseConfig {
    toJS?: boolean;
}
export type Selector<Result, Config> = (state: RootState, config?: BaseConfig & Config) => Result;

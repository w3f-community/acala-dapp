import { RootState } from 'typesafe-actions';

export type Selector<Result> = (state: RootState) => Result;

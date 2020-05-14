import { useReducer, useEffect } from "react";
import { useApi } from "./useApi";
import { CallOptions, CallParam, CallParams } from './types';
import { Codec, AnyJson } from "@polkadot/types/types";

interface TrackFnCallback {
  (value: Codec): void;
}

type TrackFnResult = Promise<() => void>;

interface TrackFn {
  (a: CallParam, b: CallParam, c: CallParam, cb: TrackFnCallback): TrackFnResult;
  (a: CallParam, b: CallParam, cb: TrackFnCallback): TrackFnResult;
  (a: CallParam, cb: TrackFnCallback): TrackFnResult;
  (cb: TrackFnCallback): TrackFnResult;
  meta?: {
    type: {
      isDoubleMap: boolean;
    };
  };
}

interface ReducerAction {
  type: 'WATCH'
}

function queryReducer = (state: AnyJson, action: ReducerAction) => {
  return {
  };
}

const initializeState = {};


const useQuery = (fn: TrackFn | undefined | null | false, params: CallParams = []) => {
  const { api } = useApi();

  const [state, dispatch] = useReducer(queryReducer, initializeState);

  useEffect(() => {
    dispatch({ type: 'WATCH', params: { fn, params } });
  }, [fn, params]);

}
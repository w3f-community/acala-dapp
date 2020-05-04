import { SubmittableExtrinsic } from "@polkadot/api/types";
import { useAccounts } from "./useAccounts";
import { useEffect, useState } from "react";
import { Observable, Subject } from "rxjs";
import Dexie from 'dexie';

interface QueryType {
  method: string;
  section: string;
  signer: string;
  filter?: () => boolean;
}


export const useHistory = () => {
  const addHistory = (tx: SubmittableExtrinsic<'promise'>) => {
  };

  const getHistory = (query: QueryType, callback: (result: any[]) => void) => {
  
  };

  return {
    addHistory,
    getHistory,
  }
}
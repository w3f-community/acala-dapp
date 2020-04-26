import React, { createContext, useState, FC } from "react";
import { BareProps } from "@honzon-platform/ui-components/types";
import { CurrencyId } from "@acala-network/types/interfaces";

type CREATE_STEP = 'select' | 'generate' | 'confirm';

export interface ProviderData {
  step: CREATE_STEP;
  setStep: (step: CREATE_STEP) => void;
  selectedToken: CurrencyId;
  setSelectedToken: (token: CurrencyId) => void;
  deposit: number;
  setDeposit: (num: number) => void;
  generate: number;
  setGenerate: (num: number) => void;
}

export const createProviderContext = createContext<ProviderData>({} as ProviderData);

interface Props extends BareProps {};

export const CreateProvider: FC<Props> = ({
  children
}) => {
  const [step, _setStep] = useState<CREATE_STEP>('select');
  const [selectedToken, _setSelectedToken] = useState<CurrencyId>(null as any as CurrencyId);
  const [deposit, setDeposit] = useState<number>(0);
  const [generate, setGenerate] = useState<number>(0);

  const setStep = (step: CREATE_STEP) => {
    _setStep(step);
  };

  const setSelectedToken = (token: CurrencyId) => {
    _setSelectedToken(token);
  };

  return (
    <createProviderContext.Provider
      value={{
        step,
        setStep,
        selectedToken,
        setSelectedToken,
        deposit,
        setDeposit,
        generate,
        setGenerate,
      }}
    >
      {children}
    </createProviderContext.Provider>
  );
}
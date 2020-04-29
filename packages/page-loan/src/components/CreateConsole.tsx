import React, { FC, useState, useContext } from 'react';
import { Card, Step } from '@honzon-platform/ui-components';
import { SelectCollateral } from './SelectCollateral';
import classes from './CreateConsole.module.scss';
import { Generate } from './Generate';
import { CreateProvider, createProviderContext } from './CreateProvider';
import { useApi } from '@honzon-platform/react-hooks';
import { getStableCurrencyId } from '@honzon-platform/react-components';
import { Confirm } from './Confirm';
import { Success } from './Success';


const Inner: FC = () => {
  const { api } = useApi();
  const { step, selectedToken } = useContext(createProviderContext);

  const stepConfig = [
    {
      index: 'select',
      text: 'Select Collateral'
    },
    {
      index: 'generate',
      text: 'Generate aUSD'
    },
    {
      index: 'confirm',
      text: 'Confirm'
    }
  ];
  const renderTips = (): string => {
    const stableCurrency = getStableCurrencyId(api).toString();

    if (step === 'select') {
      return 'Each collateral type has its own unique risk profiles.';
    }
    if (step === 'generate') {
      return `Deposit ${selectedToken.toString()} as collateral to genearte ${stableCurrency}`;
    }

    if (step === 'confirm') {
      return `Confirm creating a collateralized loan for ${stableCurrency}`;
    }
    return '';
  };

  return (
    <Card
      className={classes.root}
      gutter={false}
    >
    {
      step !== 'success' ? (
        <>
          <Step
            config={stepConfig}
            current={step}
          />
          <p className={classes.tips}>{renderTips()}</p>
          {step === 'select' ? <SelectCollateral /> : null}
          {step === 'generate' ? <Generate /> : null}
          {step === 'confirm' ? <Confirm /> : null}
        </>
      ) : <Success />
    }
    </Card>
  );
};

export const CreateConsole = () => {
  return (
    <CreateProvider>
      <Inner />
    </CreateProvider>
  );
}

import React, { FC, memo, useContext, ReactElement, ChangeEvent } from 'react';
import { noop } from 'lodash';
import { useFormik } from 'formik';

import { CurrencyId } from '@acala-network/types/interfaces';
import { Card, Tag } from '@honzon-platform/ui-components';
import { BalanceInput, TxButton, SwapContext, formatCurrency, numToFixed18Inner } from '@honzon-platform/react-components';

import classes from './SwapConsole.module.scss';

interface InputAreaProps {
  title: string;
  token: CurrencyId | string;
  onTokenChange: (token: CurrencyId) => void;
  value: number;
  onChange: any;
  inputName: string;
}

const InputArea: FC<InputAreaProps> = memo(({
  inputName,
  onChange,
  onTokenChange,
  title,
  token,
  value
}) => {
  return (
    <div>
      <p>{title}</p>
      <BalanceInput
        enableTokenSelect
        name={inputName}
        onChange={onChange}
        onTokenChange={onTokenChange}
        token={token}
        value={value}
      />
    </div>
  );
});

InputArea.displayName = 'InputArea';

interface SwapBtn {
  onClick: () => void;
}

function SwapBtn ({ onClick }: SwapBtn): ReactElement {
  return (
    <button onClick={onClick}>
      Swap
    </button>
  );
}

interface SwapInfoProps {
  supply: number;
  supplyCurrency: CurrencyId;
  target: number;
  targetCurrency: CurrencyId;
  slippage: number;
}

const SwapInfo: FC<SwapInfoProps> = memo(({
  slippage,
  supply,
  supplyCurrency,
  target,
  targetCurrency
}) => {
  return (
    <div>
      <p>
        You are selling
        <Tag>{`${supply}${formatCurrency(supplyCurrency)}`}</Tag>
        for at least
        <Tag>{`${target}${formatCurrency(targetCurrency)}`}</Tag>
      </p>
      <p>
        Expected price slippage <Tag>{slippage}</Tag>
      </p>
    </div>
  );
});

SwapInfo.displayName = 'SwapInfo';

interface SlippageInputAreaProps {
  defaultSlippage: number;
  onChange: (slippage: number) => void;
}

const SlippageInputArea: FC<SlippageInputAreaProps> = memo(() => {
  const suggested = [0.001, 0.05, 0.1];

  return (
    <div>
      <p>Limit addtion price slippage</p>
      <div>
        {
          suggested.map((suggest): ReactElement => {
            return <Tag key={`suggest-${suggest}`}>{suggest}</Tag>;
          })
        }
      </div>
    </div>
  );
});

SlippageInputArea.displayName = 'SlippageInputArea';

export const SwapConsole: FC = memo(() => {
  const {
    calcSupply,
    calcTarget,
    setSlippage,
    setSupplyCurrency,
    setTargetCurrency,
    supplyCurrency,
    targetCurrency
  } = useContext(SwapContext);
  const form = useFormik({
    initialValues: {
      supply: '' as any as number,
      target: '' as any as number
    },
    onSubmit: noop
  });

  const onSwap = (): void => {
    setSupplyCurrency(targetCurrency);
    setTargetCurrency(supplyCurrency);
    form.resetForm();
  };

  const onSupplyChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.currentTarget.value);
    const target = calcTarget(value);

    form.setFieldValue('target', target);
    form.handleChange(event);
  };

  const onTargetChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.currentTarget.value);
    const target = calcSupply(value);

    form.setFieldValue('supply', target);
    form.handleChange(event);
  };

  return (
    <Card className={classes.root}>
      <div className={classes.main}>
        <InputArea
          inputName='supply'
          onChange={onSupplyChange}
          onTokenChange={setSupplyCurrency}
          title='Pay With'
          token={supplyCurrency}
          value={form.values.supply as any as number}
        />
        <SwapBtn onClick={onSwap} />
        <InputArea
          inputName='target'
          onChange={onTargetChange}
          onTokenChange={setTargetCurrency}
          title='Receive'
          token={targetCurrency}
          value={form.values.target as any as number}
        />
        <TxButton
          method='swapCurrency'
          params={
            [
              supplyCurrency,
              numToFixed18Inner(form.values.supply),
              targetCurrency,
              numToFixed18Inner(form.values.target)
            ]
          }
          section='dex'
        >
          Swap
        </TxButton>
      </div>
      <div className={classes.information}>
        <SwapInfo
          slippage={0}
          supply={form.values.supply}
          supplyCurrency={supplyCurrency}
          target={form.values.target}
          targetCurrency={targetCurrency}
        />
      </div>
      <div className={classes.slippage}>
        <SlippageInputArea
          onChange={setSlippage}
          value={0}
        />
      </div>
    </Card>
  );
});

SwapConsole.displayName = 'SwapConsole';

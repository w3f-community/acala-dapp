import React, { FC } from 'react'
import { noop } from 'lodash';
import { Dialog, ButtonProps, Button } from '@honzon-platform/ui-components';
import { useModal, useApi, useFormValidator, useLoan } from '@honzon-platform/react-hooks';
import { CurrencyId } from '@acala-network/types/interfaces';
import { getStableCurrencyId, BalanceInput, TxButton } from '@honzon-platform/react-components';
import { useFormik } from 'formik';
import { stableCoinToDebit, Fixed18 } from '@acala-network/app-util';

import classes from './LoanActionButton.module.scss';

type ActionType = 'payback' | 'generate' | 'deposit' | 'withdraw';

interface Props extends Omit<ButtonProps, 'onClick'> {
  type: ActionType;
  text: string;
  token: CurrencyId | string;
  max: number;
}

export const LonaActionButton: FC<Props> = ({
  type,
  token,
  text,
  max,
  ...other
}) => {
  const { api } = useApi();
  const { status, open, close } = useModal(false);
  const stableCurrency = getStableCurrencyId(api);
  const validator = useFormValidator({
    value: {
      type: 'number',
      max: max,
      min: 0
    }
  });
  const form = useFormik({
    initialValues: {
      value: '' as any as number
    },
    validate: validator,
    onSubmit: noop
  });
  const { currentUserLoanHelper } = useLoan(token);

  const operateStableCurrency = (): boolean => {
    return type === 'payback' || type === 'generate';
  }

  const getDialogTitle = () => {
    const _token = operateStableCurrency() ? stableCurrency : token;
    
    return `${text} ${_token}`;
  };

  const handleClick = (): void => {
    open();
  };

  const getParams = () => {
    const _params = [token, '0', '0'];

    if (!form.values.value) {
      return _params;
    }

    if (type === 'payback') {
      _params[2] = '-' + stableCoinToDebit(
        Fixed18.fromNatural(form.values.value),
        currentUserLoanHelper.debitExchangeRate
      ).innerToString();
    }

    if (type === 'generate') {
      _params[2] = stableCoinToDebit(
        Fixed18.fromNatural(form.values.value),
        currentUserLoanHelper.debitExchangeRate
      ).innerToString();
    }

    if (type === 'deposit') {
      _params[1] = Fixed18.fromNatural(form.values.value).innerToString();
    }

    if (type === 'withdraw') {
      _params[1] = '-' + Fixed18.fromNatural(form.values.value).innerToString();
    }

    return _params;
  };

  const checkDisabled = (): boolean => {
    if (!form.values.value) {
      return true;
    }
    if (form.errors.value) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Button
        color='primary'
        onClick={handleClick}
        {...other}
      >
        {text}
      </Button>
      <Dialog
        className={classes.dialog}
        title={getDialogTitle()}
        visiable={status}
      >
        <BalanceInput
          id='value'
          name='value'
          error={!!form.errors.value}
          value={form.values.value}
          onChange={form.handleChange}
          token={operateStableCurrency() ? stableCurrency : token}
        />
        <div className={classes.action}>
          <Button
            size='small'
            onClick={close}
          >
            Cancel
          </Button>
          <TxButton
            size='small'
            disabled={checkDisabled()}
            section='honzon'
            method='adjustLoan'
            params={getParams()}
            onSuccess={close}
          >
            Confirm
          </TxButton>
        </div>
      </Dialog>
    </>
  );
};
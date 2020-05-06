import React, { FC, useEffect, useState, ChangeEvent } from 'react';
import { noop } from 'lodash';
import { Dialog, ButtonProps, Button, List, ListConfig } from '@honzon-platform/ui-components';
import { useModal, useFormValidator, useLoan, useConstants } from '@honzon-platform/react-hooks';
import { CurrencyId } from '@acala-network/types/interfaces';
import { BalanceInput, TxButton, FormatBalance, FormatFixed18 } from '@honzon-platform/react-components';
import { useFormik } from 'formik';
import { stableCoinToDebit, Fixed18 } from '@acala-network/app-util';

import classes from './LoanActionButton.module.scss';

type ActionType = 'payback' | 'generate' | 'deposit' | 'withdraw';

interface Props extends Omit<ButtonProps, 'onClick' | 'type'> {
  type: ActionType;
  text: string;
  token: CurrencyId | string;
  max: number;
}

export const LonaActionButton: FC<Props> = ({
  max,
  text,
  token,
  type,
  ...other
}) => {
  const { close, open, status } = useModal(false);
  const { stableCurrency } = useConstants();
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
  const { currentUserLoanHelper, setCollateral, setDebitStableCoin } = useLoan(token);
  const [listData, setListData] = useState<{[k in string]: Fixed18}>({});

  const operateStableCurrency = (): boolean => {
    return type === 'payback' || type === 'generate';
  };

  const getDialogTitle = () => {
    const _token = operateStableCurrency() ? stableCurrency : token;

    return `${text} ${_token}`;
  };

  const handleClick = (): void => {
    open();
  };

  const getParams = () => {
    const params = [token, '0', '0'];

    if (!form.values.value || !currentUserLoanHelper) {
      return params;
    }

    switch (type) {
      case 'payback': {
        params[2] = '-' + stableCoinToDebit(
          Fixed18.fromNatural(form.values.value),
          currentUserLoanHelper.debitExchangeRate
        ).innerToString();
        break;
      }

      case 'generate': {
        params[2] = stableCoinToDebit(
          Fixed18.fromNatural(form.values.value),
          currentUserLoanHelper.debitExchangeRate
        ).innerToString();
        break;
      }

      case 'deposit': {
        params[1] = Fixed18.fromNatural(form.values.value).innerToString();
        break;
      }

      case 'withdraw': {
        params[1] = '-' + Fixed18.fromNatural(form.values.value).innerToString();
        break;
      }
    }

    return params;
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

  const config: ListConfig[] = [
    {
      key: 'borrowed',
      title: 'Borrowed aUSD',
      render: (value) => {
        return <FormatBalance balance={value} />;
      }
    },
    {
      key: 'collateralRate',
      title: 'New Collateral Ratio',
      render: (value) => {
        return (
          <FormatFixed18
            data={value}
            format='percentage'
          />
        );
      }
    },
    {
      key: 'liquidationPrice',
      title: 'New Liquidation Price',
      render: (value) => {
        return (
          <FormatFixed18
            data={value}
            prefix='$'
          />
        );
      }
    }
  ];

  useEffect(() => {
    const value = form.values.value;

    if (value) {
      switch (type) {
        case 'deposit': {
          setCollateral(value);
          break;
        }

        case 'withdraw': {
          setCollateral(-value);
          break;
        }

        case 'generate': {
          setDebitStableCoin(value);
          break;
        }

        case 'payback': {
          setDebitStableCoin(-value);
          break;
        }
      }
    }
  }, [form.values.value, setCollateral, setDebitStableCoin, type]);

  useEffect(() => {
    setListData({
      borrowed: currentUserLoanHelper.debitAmount,
      collateralRate: currentUserLoanHelper.collateralRatio,
      liquidationPrice: currentUserLoanHelper.liquidationPrice
    });
  }, [currentUserLoanHelper]);

  const handleMax = () => {
    form.setFieldValue('value', max);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.handleChange(event);
  };

  const handleSuccess = () => {
    form.resetForm();
    close();
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
        action={
          <>
            <Button
              onClick={close}
              size='small'
            >
              Cancel
            </Button>
            <TxButton
              disabled={checkDisabled()}
              method='adjustLoan'
              onSuccess={handleSuccess}
              params={getParams()}
              section='honzon'
              size='small'
            >
              Confirm
            </TxButton>
          </>
        }
        className={classes.dialog}
        title={getDialogTitle()}
        visiable={status}
      >
        <BalanceInput
          error={!!form.errors.value}
          id='value'
          name='value'
          onChange={handleChange}
          onMax={handleMax}
          showMaxBtn
          token={operateStableCurrency() ? stableCurrency : token}
          value={form.values.value}
        />
        <List
          className={classes.list}
          config={config}
          data={listData}
          itemClassName={classes.listItem}
        />
      </Dialog>
    </>
  );
};

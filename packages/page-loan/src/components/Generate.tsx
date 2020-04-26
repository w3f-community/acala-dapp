import React, { useContext, ChangeEvent } from 'react';
import { noop } from 'lodash';
import { BalanceInput, UserBalance, getStableCurrencyId, Token, FormatFixed18, Price, LoanInterestRate, getValueFromTimestampValue } from '@honzon-platform/react-components';
import { createProviderContext } from './CreateProvider';
import { useFormik } from 'formik';
import { useApi, useLoan } from '@honzon-platform/react-hooks';
import classes from './Generate.module.scss';
import { Button, List, ListConfig } from '@honzon-platform/ui-components';
import { CurrencyId, Rate } from '@acala-network/types/interfaces';
import { convertToFixed18, Fixed18 } from '@acala-network/app-util';

const Overview = ({ data }: any) => {
  const listConfig: ListConfig[] = [
    {
      key: 'collateral',
      title: 'Collateralization',
      render: (value: CurrencyId) => {
        return <Token token={value} />
      }
    },
    {
      key: 'collateralRatio',
      title: 'Collateralization Ratio',
      render: (data: Fixed18) => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        )
      }
    },
    {
      key: 'collateral',
      title: 'DOT Price',
      render: (token: CurrencyId) => {
        return <Price token={token} />;
      }
    },
    {
      key: 'x',
      title: 'Interest Rate',
      render: (token: CurrencyId) => {
        return <LoanInterestRate token={token} />
      }
    },
    {
      key: 'liquidationPrice',
      title: 'Liquidation Price',
      render: (data: Fixed18) => {
        return <FormatFixed18 data={data} />;
      },
    },
    {
      key: 'liquidationRatio',
      title: 'Liquidation Ratio',
      render: (data: Fixed18) => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        );
      }
    },
    {
      key: 'liquidationPenalty',
      title: 'Liquidation Penalty',
      render: (data: Fixed18) => {
        return (
          <FormatFixed18
            data={data}
            format='percentage'
          />
        );
      }
    }
  ];
  return (
    <div className={classes.overview}>
      <List
        config={listConfig}
        data={data}
        itemClassName={classes.item}
      />
    </div>
  );
};

export const Generate = () => {
  const { api } = useApi();
  const { selectedToken } = useContext(createProviderContext);
  const stableCurrencyId = getStableCurrencyId(api);
  const { currentLoanType, currentUserLoanHelper, collateralPrice } = useLoan(selectedToken);

  const form = useFormik({
    initialValues: {
      deposit: '' as any as number,
      generate: '' as any as number
    },
    onSubmit: noop
  });

  const onDepositChange = (event: ChangeEvent<any>) => {
    form.handleChange(event);
  };

  const overview = {
    collateral: selectedToken,
    collateralRatio: currentUserLoanHelper.collateralRatio,
    collateralPrice: convertToFixed18(
      collateralPrice
      ? getValueFromTimestampValue(collateralPrice.price)
      : 0
    ),
    interestRate: currentUserLoanHelper.stableFeeAPR,
    liquidationPrice: currentUserLoanHelper.liquidationPrice,
    liquidationRatio: convertToFixed18(currentLoanType ? currentLoanType.liquidationRatio : 0),
    liquidationPenalty: convertToFixed18(currentLoanType? currentLoanType.liquidationPenalty : 0)
  };

  const onNext = () => {

  }

  const checkDisabled = () => {
    if (!form.values.deposit || !form.values.generate) {
      return true;
    }
    return false;
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.console}>
          <p className={classes.title}>
            How much DOT would you deposit as collateral?
          </p>
          <BalanceInput
            className={classes.input}
            id='deposit'
            name='deposit'
            token={selectedToken}
            value={form.values.deposit}
            onChange={onDepositChange}
          />
          <div className={classes.addon}>
            <span>Max to Lock</span>
            <UserBalance token={selectedToken} />
          </div>
          <p className={classes.title}>How much {stableCurrencyId.toString()} would you like to borrow?</p>
          <BalanceInput
            className={classes.input}
            id='generate'
            name='generate'
            token={selectedToken}
            value={form.values.generate}
            onChange={form.handleChange}
          />
          <div className={classes.addon}>
            <span>Max to borrow</span>
            <UserBalance token={selectedToken} />
          </div>
        </div>
        <Overview data={overview} />
      </div>
      <div className={classes.tips}>
        Note: collateralization ratio = amount borrowed / total collateral in USD must be above the required collateral ratio.
      </div>
      <div className={classes.action}>
        <Button
          size='small'
        >
          Previous
        </Button>
        <Button
          size='small'
        >
          Cancel
        </Button>
        <Button
          size='small'
          disabled={checkDisabled()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

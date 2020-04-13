import React, {ChangeEventHandler, FC, useContext, useState, ReactNode} from 'react';
import { Card } from "@honzon-platform/ui-components";
import { Fixed18 } from '@acala-network/app-util';
import {
  Grid,
  Typography,
  Box,
  FormControl,
  RadioGroup, FormControlLabel, Radio
} from "@material-ui/core";
import {StakingPoolContext, TxButton, formatCurrency, BalanceInput} from "@honzon-platform/react-components";
import { UnbondingList } from './UnbondingList';
import { noop } from 'lodash';
import { useFormik } from 'formik';

type REDEEM_TYPE = 'immediately' | 'target' | 'waitForUnbonding';

export const RedeemManipulate: FC = () => {
  const { stakingPool } = useContext(StakingPoolContext);
  const [value, setValue] = useState<number>(0);
  const [target, setTarget] = useState<number>(0);
  const [redeemType, setRedeemType] = useState<REDEEM_TYPE>('immediately');
  const form = useFormik({
    initialValues: {
      redeem: '',
    },
    onSubmit: noop // no need submit
  });
  const handleInput: ChangeEventHandler<HTMLInputElement> = e => {
    setValue(Number(e.target.value));
  };

  const handleTargetInput = (value: number) => {
    console.log(value);
    setTarget(value);
  };

  const handleRedeemTypeChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setRedeemType(value as REDEEM_TYPE);
  };

  const renderTips = (): ReactNode => {
    const stakingCurrencyName = formatCurrency(stakingPool.stakingCurrency);
    const tips: {[k in string]: string} = {
      'immediately': `You will redeem ${stakingCurrencyName} immediately, But will pay the most commission.`,
      'target': `You will redeem ${stakingCurrencyName} after the target era and will pay dynamic commission.`,
      'waitForUnbonding': `You will redeem after 10 era and will pay the least commission.`
    };
    return <Typography variant="body2">{tips[redeemType]}</Typography>;
  };

  return (
    <Card size="large" elevation={1}>
      <Typography variant="h5">Choose your redeem way</Typography>
      <Box paddingTop={2}/>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="redeem-type"
          name="redeem-type"
          value={redeemType}
          onChange={handleRedeemTypeChange}
        >
          <Box>
            <FormControlLabel value="immediately" control={<Radio />} label="Immediately" />
            <FormControlLabel value="target" control={<Radio />} label="Target ERA" />
            <FormControlLabel value="waitForUnbonding" control={<Radio />} label="Normal" />
          </Box>
        </RadioGroup>
      </FormControl>
      {renderTips()}
      {
        redeemType === 'target' ? (
          <>
            <Box paddingTop={4}/>
            <Typography variant="h5">Select which ERA to redeem</Typography>
            <Box paddingTop={2}/>
            <UnbondingList selected={target} onChange={handleTargetInput} />
          </>
        ) : null
      }
      <Box paddingTop={4}/>
      <Typography variant="h5">Enter the amount you want to redeem</Typography>
      <Box paddingTop={2}/>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <BalanceInput
            id="redeem"
            name="redeem"
            onChange={form.handleChange}
            token={stakingPool.liquidCurrency}
            value={form.values.redeem}
          />
        </Grid>
        <Grid item>
          <TxButton
            section="homa"
            method="redeem"
            params={[
              Fixed18.fromNatural(form.values.redeem).innerToString(),
              redeemType === 'target'? { target } : redeemType,
            ]}
          >
            Redeem
          </TxButton>
        </Grid>
      </Grid>
    </Card>
  );
};

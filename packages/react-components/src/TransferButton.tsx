import React, { FC, memo, useEffect } from 'react';
import { noop } from 'lodash';

import { CurrencyId } from '@acala-network/types/interfaces/types';
import { Dialog, Button, Input, FormItem } from '@honzon-platform/ui-components';
import { useModal, useFormValidator } from '@honzon-platform/react-hooks';
import { BareProps } from '@honzon-platform/ui-components/types';
import { formatCurrency, numToFixed18Inner } from './utils';
import { useFormik } from 'formik';
import { TxButton } from './TxButton';

interface Props extends BareProps {
  token: CurrencyId;
}

export const TransferButton: FC<Props> = memo(({
  children,
  token
}) => {
  const { close, status, toggle } = useModal(false);
  const validator = useFormValidator({
    account: {
      type: 'string',
      min: 0
    },
    amount: {
      type: 'balance',
      currency: token,
      min: 0
    }
  });
  const form = useFormik({
    initialValues: {
      account: '',
      amount: ''
    },
    validate: validator,
    onSubmit: noop
  });

  const checkDisabled = () => {
    if (!(form.values.account && form.values.amount)) {
      return true;
    }

    if (form.errors.account || form.errors.amount) {
      return true;
    }

    return false;
  };

  const onSuccess = () => {
    form.resetForm();
    close();
  };

  useEffect(() => {
    form.resetForm();
  }, [status]);

  return (
    <>
      <Button
        color='primary'
        onClick={toggle}
        size='small'
      >
        {children || 'Transfer'}
      </Button>
      <Dialog
        action={(
          <>
            <Button
              color='normal'
              onClick={close}
              size='small'
            >
              Cancel
            </Button>
            <TxButton
              disabled={checkDisabled()}
              method='transfer'
              onSuccess={onSuccess}
              params={[form.values.account, token, numToFixed18Inner(form.values.amount)]}
              section='currencies'
              size='small'
            >
              Transfer
            </TxButton>
          </>
        )}
        title={`Transfer ${formatCurrency(token)}`}
        visiable={status}
      >
        <div>
          <FormItem label='Account'>
            <Input
              error={!!form.errors.account}
              id='account'
              name='account'
              onChange={form.handleChange}
              value={form.values.account}
            />
          </FormItem>
          <FormItem label='Amount'>
            <Input
              error={!!form.errors.amount}
              id='amount'
              name='amount'
              onChange={form.handleChange}
              value={form.values.amount}
            />
          </FormItem>
        </div>
      </Dialog>
    </>
  );
});

TransferButton.displayName = 'TransferButton';

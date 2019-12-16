import React, { useState, ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@material-ui/core';
import { collateral, assets } from '@/config';
import actions from '@/store/actions';
import { AddStep } from './types';
import StepBar from './step-bar';
import SelectCollateral from './select-collateral';
import GenerateStableCoin from './generate-stable-coin';
import Confirm from './confirm';
import Success from './success';
import { formContext } from './context';
import { Provider as FormProvider } from '@/hooks/form';

interface Props {
    onCancel: () => void;
}

const initFormValues = {
    asset: { value: undefined },
    collateral: { value: undefined },
    borrow: { value: undefined },
    agree: { value: undefined },
};

const AddVault: React.FC<Props> = ({ onCancel }) => {
    const [step, setStep] = useState<AddStep>('select');

    const changeStep = (target: AddStep) => () => setStep(target);

    const renderCurrentStep = (step: AddStep): ReactNode => {
        if (step === 'select') {
            return <SelectCollateral onNext={changeStep('generate')} onCancel={onCancel} />;
        }
        if (step === 'generate') {
            return (
                <GenerateStableCoin onNext={changeStep('confirm')} onPrev={changeStep('select')} onCancel={onCancel} />
            );
        }
        if (step === 'confirm') {
            return <Confirm onNext={changeStep('success')} onPrev={changeStep('generate')} onCancel={onCancel} />;
        }
        if (step === 'success') {
            return <Success onCancel={onCancel} />;
        }
        return null;
    };

    return (
        <FormProvider context={formContext} data={initFormValues}>
            <StepBar current={step} />
            <Box paddingTop={4} />
            {renderCurrentStep(step)}
        </FormProvider>
    );
};

export default AddVault;

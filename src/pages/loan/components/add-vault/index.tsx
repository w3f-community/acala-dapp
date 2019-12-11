import React, { useState, ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@material-ui/core';
import { collateral, assets } from '@/config';
import rootActions from '@/store/actions';
import { AddStep } from './index.types';
import StepBar from './step-bar';
import SelectCollateral from './select-collateral';
import GenerateStableCoin from './generate-stable-coin';
import Confirm from './confirm';
import { formContext } from './context';
import { Provider as FormProvider } from '@/hooks/form';

interface Props {
    onCancel: () => void;
}

const AddVault: React.FC<Props> = ({ onCancel }) => {
    const dispatch = useDispatch();
    const [step, setStep] = useState<AddStep>('select');

    const initFormValues = {
        asset: { value: collateral[0] },
        collateral: { value: undefined },
        borrow: { value: undefined },
        agree: { value: undefined },
    };

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
        return <Confirm onNext={changeStep('confirm')} onPrev={changeStep('generate')} onCancel={onCancel} />;
    };

    useEffect(() => {
        // fetch balances and valuts info
        dispatch(rootActions.chain.fetchVaults.request({ data: collateral }));
        dispatch(rootActions.user.fetchAssetsBalance.request(Array.from(assets.keys())));
    }, [dispatch]);

    return (
        <FormProvider context={formContext} data={initFormValues}>
            <StepBar current={step} />
            <Box paddingTop={4} />
            {renderCurrentStep(step)}
        </FormProvider>
    );
};

export default AddVault;

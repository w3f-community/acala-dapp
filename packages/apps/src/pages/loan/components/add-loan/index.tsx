import React, { useState, ReactNode } from 'react';
import { AddStep } from './types';
import StepBar from './step-bar';
import SelectCollateral from './select-collateral';
import GenerateStableCoin from './generate-stable-coin';
import Confirm from './confirm';
import Success from './success';
import { formContext } from './context';
import { Form, useForm } from '@honzon-platform/apps/hooks/form';

interface Props {
    onCancel: () => void;
    onSuccess: (asset: number) => void;
}

const initFormValues = {
    asset: { value: undefined },
    collateral: { value: undefined },
    borrow: { value: undefined },
    agree: { value: undefined },
};

const AddLoan: React.FC<Props> = ({ onCancel, onSuccess }) => {
    const [step, setStep] = useState<AddStep>('select');

    const changeStepGen = (target: AddStep) => () => setStep(target);

    const renderCurrentStep = (step: AddStep): ReactNode => {
        if (step === 'select') {
            return <SelectCollateral onNext={changeStepGen('generate')} onCancel={onCancel} />;
        }
        if (step === 'generate') {
            return (
                <GenerateStableCoin
                    onNext={changeStepGen('confirm')}
                    onPrev={changeStepGen('select')}
                    onCancel={onCancel}
                />
            );
        }
        if (step === 'confirm') {
            return <Confirm onNext={changeStepGen('success')} onPrev={changeStepGen('generate')} onCancel={onCancel} />;
        }
        if (step === 'success') {
            return <Success onConfirm={onSuccess} onCancel={onCancel} />;
        }
        return null;
    };

    return (
        <Form context={formContext} data={initFormValues}>
            <StepBar current={step} />
            {renderCurrentStep(step)}
        </Form>
    );
};

export default AddLoan;

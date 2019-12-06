import React, { useState, ReactNode } from 'react';
import { Box } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';

import { AddStep } from './index.types';
import StepBar from './step-bar';
import SelectCollateral, { Vault } from './select-collateral';
import GenerateStableCoin from './generate-stable-coin';
import Confirm from './confirm';

const mockVault: Vault[] = [
    {
        asset: 2,
        stabilityFee: 5,
        liquidationRatio: 150,
        liquidationPenalty: 150,
        availableBalance: 10,
    },
    {
        asset: 3,
        stabilityFee: 5,
        liquidationRatio: 150,
        liquidationPenalty: 150,
        availableBalance: 10,
    },
];

interface Props {
    onCancel: () => void;
}
const AddVault: React.FC<Props> = ({ onCancel }) => {
    const { t } = useTranslate();
    const [step, setStep] = useState<AddStep>('select');

    const changeStep = (target: AddStep) => () => setStep(target);

    const renderCurrentStep = (step: AddStep): ReactNode => {
        if (step === 'select') {
            return <SelectCollateral data={mockVault} onNext={changeStep('generate')} onCancel={onCancel} />;
        }
        if (step === 'generate') {
            return (
                <GenerateStableCoin onNext={changeStep('confirm')} onPrev={changeStep('select')} onCancel={onCancel} />
            );
        }
        return <Confirm onNext={changeStep('confirm')} onPrev={changeStep('generate')} onCancel={onCancel} />;
    };

    return (
        <div>
            <StepBar current={step} />
            <Box paddingTop={4} />
            {renderCurrentStep(step)}
        </div>
    );
};

export default AddVault;

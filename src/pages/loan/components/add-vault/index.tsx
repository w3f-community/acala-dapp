import React, { useState, ReactNode } from 'react';
import { Typography } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';

import Step, { AddStep } from './step';
import SelectCollateral, { Vault } from './select-collateral';

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

const AddVault: React.FC = () => {
    const { t } = useTranslate();
    const [step, SetStep] = useState<AddStep>('select');
    const renderCurrentStep = (step: AddStep): ReactNode => {
        if (step === 'select') {
            return <SelectCollateral data={mockVault} />;
        }
    };
    return (
        <div>
            <Step />
            <Typography>{t('Each collateral type has its own unique risk profiles.')}</Typography>
            {renderCurrentStep(step)}
        </div>
    );
};

export default AddVault;

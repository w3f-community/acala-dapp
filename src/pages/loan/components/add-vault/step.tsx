import React from 'react';
import { Stepper, Step, StepButton } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';

// the steps of add vault
export type AddStep = 'select' | 'generate' | 'confirm';

interface Props {
    current: AddStep;
}

interface StepData {
    key: AddStep;
    desc: string;
}

const Component: React.FC = () => {
    const { t } = useTranslate();
    const steps: Array<StepData> = [
        {
            key: 'select',
            desc: t('Select Collateral'),
        },
        {
            key: 'generate',
            desc: t('Generate aUSD'),
        },
        {
            key: 'confirm',
            desc: t('Confirmation'),
        },
    ];
    return (
        <Stepper>
            {steps.map(({ key, desc }) => (
                <Step key={`add-vault-${key}`}>
                    <StepButton>{desc}</StepButton>
                </Step>
            ))}
        </Stepper>
    );
};

export default Component;

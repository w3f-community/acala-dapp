// the steps of add vault
export type AddStep = 'select' | 'generate' | 'confirm';

export interface BaseStepCard {
    onCancel: () => void;
    onNext: () => void;
    onPrev: () => void;
}

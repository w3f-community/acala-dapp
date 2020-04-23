import React, { FC, memo, ReactElement, useContext } from 'react';
import classes from './SlippageInputArea.module.scss';
import { TagGroup, Tag } from '@honzon-platform/ui-components';
import { SwapContext } from '@honzon-platform/react-components';

interface Props {
  onChange?: (slippage: number) => void;
}

export const SlippageInputArea: FC<Props> = memo(({ onChange }) => {
  const { slippage, setSlippage } = useContext(SwapContext);
  const suggestValues = [0.001, 0.005, 0.01];
  const suggestedIndex = 1;

  const handleClick = (num: number): void => {
    setSlippage(num);
    onChange && onChange(num);
  };

  const renderSuggest = (num: number): string => {
    return `${num * 100}%${num === suggestValues[suggestedIndex] ? ' (suggested)' : ''}`;
  };

  return (
    <div className={classes.root}>
      <p className={classes.title}>Limit addtion price slippage</p>
      <TagGroup>
        {
          suggestValues.map((suggest): ReactElement => {
            return (
              <Tag
                key={`suggest-${suggest}`}
                color={slippage === suggest ? 'primary' : 'white'}
                onClick={() => handleClick(suggest) }
              >
                {renderSuggest(suggest)}
              </Tag>
            );
          })
        }
      </TagGroup>
    </div>
  );
});

SlippageInputArea.displayName = 'SlippageInputArea';

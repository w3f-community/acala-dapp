import React, { FC } from 'react';
import { Card } from '@honzon-platform/ui-components';
import { useAllLoans } from '@honzon-platform/react-hooks';

export const Guide : FC = () => {
  return (
    <div>
      
    </div>
  );
}
 
export const Overview: FC = () => {
  const { loans } = useAllLoans({ filterEmpty: true });

  console.log(loans);
  return (
    <Card header='Overview'>
    </Card>
  );
}
import React, { FC } from 'react';
import { Grid as MuiGrid, GridProps } from '@material-ui/core';


interface Props extends GridProps{
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export const Grid: FC<Props> = ({ children, spacing= 3, ...other }) => {
  return (
    <MuiGrid
      spacing={spacing}
      {...other}
    >
      {children}
    </MuiGrid>
  );
};

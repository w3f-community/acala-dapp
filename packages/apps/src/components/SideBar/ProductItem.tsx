import React, { cloneElement, forwardRef } from 'react';
import { ListItem, ListItemText, createStyles, makeStyles, Theme } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

import { SideBarItem } from '@honzon-platform/apps/types/sidebar';

// FIXME: must use useStyles, issue related to https://github.com/mui-org/material-ui/issues/14971
const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    '& .MuiListItemText-primary': {
      color: theme.palette.common.white
    },
    '& .product-item__logo': {
      marginRight: 20,
      width: 20
    },
    '&.active': {
      background: 'rgba(255, 255, 255, 0.1)',
      borderLeft: `5px solid ${theme.palette.common.white}`
    },
    borderLeft: '5px solid transparent',
    color: theme.palette.common.white,
    height: 60,
    margin: 0,
    padding: '0 0 0 18px'
  }
}));

export const ProductItem: React.FC<SideBarItem> = ({ icon, name, path }) => {
  const classes = useStyles();
  const LinkBehavior = forwardRef((props: any, ref) => (
    <NavLink
      ref={ref}
      to={path as string}
      {...props}
    />
  ));

  LinkBehavior.displayName = 'LinkBehavior';

  return (
    <ListItem
      className={classes.root}
      component={LinkBehavior}
    >
      {cloneElement(icon, { className: 'product-item__logo' })}
      <ListItemText
        primary={name}
        primaryTypographyProps={{ variant: 'h4' }}
      />
    </ListItem>
  );
};

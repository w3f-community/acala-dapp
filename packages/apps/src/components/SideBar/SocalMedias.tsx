import React, { FC, forwardRef, cloneElement } from 'react';
import { withStyles, List, ListItem, ListItemText, Theme, createStyles, makeStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

import { SideBarConfig, SideBarItem } from '@honzon-platform/apps/types/sidebar';

const SocialMediaList = withStyles(() => ({
  root: {
    marginBottom: 40,
    padding: 0
  }
}))(List);

// FIXME: must use useStyles, issue related to https://github.com/mui-org/material-ui/issues/14971
const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    '& .MuiListItemText-primary': {
      color: theme.palette.common.white
    },
    '& .social-media__logo': {
      marginRight: 20,
      width: 20
    },
    '&:last-child': {
      paddingBottom: 0
    },
    paddingBottom: 16,
    paddingTop: 0
  }
}));

const SocialMediaItem: FC<SideBarItem> = ({ href, icon, name }) => {
  const classes = useStyles();
  const LinkBehavior = forwardRef((props: any, ref) => (
    <NavLink
      ref={ref}
      to={href as string}
      {...props}
    />
  ));

  LinkBehavior.displayName = 'LinkBehavior';

  return (
    <ListItem
      className={classes.root}
      component={LinkBehavior}
    >
      {cloneElement(icon, { className: 'social-media__logo' })}
      <ListItemText
        primary={name}
        primaryTypographyProps={{ variant: 'h4' }}
      />
    </ListItem>
  );
};

interface Props {
  data: SideBarConfig['socialMedia'];
}

export const SocialMedias: FC<Props> = ({ data }) => {
  return (
    <SocialMediaList>
      {data.map((item) => (
        <SocialMediaItem
          key={`products-${item.name}`}
          {...item}
        />
      ))}
    </SocialMediaList>
  );
};

import React from 'react';
import { ListItem, ListItemText, createStyles, makeStyles, Theme } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { SideBarItem } from '@honzon-platform/apps/types/sidebar';
import clsx from 'clsx';

const checkActive = (target: string, current: string): boolean => {
    // for root path
    if (!target) {
        return target === current || current === '/';
    }
    return current.startsWith('/' + target);
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 60,
            padding: '0 0 0 18px',
            margin: 0,
            color: theme.palette.common.white,
            borderLeft: `5px solid transparent`,
        },
        active: {
            borderLeft: `5px solid ${theme.palette.common.white}`,
            background: 'rgba(255, 255, 255, 0.1)',
        },
        image: {
            marginRight: 20,
        },
    }),
);

type Props = SideBarItem;

export const ProductItem: React.FC<Props> = ({ name, path, icon }) => {
    const history = useHistory();
    const classes = useStyles();
    const search = history.location.search;

    if (!path) {
        return null;
    }
    const isActive = checkActive(path, history.location.pathname);
    const handleItemClick = () => {
        history.push(`${path}${search}`);
    };

    return (
        <ListItem
            button
            className={clsx(classes.root, {
                [classes.active]: isActive,
            })}
            key={`product-${name}`}
            onClick={handleItemClick}
        >
            <img src={icon} className={classes.image} alt={name} />
            <ListItemText primary={name} primaryTypographyProps={{ variant: 'h2' }} />
        </ListItem>
    );
};

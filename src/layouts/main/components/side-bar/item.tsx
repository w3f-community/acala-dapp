import React from 'react';
import { ListItem, ListItemText, createStyles, makeStyles, Theme } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { SideBarItem } from '@/types/sidebar';
import clsx from 'clsx';

const checkActive = (target: string, current: string): boolean => {
    // for root path
    if (!target) {
        return target === current || current === '/';
    }
    return current.startsWith('/' + target);
};

interface Props {
    data: SideBarItem;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 60,
            padding: '0 0 0 50px',
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

const Item: React.FC<Props> = ({ data: { name, path, icon, href, target } }) => {
    const history = useHistory();
    const classes = useStyles();
    if (path) {
        const isActive = checkActive(path, history.location.pathname);
        const handleItemClick = () => {
            history.push(path);
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
                <img src={icon} className={classes.image} />
                <ListItemText primary={name} primaryTypographyProps={{ variant: 'h2' }} />
            </ListItem>
        );
    }
    if (href) {
        const handleItemClick = () => {
            window.open(href);
        };
        return (
            <ListItem button className={clsx(classes.root)} key={`product-${name}`} onClick={handleItemClick}>
                <img src={icon} className={classes.image} />
                <ListItemText primary={name} primaryTypographyProps={{ variant: 'h2' }} />
            </ListItem>
        );
    }
    return null;
};

export default Item;

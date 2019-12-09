import React from 'react';
import { ListItem, ListItemText, createStyles, makeStyles, Theme } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { SideBarData } from '@/types/sidebar';
import clsx from 'clsx';

const checkActive = (target: string, current: string): boolean => {
    // for root path
    if (!target) {
        return target === current || current === '/';
    }
    return current.startsWith('/' + target);
};

interface Props {
    data: SideBarData;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 60,
            padding: '0 0 0 50px',
            color: theme.palette.common.white,
        },
        active: {
            borderLeft: `5px solid ${theme.palette.common.white}`,
            background: 'rgba(255, 255, 255, 0.1)',
        },
    }),
);

const Item: React.FC<Props> = ({ data: { name, path } }) => {
    const history = useHistory();
    const classes = useStyles();
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
            <ListItemText primary={name} primaryTypographyProps={{ variant: 'h2' }} />
        </ListItem>
    );
};

export default Item;

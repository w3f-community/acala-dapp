import React, { FC } from 'react';
import { SideBarConfig, SideBarItem } from '@honzon-platform/apps/types/sidebar';
import { withStyles, List, ListItem, ListItemText } from '@material-ui/core';

const SocialMediaList = withStyles(() => ({
    root: {
        padding: 0,
        marginBottom: 40,
    },
}))(List);

const SocialMediaListItem = withStyles(() => ({
    root: {
        paddingBottom: 16,
        paddingTop: 0,
        '& img': {
            marginRight: 20,
        },
        '&:last-child': {
            paddingBottom: 0,
        },
    },
}))(ListItem);

type ItemProps = SideBarItem;

const SocialMediaItem: FC<ItemProps> = ({ icon, href, name }) => {
    const handleItemClick = () => {
        window.open(href);
    };
    return (
        <SocialMediaListItem button onClick={handleItemClick}>
            <img src={icon} alt={name} />
            <ListItemText primary={name} primaryTypographyProps={{ variant: 'h2' }} />
        </SocialMediaListItem>
    );
};
interface Props {
    data: SideBarConfig['socialMedia'];
}

export const SocialMedias: FC<Props> = ({ data }) => {
    return (
        <SocialMediaList>
            {data.map(item => (
                <SocialMediaItem {...item} key={`products-${item.name}`} />
            ))}
        </SocialMediaList>
    );
};

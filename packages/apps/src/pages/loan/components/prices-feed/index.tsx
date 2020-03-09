import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, List, ListItem, Grid } from '@material-ui/core';

import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import Card from '@honzon-platform/apps/components/card';
import { getAssetName } from '@honzon-platform/apps/utils';
import { pricesFeedSelector } from '@honzon-platform/apps/store/chain/selectors';
import { formatPrice } from '@honzon-platform/apps/components/formatter';
import Skeleton from '@material-ui/lab/Skeleton';
import { BaseProps } from '@honzon-platform/apps/types/react-component/props';

const PricesFeed: React.FC<BaseProps> = ({ className, style }) => {
    const { t } = useTranslate();
    const data = useSelector(pricesFeedSelector);

    if (!data.length) {
        return <Skeleton variant="rect" height={240} />;
    }

    return (
        <Card
            size="normal"
            elevation={1}
            header={<Typography variant="subtitle1">{t('Price Feed')}</Typography>}
            className={className}
            style={style}
        >
            <List disablePadding>
                {data.map(({ asset, price }) => (
                    <ListItem disableGutters key={`feed-prices-${asset}`}>
                        <Grid container justify="space-between">
                            <Typography variant="body2">
                                {t('{{asset}} in USD', { asset: getAssetName(asset) })}
                            </Typography>
                            <Typography variant="body2">{formatPrice(price, '$')}</Typography>
                        </Grid>
                    </ListItem>
                ))}
            </List>
        </Card>
    );
};

export default PricesFeed;

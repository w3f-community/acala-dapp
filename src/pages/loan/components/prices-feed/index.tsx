import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, List, ListItem, Grid } from '@material-ui/core';

import { useTranslate } from '@/hooks/i18n';
import Card from '@/components/card';
import { getAssetName } from '@/utils';
import actions from '@/store/actions';
import { pricesFeedSelector } from '@/store/chain/selectors';
import { assets } from '@/config';
import { formatPrice } from '@/components/formatter';
import Skeleton from '@material-ui/lab/Skeleton';
import { BaseProps } from '@/types/react-component/props';

const PricesFeed: React.FC<BaseProps> = ({ className, style }) => {
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const data = useSelector(pricesFeedSelector);

    useEffect(() => {
        dispatch(actions.chain.fetchPricesFeed.request(Array.from(assets.keys())));
    }, [dispatch]);

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
            <List>
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

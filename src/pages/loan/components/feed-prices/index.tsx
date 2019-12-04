import React from 'react';
import { Typography, List, ListItem, Grid } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Card from '@/components/card';
import { getAssetName } from '@/utils';

export interface Price {
    asset: number;
    price: number;
}

interface Props {
    data: Price[];
}

const FeedPrice: React.FC<Props> = ({ data }) => {
    const { t } = useTranslate();
    return (
        <Card size="normal" elevation={1} header={<Typography variant="subtitle1">{t('Price Feed')}</Typography>}>
            <List>
                {data.map(({ asset, price }) => (
                    <ListItem disableGutters key={`feed-prices-${asset}`}>
                        <Grid container justify="space-between">
                            <Typography variant="body2">
                                {t('{{asset}} in USD', { asset: getAssetName(asset) })}
                            </Typography>
                            <Typography variant="body2">${price}</Typography>
                        </Grid>
                    </ListItem>
                ))}
            </List>
        </Card>
    );
};

export default FeedPrice;

import React from 'react';
import { Typography, List, ListItem, Grid } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Card from '@/components/card';
import { useSelector } from 'react-redux';
import { pricesFeedSelector } from '@/store/chain/selectors';
import Formatter from '@/components/formatter';
import { balancesSelector } from '@/store/account/selectors';
import { getAssetName } from '@/utils';
import FixedU128 from '@/utils/fixed_u128';
import { withStyles } from '@material-ui/styles';

const Number = withStyles(() => ({
    root: {
        textAlign: 'right',
    },
}))(Typography);

const WalletBalance: React.FC = () => {
    const { t } = useTranslate();
    const balances = useSelector(balancesSelector);
    const prices = useSelector(pricesFeedSelector);

    if (!balances.length) {
        return null;
    }

    return (
        <Card size="normal" elevation={1} header={<Typography variant="subtitle1">{t('Wallet Balance')}</Typography>}>
            <List>
                {balances.map(item => {
                    const price = prices.find(price => price.asset === item.asset);
                    return (
                        <ListItem disableGutters key={`wallet-balance-${item.asset}`}>
                            <Grid container justify="space-between">
                                <Grid item xs={3}>
                                    <Typography variant="body2">{getAssetName(item.asset)}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Number variant="body2">
                                        <Formatter type="balance" data={item.balance} />
                                    </Number>
                                </Grid>
                                <Grid item xs={3}>
                                    <Number variant="body2">
                                        <Formatter
                                            type="price"
                                            data={item.balance.mul(price ? price.price : FixedU128.fromNatural(0))}
                                        />
                                    </Number>
                                </Grid>
                            </Grid>
                        </ListItem>
                    );
                })}
            </List>
        </Card>
    );
};

export default WalletBalance;

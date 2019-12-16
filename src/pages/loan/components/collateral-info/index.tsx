import React, { useState, ChangeEvent } from 'react';
import { Typography, List, ListItem, Grid, Select, MenuItem } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Card from '@/components/card';
import { useSelector } from 'react-redux';
import { vaultsSelector, specVaultSelector } from '@/store/chain/selectors';
import { getAssetName } from '@/utils';
import Formatter from '@/components/formatter';
import FixedU128 from '@/utils/fixed_u128';
import { calcStableFee } from '@/utils/vault';

interface Props {
    current: number;
}

const FeedPrice: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();
    const vaults = useSelector(vaultsSelector);
    const [selected, setSelected] = useState<number>(current);
    const selectedVaults = useSelector(specVaultSelector(selected));

    const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
        const result = Number(e.target.value);
        setSelected(result);
    };
    return (
        <Card
            size="normal"
            elevation={1}
            header={
                <Grid container justify="space-between" alignItems="center">
                    <Typography variant="subtitle1">{t('Collateral')}</Typography>
                    <Select value={selected} onChange={handleChange}>
                        {vaults.map(item => (
                            <MenuItem value={item.asset} key={`colateral-${item.asset}`}>
                                {getAssetName(item.asset)}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            }
        >
            {selectedVaults && (
                <List>
                    <ListItem disableGutters>
                        <Grid container justify="space-between">
                            <Typography variant="body2">{t('Liquidation Ratio')}</Typography>
                            <Typography variant="body2">
                                <Formatter type="ratio" data={selectedVaults.liquidationRatio} suffix="%" />
                            </Typography>
                        </Grid>
                    </ListItem>
                    <ListItem disableGutters>
                        <Grid container justify="space-between">
                            <Typography variant="body2">{t('Stability Fee/Interest')}</Typography>
                            <Formatter type="ratio" data={calcStableFee(selectedVaults.stabilityFee)} suffix="%" />
                        </Grid>
                    </ListItem>
                </List>
            )}
        </Card>
    );
};

export default FeedPrice;

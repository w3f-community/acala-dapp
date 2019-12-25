import React, { useEffect, useState, ChangeEvent } from 'react';
import { Typography, List, ListItem, Grid } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Card from '@/components/card';
import { useSelector } from 'react-redux';
import { vaultsSelector, specVaultSelector } from '@/store/chain/selectors';
import Formatter from '@/components/formatter';
import { calcStableFee } from '@/utils/vault';
import Skeleton from '@material-ui/lab/Skeleton';
import CollateralSelect from '@/components/collateral-select';

interface Props {
    current: number;
}

const CollateralInfo: React.FC<Props> = ({ current }) => {
    const { t } = useTranslate();
    const vaults = useSelector(vaultsSelector);
    const [selected, setSelected] = useState<number>(current);
    const selectedVaults = useSelector(specVaultSelector(selected));

    useEffect(() => {
        setSelected(current);
    }, [current]);

    const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
        const result = Number(e.target.value);
        setSelected(result);
    };

    if (!vaults.length) {
        return <Skeleton variant="rect" height={240} />;
    }
    return (
        <Card
            size="normal"
            elevation={1}
            header={
                <Grid container justify="space-between" alignItems="center">
                    <Typography variant="subtitle1">{t('Collateral')}</Typography>
                    <CollateralSelect selected={selected} onChange={handleChange} vaults={vaults} />
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

export default CollateralInfo;

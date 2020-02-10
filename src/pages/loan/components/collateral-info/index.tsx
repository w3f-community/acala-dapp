import React, { useState } from 'react';
import { Typography, List, ListItem, Grid } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Card from '@/components/card';
import { useSelector } from 'react-redux';
import { cdpTypeSelector, constantsSelector } from '@/store/chain/selectors';
import Formatter from '@/components/formatter';
import { calcStableFee } from '@/utils/vault';
import CollateralSelect from '@/components/collateral-select';
import { BaseProps } from '@/types/react-component/props';

type Props = {
    current: number;
} & BaseProps;

const CollateralInfo: React.FC<Props> = ({ current, className, style }) => {
    const { t } = useTranslate();
    const cdpTypes = useSelector(cdpTypeSelector);
    const [selected, setSelected] = useState<number>(current);
    const constants = useSelector(constantsSelector);

    const handleChange = (asset: number) => {
        setSelected(asset);
    };

    if (!cdpTypes.length || !constants) {
        return null;
    }
    const selectedCdp = cdpTypes.find(item => item.asset === selected);

    return (
        <Card
            size="normal"
            elevation={1}
            header={
                <Grid container justify="space-between" alignItems="center">
                    <Typography variant="subtitle1">{t('Collateral')}</Typography>
                    <CollateralSelect selected={selected} onChange={handleChange} cdpTypes={cdpTypes} />
                </Grid>
            }
            className={className}
            style={style}
        >
            {selectedCdp && (
                <List>
                    <ListItem disableGutters>
                        <Grid container justify="space-between">
                            <Typography variant="body2">{t('Liquidation Ratio')}</Typography>
                            <Typography variant="body2">
                                <Formatter type="ratio" data={selectedCdp.liquidationRatio} suffix="%" />
                            </Typography>
                        </Grid>
                    </ListItem>
                    <ListItem disableGutters>
                        <Grid container justify="space-between">
                            <Typography variant="body2">{t('Required Collateral Ratio')}</Typography>
                            <Typography variant="body2">
                                <Formatter type="ratio" data={selectedCdp.requiredCollateralRatio} suffix="%" />
                            </Typography>
                        </Grid>
                    </ListItem>
                    <ListItem disableGutters>
                        <Grid container justify="space-between">
                            <Typography variant="body2">{t('Stability Fee/Interest')}</Typography>
                            <Formatter type="ratio" data={calcStableFee(selectedCdp.stabilityFee, constants.babe.expectedBlockTime)} suffix="%" />
                        </Grid>
                    </ListItem>
                </List>
            )}
        </Card>
    );
};

export default CollateralInfo;

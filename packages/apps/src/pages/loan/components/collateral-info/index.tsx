import React, { useState, useEffect, useCallback } from 'react';
import { Typography, List, ListItem, Grid } from '@material-ui/core';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import Card from '@honzon-platform/apps/components/card';
import { useSelector } from 'react-redux';
import { cdpTypeSelector, constantsSelector } from '@honzon-platform/apps/store/chain/selectors';
import Formatter from '@honzon-platform/apps/components/formatter';
import { calcStableFee } from '@honzon-platform/apps/utils/loan';
import CollateralSelect from '@honzon-platform/apps/components/collateral-select';
import { BaseProps } from '@honzon-platform/apps/types/react-component/props';

type Props = {
    current: number;
} & BaseProps;

const CollateralInfo: React.FC<Props> = ({ current, className, style }) => {
    const { t } = useTranslate();
    const cdpTypes = useSelector(cdpTypeSelector);
    const [selected, setSelected] = useState<number>(current);
    const constants = useSelector(constantsSelector);

    const handleChange = useCallback((asset: number) => {
        setSelected(asset);
    }, []);

    useEffect(() => {
        setSelected(current);
    }, [current]);

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
                <List disablePadding>
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
                            <Typography variant="body2">{t('Interest Rate')}</Typography>
                            <Formatter
                                type="ratio"
                                data={calcStableFee(selectedCdp.stabilityFee, constants.babe.expectedBlockTime)}
                                suffix="%"
                            />
                        </Grid>
                    </ListItem>
                </List>
            )}
        </Card>
    );
};

export default CollateralInfo;

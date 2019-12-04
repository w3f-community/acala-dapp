import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { Typography, List, ListItem, Grid } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Card from '@/components/card';
import { CollateralInfoData } from '../../index.types';

interface Props {
    current: number;
    data: { [k: number]: CollateralInfoData };
}

const FeedPrice: React.FC<Props> = ({ current, data }) => {
    const { t } = useTranslate();
    const [currentData, setCurrentData] = useState<CollateralInfoData | undefined>(undefined);

    return (
        <Card size="normal" elevation={1} header={<Typography variant="subtitle1">{t('Collateral')}</Typography>}>
            <List>
                <ListItem disableGutters>
                    <Grid container justify="space-between">
                        <Typography variant="body2">{t('Liquidation Ratio')}</Typography>
                        <Typography variant="body2">{currentData ? currentData['liquidationRatio'] : '0'}%</Typography>
                    </Grid>
                </ListItem>
                <ListItem disableGutters>
                    <Grid container justify="space-between">
                        <Typography variant="body2">{t('Stability Fee/Interest')}</Typography>
                        <Typography variant="body2">{currentData ? currentData['stabilityFee'] : '0'}%</Typography>
                    </Grid>
                </ListItem>
            </List>
        </Card>
    );
};

export default FeedPrice;

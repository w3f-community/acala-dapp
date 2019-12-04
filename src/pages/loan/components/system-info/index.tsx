import React from 'react';
import { Typography, List, ListItem, Grid } from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import Card from '@/components/card';
import { SystemInfoData } from '../../index.types';

interface Props {
    data: SystemInfoData;
}

const SystemInfo: React.FC<Props> = ({ data: { aUSDSupply } }) => {
    const { t } = useTranslate();
    return (
        <Card size="normal" elevation={1} header={<Typography variant="subtitle1">{t('Systom Info')}</Typography>}>
            <List>
                <ListItem disableGutters>
                    <Grid container justify="space-between">
                        <Typography variant="body2">{t('aUSD in Supply')}</Typography>
                        <Typography variant="body2">${aUSDSupply}</Typography>
                    </Grid>
                </ListItem>
            </List>
        </Card>
    );
};

export default SystemInfo;

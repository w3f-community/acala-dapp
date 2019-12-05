import React, { useState } from 'react';
import { Grid, Typography, List, ListItem, ListItemText, Button, Box } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

import Card from '@/components/card';
import { useTranslate } from '@/hooks/i18n';
import { getAssetName } from '@/utils';
import ActionModal, { ActionModalProps } from '../action-modal';

interface Props {
    asset: number;
}

const VaultPanel: React.FC<Props> = ({ asset }) => {
    const { t } = useTranslate();

    const [modalProps, setModalProps] = useState<ActionModalProps>({ open: false, action: 'any' });
    const handleCloseModal = () => setModalProps({ open: false, action: 'any' });
    const handleShowPayBack = () => setModalProps({ open: true, action: 'payback' });
    const handleShowGenerate = () => setModalProps({ open: true, action: 'generate' });
    const handleShowDeposit = () => setModalProps({ open: true, action: 'deposit' });
    const handleShowWithdraw = () => setModalProps({ open: true, action: 'withdraw' });

    return (
        <Grid container spacing={5}>
            <ActionModal {...modalProps} onClose={handleCloseModal} />
            <Grid item xs={6}>
                <Card
                    size="large"
                    elevation={1}
                    contentPadding={4}
                    header={<Typography variant="subtitle1">{t('Borrowed aUSD')}</Typography>}
                >
                    <List disablePadding>
                        <ListItem disableGutters>
                            <ListItemText
                                primary={t('Can Pay Back')}
                                secondary={t('{{number}} {{asset}}', { number: 100, asset: 'aUSD' })}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleShowPayBack}
                            >
                                {t('Payback')}
                            </Button>
                        </ListItem>
                        <ListItem disableGutters>
                            <ListItemText
                                primary={t('Can Generate')}
                                secondary={t('{{number}} {{asset}}', { number: 100, asset: 'aUSD' })}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleShowGenerate}
                            >
                                {t('Generate')}
                            </Button>
                        </ListItem>
                    </List>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card
                    size="large"
                    elevation={1}
                    contentPadding={4}
                    header={
                        <Typography variant="subtitle1">
                            {t('Collateral {{asset}}', { asset: getAssetName(asset) })}
                        </Typography>
                    }
                >
                    <List disablePadding>
                        <ListItem disableGutters>
                            <ListItemText
                                primary={t('Required for Safety')}
                                secondary={t('{{number}} {{asset}}', { number: 100, asset: 'ETH' })}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleShowDeposit}
                            >
                                {t('Deposit')}
                            </Button>
                        </ListItem>
                        <ListItem disableGutters>
                            <ListItemText
                                primary={t('Able to Withdraw')}
                                secondary={t('{{number}} {{asset}}', { number: 100, asset: 'ETH' })}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleShowWithdraw}
                            >
                                {t('Withdraw')}
                            </Button>
                        </ListItem>
                    </List>
                </Card>
            </Grid>
        </Grid>
    );
};

export default VaultPanel;

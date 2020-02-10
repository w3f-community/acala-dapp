import React, { ReactNode, ChangeEvent } from 'react';
import {
    Paper,
    createStyles,
    makeStyles,
    Theme,
    withStyles,
    Typography,
    Grid,
    List,
    ListItem,
} from '@material-ui/core';
import { useTranslate } from '@/hooks/i18n';
import { createTypography } from '@/theme';
import { CdpTypeData } from '@/types/store';
import CollateralSelect from '@/components/collateral-select';
import FixedU128 from '@/utils/fixed_u128';
import Formatter from '@/components/formatter';
import { calcStableFee } from '@/utils/vault';
import { getAssetName } from '@/utils';
import { useSelector } from 'react-redux';
import { constantsSelector } from '@/store/chain/selectors';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: 32,
        },
        collateralType: {
            paddingBottom: 23,
            borderBottom: '1px solid #e4e4e4',
        },
    }),
);

const Title = withStyles(() => ({
    root: {
        marginBottom: 27,
        ...createTypography(18, 22, 400),
    },
}))(Typography);

const SListItem = withStyles(() => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 0',
    },
}))(ListItem);

const Lable = withStyles(() => ({
    root: {
        ...createTypography(15, 22, 600),
    },
}))(Typography);

const Value = withStyles(() => ({
    root: {
        ...createTypography(15, 22, 600),
    },
}))(Typography);

interface Props {
    selected: number;
    onSelect: (asset: number) => void;
    renderBottom: () => ReactNode;
    cdpTypes: CdpTypeData[];
    balances: { [key in number]: FixedU128 };
}

const SelectCollateral: React.FC<Props> = ({ selected, onSelect, renderBottom, cdpTypes, balances }) => {
    const { t } = useTranslate();
    const classes = useStyles();
    const constants = useSelector(constantsSelector);

    const selectedCdp = cdpTypes.find(item => item.asset === selected);

    if (!selectedCdp || !constants) {
        return null;
    }

    return (
        <Paper square={true} elevation={1} className={classes.root}>
            <Title>{t('Select Collateral')}</Title>
            <Grid container justify="space-between" alignItems="center" className={classes.collateralType}>
                {t('Collateral Type')}
                <CollateralSelect selected={selected} onChange={onSelect} cdpTypes={cdpTypes} />
            </Grid>
            <List>
                <SListItem button>
                    <Lable>{t('Interest Rate')}</Lable>
                    <Value>
                        <Formatter data={calcStableFee(selectedCdp.stabilityFee, constants.babe.expectedBlockTime)} type="ratio" />
                    </Value>
                </SListItem>
                <SListItem button>
                    <Lable>{t('LIQ Ratio')}</Lable>
                    <Value>
                        <Formatter data={selectedCdp.liquidationRatio} type="ratio" />{' '}
                    </Value>
                </SListItem>
                <SListItem button>
                    <Lable>{t('LIQ Fee')}</Lable>
                    <Value>
                        <Formatter data={selectedCdp.liquidationPenalty} type="ratio" />{' '}
                    </Value>
                </SListItem>
                <SListItem button>
                    <Lable>{t('Avail. Balance')}</Lable>
                    <Value>
                        <Formatter
                            data={balances[selectedCdp.asset] || 0}
                            type="balance"
                            suffix={getAssetName(selectedCdp.asset)}
                        />
                    </Value>
                </SListItem>
            </List>
            {renderBottom()}
        </Paper>
    );
};

export default SelectCollateral;

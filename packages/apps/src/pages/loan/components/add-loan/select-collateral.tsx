import React, { ReactEventHandler, useEffect, MouseEvent } from 'react';
import { Box, Grid, Button, Radio, makeStyles, createStyles, Theme } from '@material-ui/core';
import { useTranslate } from '@honzon-platform/apps/hooks/i18n';
import { getAssetName } from '@honzon-platform/apps/utils';
import Formatter from '@honzon-platform/apps/components/formatter';
import { useSelector } from 'react-redux';
import { cdpTypeSelector, constantsSelector } from '@honzon-platform/apps/store/chain/selectors';
import { balancesSelector } from '@honzon-platform/apps/store/account/selectors';
import { CdpTypeData } from '@honzon-platform/apps/types/store';
import { useForm } from '@honzon-platform/apps/hooks/form';
import { formContext } from './context';
import FixedU128 from '@honzon-platform/apps/utils/fixed_u128';
import { calcStableFee } from '@honzon-platform/apps/utils/loan';
import useMobileMatch from '@honzon-platform/apps/hooks/mobile-match';
import SelectCollateralMobile from './select-collateral-mobile';
import Card from '@honzon-platform/apps/components/card';
import { Table } from '@honzon-platform/apps/components/table';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bottom: {
            paddingTop: theme.spacing(4),
            '& .MuiButton-root': {
                marginLeft: theme.spacing(2),
            },
            [theme.breakpoints.down('sm')]: {
                paddingTop: 32,
                '& .MuiButton-root': {
                    marginLeft: 0,
                },
            },
        },
        tableRowHover: {
            cursor: 'pointer',
        },
    }),
);

const filterEmptyLoan = (source: CdpTypeData[]): CdpTypeData[] => {
    return source.filter(
        item =>
            !item.debitExchangeRate.isZero() ||
            !item.liquidationPenalty.isZero() ||
            !item.liquidationRatio.isZero() ||
            !item.maximumTotalDebitValue.isZero() ||
            !item.requiredCollateralRatio.isZero() ||
            !item.stabilityFee.isZero(),
    );
};

interface TableItem extends CdpTypeData {
    balance: FixedU128;
}

interface Props {
    onNext: () => void;
    onCancel: () => void;
}

const Component: React.FC<Props> = ({ onNext, onCancel }) => {
    const { t } = useTranslate();
    const classes = useStyles();
    const { data, setValue } = useForm(formContext);
    const selectedAsset = data.asset.value;
    const cdpTypes = filterEmptyLoan(useSelector(cdpTypeSelector));
    const balances = useSelector(balancesSelector);
    const mobileMatch = useMobileMatch('sm');
    const constants = useSelector(constantsSelector);

    const handleNextBtnClick = () => onNext();

    const handleAssetRadioSelect: ReactEventHandler<HTMLInputElement> = e => {
        const asset = Number(e.currentTarget.value);
        setValue('asset', asset);
    };

    const handleRowClick = (event: MouseEvent<HTMLTableRowElement>, data: TableItem) => {
        setValue('asset', data.asset);
    };

    useEffect(() => {
        // auto select first
        if (!data.asset.value && cdpTypes.length !== 0) {
            setValue('asset', cdpTypes[0].asset);
        }
    }, [cdpTypes, data.asset.value, setValue]);

    if (!balances.length) {
        return null;
    }

    // convert array to map
    const balancesMap = balances.reduce<{ [k: number]: FixedU128 }>(
        (acc, cur) => ({ ...acc, [cur.asset]: cur.balance }),
        {},
    );

    const renderBottom = () => {
        return (
            <Grid container justify={mobileMatch ? 'space-between' : 'flex-end'} className={classes.bottom}>
                <Button variant="contained" color="secondary" onClick={onCancel}>
                    {t('Cancel')}
                </Button>
                <Button variant="contained" color="primary" onClick={handleNextBtnClick}>
                    {t('Next')}
                </Button>
            </Grid>
        );
    };

    // ensure cdpTypes is not empty
    if (!cdpTypes.length || !constants) {
        return null;
    }

    if (mobileMatch) {
        return (
            <SelectCollateralMobile
                renderBottom={renderBottom}
                cdpTypes={cdpTypes}
                balances={balancesMap}
                onSelect={(asset: number) => setValue('asset', asset)}
                selected={data.asset.value}
            />
        );
    }

    const tableConfig = [
        {
            renderKey: 'asset',
            title: t('Collateral Type'),
            render: (asset: number) => (
                <Box display="flex" alignItems="center">
                    <Radio value={asset} onChange={handleAssetRadioSelect} checked={selectedAsset === asset} />
                    {getAssetName(asset)}
                </Box>
            ),
        },
        {
            renderKey: 'stabilityFee',
            title: t('Interest Rate %'),
            render: (stabilityFee: FixedU128) => (
                <Formatter data={calcStableFee(stabilityFee, constants.babe.expectedBlockTime)} type="ratio" />
            ),
        },
        {
            renderKey: 'requiredCollateralRatio',
            title: t('Min. Collateral %'),
            render: (data: FixedU128) => <Formatter data={data} type="ratio" />,
        },
        {
            renderKey: 'liquidationRatio',
            title: t('LIQ Ratio'),
            render: (data: FixedU128) => <Formatter data={data} type="ratio" />,
        },
        {
            renderKey: 'liquidationPenalty',
            title: t('LIQ Fee'),
            render: (data: FixedU128) => <Formatter data={data} type="ratio" />,
        },
        {
            renderKey: 'balance',
            title: t('Avail. Balance'),
            render: (balance: FixedU128, record: TableItem) => (
                <Formatter data={balance} type="balance" suffix={getAssetName(record.asset)} />
            ),
        },
    ];

    const tableData = cdpTypes.map(item => {
        const balance = balances.find(data => data.asset === item.asset);
        return {
            ...item,
            balance: balance ? balance.balance : FixedU128.fromNatural(0),
        };
    });

    return (
        <Card elevation={1} size="large">
            <Table<TableItem>
                config={tableConfig}
                data={tableData}
                rawProps={{
                    classes: { hover: classes.tableRowHover },
                    hover: true,
                    onClick: handleRowClick,
                }}
            />
            {renderBottom()}
        </Card>
    );
};

export default Component;

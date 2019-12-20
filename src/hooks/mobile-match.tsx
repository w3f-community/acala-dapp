import { useTheme, useMediaQuery } from '@material-ui/core';

type Key = number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const useMobileMatch: (key: Key) => boolean = key => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.down(key));
};

export default useMobileMatch;

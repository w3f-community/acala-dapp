import React, { FC } from 'react';
import Dayjs from 'dayjs';

interface Props {
  time: Date | string;
  formatter?: string;
}

export const FormatTime: FC<Props> = ({
  formatter = 'YYYY/MM/DD HH:mm',
  time
}) => {
  return <span>{Dayjs(time).format(formatter)}</span>;
};

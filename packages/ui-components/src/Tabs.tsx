import React, { FC, ReactNode, useState, memo } from 'react';
import clsx from 'clsx'
import { randomID } from './utils';
import classes from './Tabs.module.scss';


interface TabConfig {
  title: string;
  render: () => ReactNode;
}

interface Props {
  config: TabConfig[]
}

export const Tabs: FC<Props> = memo(({ config }) => {
  const [active, setActive] = useState<number>(0);
  const onClick = (index: number) => {
    setActive(index);
  }
  return (
    <div className={classes.tab}>
      <div className={classes.tabTitleContent}>
        {
          config.map((item: TabConfig, index: number) => {
            return (
              <div className={clsx(classes.tabTitle, {[classes.active]: index === active})} onClick={() => onClick(index)} key={`${randomID()}-tab-item`}>{item.title}</div>
            )
          })
        }
      </div>
      <div className={classes.tabContent}>
        {config[active].render()}
      </div>
    </div>
  );
});
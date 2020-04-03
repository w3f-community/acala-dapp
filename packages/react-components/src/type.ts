import { ReactElement } from 'react';

export interface BaseQueryElementProps<Result> {
  render: (result: Result) => ReactElement;
  transform?: (result: any) => Result;
}

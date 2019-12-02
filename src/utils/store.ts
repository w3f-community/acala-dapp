interface IConfig {
    toJS?: boolean,
}
export type Selector<Result, Config> = (config: IConfig & Config) => Result;
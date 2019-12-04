interface BaseConfig {
    toJS?: boolean;
}
export type Selector<Result, Config> = (config: BaseConfig & Config) => Result;

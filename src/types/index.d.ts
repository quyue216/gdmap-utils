
export interface AMapLoaderConfig {
  /** 申请好的 Web 端开发 Key，首次调用 load 时必填 */
  key: string;
  /** 指定要加载的 JS API 的版本，缺省时默认为 1.4.15 */
  version?: string;
  /** 需要使用的插件列表，如比例尺 'AMap.Scale' */
  plugins?: string[];
  /** 是否加载 AMapUI，缺省不加载 */
  AMapUI?: {
    /** AMapUI 版本 */
    version?: string;
    /** 需要加载的 AMapUI ui 插件 */
    plugins?: string[];
  };
  /** 是否加载 Loca，缺省不加载 */
  Loca?: {
    /** Loca 版本 */
    version?: string;
  };
}

export {}
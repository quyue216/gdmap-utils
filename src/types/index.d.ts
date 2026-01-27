// 从MapUtils.d.ts导入并重新导出类型
export type * from './MapUtils';

// 从BaseMarkerLayer.d.ts导入并重新导出类型
export type * from './baseMarkerLayer';

export type * from './clusterMarkerLayer';

interface Window {
  _AMapSecurityConfig?: {
    securityJsCode: string;
    serviceHost: string;
  };
}

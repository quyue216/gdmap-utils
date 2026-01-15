// 从MapUtils.d.ts导入并重新导出类型
export type {
  mapIns,
  MapOptions,
  MapUtilsCreateOpts,
  MapUtilsUseExistingOpts,
  MapUtilsOpts,
  LayerManger,
} from './MapUtils';

// 从BaseMarkerLayer.d.ts导入并重新导出类型
export type {
  BaseMarkerLayerInfo,
  MarkerLayerBaseType,
  OverlayData,
  LayerOpts,
  OverlaysLayer,
} from './BaseMarkerLayer';

interface Window {
  _AMapSecurityConfig?: {
    securityJsCode: string;
    serviceHost: string;
  };
}

// 导入高德地图类型声明
/// <reference types="@amap/amap-jsapi-types" />

// 声明AMap全局对象
declare global {
  interface Window {
    AMap: typeof import('@amap/amap-jsapi-types').AMap;
    AMapUI: any;
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
  }
  
  // 全局AMap对象
declare const AMap: typeof import('@amap/amap-jsapi-types').AMap;
  declare const AMapUI: any;
}

// 导出类型
export type { AMap } from '@amap/amap-jsapi-types';
export type { AMapLoaderConfig } from './index';
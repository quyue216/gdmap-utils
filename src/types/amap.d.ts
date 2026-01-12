// 导入高德地图类型声明
import type { load } from '@amap/amap-jsapi-loader';
import '@amap/amap-jsapi-types';

type loaderOpts = Parameters<typeof load>[0]; //函数类型取出

type MapOptions = AMap.MapOptions;
type MarkerOptions = AMap.MarkerOptions;
type LabelMarkerOptions = AMap.LabelMarkerOptions;

export type { loaderOpts, AMap, MapOptions, MarkerOptions, LabelMarkerOptions };

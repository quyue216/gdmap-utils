// 导入高德地图类型声明
/// <reference types="@amap/amap-jsapi-types" />

import type { load } from "@amap/amap-jsapi-loader";

type loaderOpts = Parameters<typeof load>[0]; //函数类型取出

type AMap = typeof AMap;


type MapOptions = AMap.MapOptions;

export type {
    loaderOpts,
    AMap,
    MapOptions
} 
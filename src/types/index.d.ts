// 项目类型声明文件
import type { AMap } from './amap';

// 高德地图实例
type mapIns = InstanceType<typeof AMap.Map>;

type MapOptions = AMap.MapOptions;

interface MapUtilsCreateOpts extends MapOptions {
  mountSelector: string;
}

interface MapUtilsUseExistingOpts extends MapOptions {
  mapIns: mapIns;
}

type MapUtilsOPts = {
  MapUtilsUseExistingOpts: MapUtilsUseExistingOpts;
  MapUtilsCreateOpts: MapUtilsCreateOpts;
};

export type { MapUtilsOPts, mapIns };

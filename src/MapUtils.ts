import MapSourceImport from './MapSourceImport';
import type { AMap, loaderOpts, MapOptions } from './types/amap.d';
import type { MapUtilsOpts, mapIns } from './types/index.d';
import type { SetOptional } from 'type-fest';
import LayerManager from './LayerManager';
class MapUtils {
  // 地图实例信息
  map: mapIns;

  options: SetOptional<MapUtilsOpts['MapUtilsCreateOpts'], 'mountSelector'>;

  LayerManager: LayerManager = new LayerManager(); //组合模式

  constructor(opts: MapUtilsOpts[keyof MapUtilsOpts], AMap: AMap) {
    if (!(typeof AMap === 'object' && 'BaseLayer' in AMap)) {
      throw this.error('AMap is not exist');
    }

    if ('mapIns' in opts && opts.mapIns instanceof AMap.Map) {
      const { mapIns, ...rest } = opts;
      this.map = opts.mapIns;
      this.options = rest;
    } else {
      if (!('mountSelector' in opts)) {
        throw this.error('mountSelector is not exist');
      } else {
        this.options = opts;

        const { mountSelector, ...rest } = opts;

        this.map = this.initMap(mountSelector, rest); //地图初始化
      }
    }

    this.bindMapClickEvent();
  }

  // 初始化绑定地图事件
  bindMapClickEvent() {
    this.map.on('click', () => {
      // if (this.clickMapRestMarkers) {
      //   this.overlayGroupManagerMap.forEach((overlayGroup) => {
      //     overlayGroup.resetActiveMarker(); // 清除图层上的所有覆盖物
      //   });
      // }
    });
  }

  initMap(id: string, opts: MapOptions): mapIns {
    //参数要作检验吗
    return new AMap.Map(id, opts);
  }

  error(msg: string) {
    console.error(`[MapUtils Error]:${msg}`);
  }
}

export async function createMapUtils(
  opts: MapUtilsOpts[keyof MapUtilsOpts],
  loaderOPts?: loaderOpts
) {
  // window上存在属性已经加载
  let AMap = window.AMap;

  if (loaderOPts) {
    AMap = await initMapSource(loaderOPts);
  }

  return new MapUtils(opts, AMap);
}

// 地图拆分
export async function initMapSource(Opts: loaderOpts) {
  return await MapSourceImport.loadScript(Opts);
}

/* 
 地图资源加载与地图初始化进行拆分吗?
 1. 地图资源加载与构造函数耦合
    1.1 地图资源确保加载
    1.2 地图配置 (每次都要传入)
 2. 单例模式, 实例对所有组件可见
*/

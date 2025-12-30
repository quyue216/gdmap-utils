import MapSourceImport from './MapSourceImport';
import MapMixin from './gdMap/gdHelper';
import type { AMap as gdAMap, loaderOpts, MapOptions } from './types/amap.d';
import type {
  MapUtilsOpts,
  mapIns,
  layerType,
  LayerOpts,
} from './types/index.d';
import type { SetOptional, Simplify } from 'type-fest';
import LayerManager from './LayerManager';
import Layer from './layers/index';

type MapMixinType = typeof MapMixin;

interface MapUtilsStatic extends MapMixinType {
  new (
    opts: MapUtilsOpts[keyof MapUtilsOpts],
    AMap: Simplify<typeof gdAMap>
  ): MapUtils;
}

export class MapUtils {
  // 地图实例信息
  map: mapIns;

  options: SetOptional<MapUtilsOpts['MapUtilsCreateOpts'], 'mountSelector'>;

  LayerManager: LayerManager = new LayerManager();

  static createAMapMarker = MapMixin.createAMapMarker;

  static createIcon = MapMixin.createIcon;

  static Size = MapMixin.Size;

  static Pixel = MapMixin.Pixel;

  static LngLat = MapMixin.LngLat;

  constructor(
    opts: MapUtilsOpts[keyof MapUtilsOpts],
    AMap: Simplify<typeof gdAMap>
  ) {
    if (!(typeof AMap === 'object' && 'BaseLayer' in AMap)) {
      throw MapUtils.error('AMap is not exist');
    }

    if ('mapIns' in opts && opts.mapIns instanceof AMap.Map) {
      const { mapIns, ...rest } = opts;
      this.map = opts.mapIns;
      this.options = rest;
    } else {
      if (!('mountSelector' in opts)) {
        throw MapUtils.error('mountSelector is not exist');
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
    return new window.AMap.Map(id, opts);
  }

  createLayer<U extends {}, T extends layerType = 'markerLayer'>(
    opts: LayerOpts<U, T>
  ) {
    const layer = new Layer<U, T>(opts, this);
    this.LayerManager.addLayer(layer);
    return layer;
  }

  /**
   * 根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
   * @param {Array} overlays - 覆盖物数组，缺省为全部覆盖物
   * @param {Boolean} immediately - 是否立即过渡
   * @param {Array<Number>} avoid - 四周边距，上、下、左、右
   * @param {number} maxZoom - 最大地图zoom级别
   */
  setFitView(...opts: Parameters<mapIns['setFitView']>): void {
    this.map.setFitView(...opts);
  }

  static error(msg: string) {
    console.error(`[MapUtils Error]:${msg}`);
  }
}

type mapUtilsIns = InstanceType<typeof MapUtils>;

export type { mapUtilsIns };

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

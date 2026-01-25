import MapSourceImport from './MapSourceImport';
import MapMixin from './gdMap/gdHelper';
import type { AMap as gdAMap, loaderOpts, MapOptions } from './types/amap.d';
import type {
  MapUtilsOpts,
  mapIns,
  MarkerLayerBaseType,
  MarkerClusterLayerType,
  LayerOpts,
  ClusterMarkerLayerOpts,
} from './types/index.d';
import {
  BaseMarkerLayerIns,
  BaseMarkerLayer,
  ClusterMarkerLayerIns,
  ClusterMarkerLayer,
} from './layers/index';
import type { SetOptional, Simplify } from 'type-fest';
import LayerManager from './LayerManager';

type MapUtilsConstructor = typeof MapUtils;

type mapUtilsIns = InstanceType<typeof MapUtils>;

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

  static createAMapInfoWindow = MapMixin.createAMapInfoWindow;

  constructor(
    opts: MapUtilsOpts[keyof MapUtilsOpts],
    AMap: Simplify<typeof gdAMap>
  ) {
    if (!(typeof AMap === 'object' && 'Map' in AMap)) {
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

  createBaseMarkerLayer<
    U extends {},
    T extends MarkerLayerBaseType = 'markerLayer',
  >(opts: LayerOpts<U, T>) {
    const layer = new BaseMarkerLayer<U, T>(opts, this);
    // @ts-ignore
    this.LayerManager.addLayer(layer);
    return layer;
  }

  createClusterMarkerLayer<
    U extends {},
    T extends MarkerClusterLayerType = 'markerClusterLayer',
  >(opts: ClusterMarkerLayerOpts<U, T>) {
    const layer = new ClusterMarkerLayer<U, T>(opts, this);
    // @ts-ignore
    this.LayerManager.addLayer(layer);
    return layer;
  }

  removeLayer(layer: BaseMarkerLayerIns | ClusterMarkerLayerIns) {
    const isLayerExist = this.LayerManager.hasLayer(layer);

    if (isLayerExist) {
      this.LayerManager.removeLayer(layer);
    } else {
      MapUtils.error(`${layer.layerName} is not exist`);
    }
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

  clearInfoWindow() {
    this.map.clearInfoWindow();
  }

  seZoomAndCenter(opts: {
    zoom: number;
    center: AMap.LngLat | [number, number];
    immediately?: boolean;
    duration?: number;
  }): void {
    const curZoom = this.map.getZoom();
    const lngAndLat = this.map.getCenter();
    const curCenter: [number, number] = [lngAndLat.lng, lngAndLat.lat];
    let { center = curCenter, zoom = curZoom, immediately, duration } = opts;

    this.map.setZoomAndCenter(zoom, center, immediately, duration);
  }

  /**
   * 显示指定图层
   * @param {string} layerName - 图层名称
   */
  showLayer(layerName: string): void {
    this.LayerManager.show(layerName);
  }

  /**
   * 隐藏指定图层
   * @param {string} layerName - 图层名称
   */
  hideLayer(layerName: string): void {
    this.LayerManager.hide(layerName);
  }

  /**
   * 显示所有图层
   */
  showAllLayers(): void {
    this.LayerManager.showAll();
  }

  /**
   * 隐藏所有图层
   */
  hideAllLayers(): void {
    this.LayerManager.hideAll();
  }

  /**
   * 重新加载所有图层
   */
  reloadLayers(): void {
    this.LayerManager.reload();
  }

  static error(msg: string) {
    console.error(`[MapUtils Error]:${msg}`);
  }
}

export type { mapUtilsIns, MapUtilsConstructor };

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

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

  static createAMapPolyline = MapMixin.createAMapPolyline;

  static loadPlugins = MapMixin.loadPlugins;

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

  /**
   * 创建聚合标记图层
   * @param {ClusterMarkerLayerOpts<U, T>} opts - 图层配置选项
   */
  createClusterMarkerLayer<
    U extends {},
    T extends MarkerClusterLayerType = 'markerClusterLayer',
  >(opts: ClusterMarkerLayerOpts<U, T>) {
    const layer = new ClusterMarkerLayer<U, T>(opts, this);
    // @ts-ignore
    this.LayerManager.addLayer(layer);
    return layer;
  }

  /**
   * `removeLayer`接收图层实例将其从mapUtils的关联中移除
   * @param {(BaseMarkerLayerIns | ClusterMarkerLayerIns)} layer
   */
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

  /**
   * 地图弹窗关闭
   * @memberof MapUtils
   */
  clearInfoWindow() {
    this.map.clearInfoWindow();
  }

  /**
   * 地图跳转参数
   * @typedef {Object} GotoOpts
   * @property {number} zoom                   - 目标缩放级别
   * @property {AMap.LngLat|[number,number]} center - 目标中心点（高德坐标实例或 [lng,lat] 数组）
   * @property {boolean} [immediately=false]   - 是否立即跳转，默认平滑过渡
   * @property {number} [duration]             - 过渡动画时长（毫秒）
   */
  /**
   * 将地图视图切换到指定状态
   * @param {GotoOpts} opts 跳转配置
   */
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
   * 地图指定图层显示, `layerName`为创建图层所传递的参数，用于标识图层名称。
   * @param {string} layerName - 图层名称
   */
  showLayer(layerName: string): void {
    this.LayerManager.show(layerName);
  }

  /**
   * 地图指定图层隐藏, `layerName`为创建图层所传递的参数，用于标识图层名称。
   * @param {string} layerName - 图层名称
   */
  hideLayer(layerName: string): void {
    this.LayerManager.hide(layerName);
  }

  /**
   * 地图显示所有图层
   */
  showAllLayers(): void {
    this.LayerManager.showAll();
  }

  /**
   * 地图所有图层隐藏
   */
  hideAllLayers(): void {
    this.LayerManager.hideAll();
  }

  /**
   * 地图所有图层重新渲染
   */
  reloadLayers(): void {
    this.LayerManager.reload();
  }

  /**
   * @ignore
   * @param msg
   */
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

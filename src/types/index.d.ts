// 项目类型声明文件
import type { AMap } from './amap';
// 高德地图实例
type mapIns = InstanceType<typeof AMap.Map>;

type MarkerIns = InstanceType<typeof AMap.Marker>;

type MapOptions = AMap.MapOptions;

interface MapUtilsCreateOpts extends MapOptions {
  mountSelector: string;
}

interface MapUtilsUseExistingOpts extends MapOptions {
  mapIns: mapIns;
}

type MapUtilsOpts = {
  MapUtilsUseExistingOpts: MapUtilsUseExistingOpts;
  MapUtilsCreateOpts: MapUtilsCreateOpts;
};

// 图层具备的基础方法
interface LayerBase {
  // 原始图层对象
  rawLayer: any;

  //创建覆盖物
  createOverlays: () => void;

  //图层隐藏
  hide: () => void;
  //图层展示
  show: () => void;

  //图层销毁
  destroy: () => void;
  // 所有覆盖物获取
  getAllOverlays: () => void;
}

// 图层
abstract class Layer {
  // 覆盖物配置数据
  overlayList: Array<{
    iconUrl: () => string;
    labelShow: boolean;
    overlaySelected: boolean; // 当前marker是否被选中
  }>;

  // 图层类型与控制器类的映射关系
  static layerClassMap = new Map();

  static registerLayer(layerType: string, layerClass: Function);
  // 图层名称
  layerName: string;

  //TODO  待定
  layerType: any;

  uuid: string;

  constructor();

  //创建覆盖物
  createOverlays: () => void;

  //图层隐藏
  hide: () => void;
  //图层展示
  show: () => void;

  //图层销毁
  destroy: () => void;

  //高亮marker
  highlightOverLay: () => void;

  //覆盖物自动适应
  overlayFitMap: () => void;

  //获取所有覆盖物
  getAllOverlay: () => void;

  //图层重载
  reload: () => void;
}

type layerIns = InstanceType<typeof Layer>;

// 图层管理器
interface layerManger<T = Layer> {
  //layers: 图层存在于layer时才会显示
  layers: Map<string, T>;

  addLayer(layer: layerIns): void;

  removeLayer(layerIdOrLayer: layer | string): void;

  show(): void;

  hide(): void;

  showAll(): void;

  hideAll(): void;

  reload(): void;
}

//TODO 事件处理
abstract class markersLayer implements LayerBase {
  rawLayer: InstanceType<AMap.OverlayGroup>;

  add(markers: Array<MarkerIns>): void;

  remove(markers: Array<MarkerIns>): void;

  hide(): void;

  show(): void;

  getAllOverlays(): void;

  destroy: () => void;
}

export type { MapUtilsOpts, mapIns };

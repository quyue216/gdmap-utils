// 项目类型声明文件
import type { MarkerOptions } from './amap';
import type { mapUtilsIns } from '../MapUtils';

// 高德地图实例
type mapIns = InstanceType<typeof AMap.Map>;

type MarkerIns = AMap.Marker;

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

type layerType = 'markersLayer' | 'labelMarkersLayer' | 'markersClusterLayer';

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

interface overlayData<T extends object = {}> {
  lon: number;
  lat: number;
  title: string;
  id: string;
  extData: T;
}

interface LayerOpts<V = {}, E> {
  layerType: layerType;
  layerName: string;
  requestCallback: () => Array<overlayData<V>>;
  createOverlays: (mapUtilsIns) => Array<E>;
  getIconUrl: () => string; //overlayList中优先级更高
  // overlayOpts: 命名空间的export type，你该怎么接收
}

// 图层
abstract class Layer<T, E = MarkerIns> {
  // 覆盖物配置数据
  overlayList: Array<{
    getIconUrl: () => string; //局部优先级更高
    labelShow: boolean;
    overlaySelected: boolean; // 当前marker是否被选中
  }>;

  // 图层类型与控制器类的映射关系
  static layerClassMap = new Map<string, T>();

  static registerLayer(layerType: string, layerClass: Function);
  // 图层名称
  layerName: string;

  rawLayerIns: T;

  //TODO  待定
  layerType: layerType;

  uuid: string; //图层名称+随机数

  constructor(opts: LayerOpts);

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

  add(overlays: Array<E>): void;

  remove(overlays: Array<E>): void;
}

// 图层管理器
interface layerManger<T = Layer, K = InstanceType<T>> {
  //它可以形参接收this.map
  //layers: 图层存在于layer时才会显示
  layers: Map<string, T>; //组合模式

  addLayer(layer: K): void;

  removeLayer(layerIdOrLayer: layer | string): void;

  show(): void; //! 你怎么知道，你要隐藏或者显示某个图层

  hide(): void;

  showAll(): void;

  hideAll(): void;

  reload(): void;
}

//TODO 事件处理
abstract class overlaysLayer<T, LayerType> implements LayerBase {
  rawLayer: LayerType;

  //创建覆盖物
  createOverlays: () => Array<T>;

  add(markers: Array<T>): void;

  remove(markers: Array<T>): void;

  hide(): void;

  show(): void;

  getAllOverlay(): void;

  destroy: () => void;

  reload: () => void;

  //高亮marker
  highlightOverLay: () => void;

  //覆盖物自动适应
  overlayFitMap: () => void;
}

export type { MapUtilsOpts, mapIns };

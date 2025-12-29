// 项目类型声明文件
import type { MarkerOptions } from './amap';
import type { mapUtilsIns } from '../MapUtils';
import type {
  MarkerLayerIns,
  LabelMarkerLayerIns,
  MarkerClusterLayerIns,
  LayerTypeIns,
  LayerTypeClass,
} from '../layers/index';

// 高德地图实例
type mapIns = InstanceType<typeof AMap.Map>;

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

interface MapUtilsLayersInfo {
  markerLayer: {
    layerIns: MarkerLayerIns;
    overlayOpts: AMap.MarkerOptions; //!考虑改为简写
    ovIns: AMap.Marker;
  };
  labelMarkerLayer: {
    layerIns: LabelMarkerLayerIns;
    overlayOpts: AMap.LabelMarkerOptions;
    ovIns: AMap.LabelMarker;
  };
  markerClusterLayer: {
    layerIns: MarkerClusterLayerIns;
    overlayOpts: AMap.LabelMarkerOptions; //TODO  AMap.LabelMarkerOptions占位
    ovIns: AMap.MarkerClusterer;
  };
} //定义图层信息
type layerType = 'markerLayer' | 'labelMarkerLayer' | 'markerClusterLayer';

export interface overlayData<T extends object = {}> {
  overlayData: {
    lon: number;
    lat: number;
    title: string;
    id: string;
    extData: T;
    weight: number;
  };
  // 覆盖物配置数据
  labelShowed: boolean;
  overlaySelected: boolean; // 当前marker是否被选中
}

interface LayerOpts<
  U = {},
  T extends layerType = 'markerLayer',
  V = MapUtilsLayersInfo[T],
> {
  layerType: T;
  layerName: string;
  overlayList: Array<overlayData<U>>;
  createOverlays: (mapUtilsIns) => Array<V['overlayIns']>;
  getIconUrl: () => string; //overlayList中优先级更高
  overlayOpts: V['overlayOpts']; //全局数据
}

// 图层接口
interface ILayer {
  // 覆盖物配置数据
  overlayList: Array<overlayData>;

  layerName: string;

  rawLayerIns: LayerTypeIns;

  layerType: layerType;

  layerVisible: boolean;

  createOverlays(): void;

  hide(): void;

  show(): void;

  destroy(): void;

  highlightOverLay(): void;

  overlayFitMap(): void;

  getAllOverlay<R>(): R;

  reload(): void;

  add<T>(overlays: Array<T>): void;

  remove<T>(overlays: Array<T>): void;
}

// 图层管理器
interface LayerManger<T = ILayer, K = InstanceType<T>> {
  //它可以形参接收this.map
  //layers: 图层存在于layer时才会显示
  layers: Map<string, K>; //组合模式

  addLayer(layer: K): void;

  removeLayer(layerIdOrLayer: layer | string): void;

  show(): void; //! 你怎么知道，你要隐藏或者显示某个图层

  hide(): void;

  showAll(): void;

  hideAll(): void;

  reload(): void;
}

//TODO_1 事件处理, T and U可以用MapUtilsLayersInfo类型
interface OverlaysLayer<T, U> {
  rawLayer: U;

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

export type {
  MapUtilsOpts,
  mapIns,
  layerType,
  OverlaysLayer,
  LayerManger,
  ILayer,
  LayerOpts,
  MapUtilsLayersInfo,
};

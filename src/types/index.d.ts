// 项目类型声明文件
import type { MarkerOptions } from './amap';
import type { MapUtilsConstructor, mapUtilsIns } from '../MapUtils';
import type {
  MarkerLayerIns,
  LabelMarkerLayerIns,
  MarkerClusterLayerIns,
  LayerTypeIns,
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
}
//定义图层信息
type layerType = 'markerLayer' | 'labelMarkerLayer' | 'markerClusterLayer';

//HACK 接口名需要大写
export interface overlayData<T extends object = {}> {
  overlayData: {
    lon: number;
    lat: number;
    title: string;
    id: string;
    extData: T;
    weight?: number;
  };
  id: string;
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
  createOverlays: (mapUtilsIns) => Array<V['overlayIns']>; // 未使用上
  getIconUrl: (item: overlayData<U>) => string; //overlayList中优先级更高
  getOverlayOpts: (
    item: overlayData<U>,
    index: number,
    MapUtils: MapUtilsConstructor
  ) => V['overlayOpts']; //动态生成覆盖物配置
  overlayLayer?: AMap.LabelsLayerOptions; //! labelMarker，marker渲染方式不同, labelMarker为canvas与Marker为Dom渲染 (重复定义)
}

// 图层管理器
interface LayerManger<T = ILayer, K = InstanceType<T>> {
  //它可以形参接收this.map
  //layers: 图层存在于layer时才会显示
  layers: WeakMap<K, K>; //组合模式

  addLayer(layer: K): void;

  removeLayer(layerIdOrLayer: layer | string): void;

  show(): void; //! 你怎么知道，你要隐藏或者显示某个图层

  hide(): void;

  showAll(): void;

  hideAll(): void;

  reload(): void;
}

interface OverlaysLayer<T, U> {
  rawLayer: U;

  //创建覆盖物
  createOverlays: (ovOptList: Array<any>) => Array<T>;

  add(markers: Array<any>): void;

  remove(markers: Array<T>): void;

  hide(): void;

  show(): void;

  getAllOverlay(): void;

  destroy: () => void;

  reload: () => void;

  //覆盖物自动适应
  overlayFitMap: () => void;
}
interface Window {
  _AMapSecurityConfig?: {
    securityJsCode: string;
    serviceHost: string;
  };
}
export type {
  MapUtilsOpts,
  mapIns,
  layerType,
  OverlaysLayer,
  LayerManger,
  LayerOpts,
  MapUtilsLayersInfo,
};

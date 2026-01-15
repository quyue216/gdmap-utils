import type { MarkerOptions } from './amap';
import type { MapUtilsConstructor } from '../MapUtils';
import type {
  MarkerLayerIns,
  LabelMarkerLayerIns,
  MarkerClusterLayerIns,
  LayerTypeIns,
} from '../layers/index';

interface MapUtilsLayersInfo {
  markerLayer: {
    layerIns: MarkerLayerIns;
    overlayOpts: AMap.MarkerOptions;
    ovIns: AMap.Marker;
  };
  labelMarkerLayer: {
    layerIns: LabelMarkerLayerIns;
    overlayOpts: AMap.LabelMarkerOptions;
    ovIns: AMap.LabelMarker;
  };
}
//定义图层信息
type MarkerLayerBaseType = 'markerLayer' | 'labelMarkerLayer';

export interface OverlayData<T extends object = {}> {
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
  T extends MarkerLayerBaseType = 'markerLayer',
  V = MapUtilsLayersInfo[T],
> {
  layerType: T;
  layerName: string;
  overlayList: Array<OverlayData<U>>;
  createOverlays: (mapUtilsIns) => Array<V['overlayIns']>; // 未使用上
  getIconUrl: (item: OverlayData<U>) => string; //overlayList中优先级更高
  getOverlayOpts: (
    item: OverlayData<U>,
    index: number,
    MapUtils: MapUtilsConstructor
  ) => V['overlayOpts']; //动态生成覆盖物配置
  overlayLayer?: AMap.LabelsLayerOptions;
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

export type {
  MapUtilsLayersInfo,
  MarkerLayerBaseType,
  LayerOpts,
  OverlaysLayer,
};

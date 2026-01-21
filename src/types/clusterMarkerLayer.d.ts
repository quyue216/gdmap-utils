import type { MarkerClusterLayerIns } from '../layers/clusterMarkerLayer';

interface ClusterMarkerLayerInfo {
  markerClusterLayer: {
    layerIns: MarkerClusterLayerIns;
    overlayOpts: any; // 聚合图层使用任意类型作为配置
    ovIns: any; // 聚合图层返回任意类型作为实例
  };
}

//定义聚合图层类型
type MarkerClusterLayerType = 'markerClusterLayer';

// 扩展LayerOpts类型以支持聚合图层
interface LayerOpts<
  U = {},
  T extends MarkerClusterLayerType = 'markerClusterLayer',
  V = ClusterMarkerLayerInfo[T],
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
  overlayLayer?: any; // 聚合图层配置
}

export type { ClusterMarkerLayerInfo, MarkerClusterLayerType, LayerOpts };

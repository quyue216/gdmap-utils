import type { MarkerClusterLayerIns } from '@/layers/clusterMarkerLayer/index.ts';
import type { OverlayData } from './BaseMarkerLayer';
//定义聚合图层类型
type MarkerClusterLayerType = 'markerClusterLayer';

//!------------markerClusterLayer.ts类型代码如下------------------
// 图层配置信息
interface MarkerClusterOptions {
  /** 聚合计算时网格的像素大小，默认 60 */
  gridSize?: number;
  /** 最大聚合级别，大于该级别不再聚合，默认 18 */
  maxZoom?: number;
  /**
   * 聚合图标位置是否取所有点（或权重最大点）的中心。
   * 默认为 true。
   */
  averageCenter?: boolean;
  /** 地图缩放过程中是否实时重算聚合，默认 false */
  clusterByZoomChange?: boolean;
  /**
   * 聚合图标样式数组，按聚合数量区间 1-10、11-100、101-1000… 顺序给出。
   * 当数量超出给定样式时，剩余区间使用默认样式。
   */
  styles?: Array<{
    /** 图标图片地址（必选） */
    url: string;
    /** 图标尺寸（必选） */
    size: AMap.Size;
    /** 图标定位偏移，默认 (0,0) */
    offset?: AMap.Pixel;
    /** 图片背景偏移，等同 CSS background-position，默认 (0,0) */
    imageOffset?: AMap.Pixel;
    /** 文字颜色，默认 "#000000" */
    textColor?: string;
    /** 文字大小，默认 10 */
    textSize?: number;
  }>;
  /**
   * 自定义聚合点绘制逻辑，指定后 styles 失效。
   * @param context 聚合上下文
   */
  renderClusterMarker?: (context: {
    /** 当前聚合包含的 Marker 数量 */
    count: number;
    /** 当前聚合所对应的 Marker 对象（可进一步修改其 Icon、内容等） */
    marker: AMap.Marker;
  }) => void;
  /**
   * 自定义非聚合点绘制逻辑。
   * @param context 非聚合点上下文
   */
  renderMarker?: (context: {
    /** 非聚合的 Marker 对象 */
    marker: AMap.Marker;
  }) => void;
}

type MarkerClusterDataOptions<T extends {} = {}> = {
  weight: number;
  lnglat: [number, number];
} & T;

type ClusterMarkerLayerInfo = {
  markerClusterLayer: {
    layerIns: MarkerClusterLayerIns;
    layerOpts: MarkerClusterOptions;
  };
};

interface ClusterMarkerLayerOpts<
  U = {},
  T extends MarkerClusterLayerType = 'markerClusterLayer',
  V = ClusterMarkerLayerInfo[T],
> {
  layerType: T;
  layerName: string;
  overlayList: Array<OverlayData<U>>;
  layerOpts: V['layerOpts'];
}

export type {
  MarkerClusterLayerType,
  MarkerClusterOptions,
  MarkerClusterDataOptions,
  // 图层定义类型代码
  ClusterMarkerLayerInfo,
  ClusterMarkerLayerOpts,
};

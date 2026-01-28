import MarkerClusterLayer from './MarkerClusterLayer';
import type {
  MarkerClusterLayerType,
  OverlayData, //OverLayerData图层公共接口
  MarkerClusterDataOptions,
  ClusterMarkerLayerInfo,
  ClusterMarkerLayerOpts,
} from '@/types';
import { MapUtils } from '@/MapUtils';
import type { mapUtilsIns } from '@/MapUtils';

class ClusterMarkerLayer<
  U extends object,
  T extends MarkerClusterLayerType = 'markerClusterLayer',
  V extends ClusterMarkerLayerInfo[T] = ClusterMarkerLayerInfo[T],
> {
  // 图层类型与控制器类的映射关系

  /**
   *@ignore
   */
  static layerClassMap = new Map<string, ClusterMarkerLayerTypeClass>();
  /**
   * 注册图层类型与控制器类的关联
   * @param {string} layerType - 图层类型
   * @param {Function} layerClass - 图层控制器类
   * @ignore
   */
  static registerLayer(
    layerType: MarkerClusterLayerType,
    layerClass: ClusterMarkerLayerTypeClass
  ) {
    if (typeof layerType !== 'string' || typeof layerClass !== 'function') {
      MapUtils.error(
        '[ClusterMarkerLayer Error]: Invalid layer type or layer class'
      );
      return;
    }

    ClusterMarkerLayer.layerClassMap.set(layerType, layerClass);
  }

  overlayList: Array<OverlayData<U>>;
  // 策略模式
  rawLayerIns: V['layerIns'];

  layerVisible: boolean = true;

  layerName: string;

  mapUtils: mapUtilsIns;

  layerType: MarkerClusterLayerType;

  constructor(opts: ClusterMarkerLayerOpts<U, T>, mapUtils: mapUtilsIns) {
    const { layerType, layerName, ...rest } = opts;

    const OverlaysLayer = ClusterMarkerLayer.layerClassMap.get(layerType);

    if (OverlaysLayer) {
      // 将OverlayData转换为MarkerClusterDataOptions
      const clusterData = this.convertOverlayDataToClusterData(
        opts.overlayList
      );

      this.rawLayerIns = new OverlaysLayer(
        mapUtils.map,
        clusterData,
        opts.layerOpts
      );
    } else {
      throw new Error(
        `[ClusterMarkerLayer Error]: Invalid layer type ${layerType}`
      );
    }

    this.layerName = layerName;

    this.mapUtils = mapUtils; //mapUtils的实例

    this.overlayList = opts.overlayList;

    this.layerType = opts.layerType;

    Object.assign(this, rest);
  }

  /**
   * 将覆盖物数据转换为聚合标记所需的数据格式
   * @param overlayList 覆盖物数据列表
   * @returns 聚合标记数据列表
   */
  private convertOverlayDataToClusterData(
    overlayList: Array<OverlayData<U>>
  ): Array<MarkerClusterDataOptions> {
    return overlayList.map(item => {
      return {
        ...item,
        lnglat: [item.overlayData.lon, item.overlayData.lat],
        weight: item.overlayData.weight || 1,
      };
    });
  }

  bindEventOverlays(clickType: AMap.EventType, callback: () => void) {
    this.rawLayerIns.bindEventMarker(clickType, callback);
  }

  hide() {
    this.layerVisible = false;
    this.rawLayerIns.hide();
  }

  show() {
    this.layerVisible = true;
    const clusterData = this.convertOverlayDataToClusterData(this.overlayList);
    this.rawLayerIns.show(clusterData);
  }

  destroy() {
    this.mapUtils.removeLayer(this); //从MapUtils中移除
    this.rawLayerIns.destroy(); //地图层面移除
    this.overlayList = [];
  }

  clearAllOverlay() {
    this.overlayList = [];
    this.rawLayerIns.clearAllOvl();
  }

  add(overlayList: Array<OverlayData<U>>) {
    const clusterData = this.convertOverlayDataToClusterData(overlayList);

    this.overlayList.push(...overlayList);

    // 逐个添加聚合数据
    this.rawLayerIns.add(clusterData);
  }

  /**
   * `remove`
   *
   * @param {(Array<number | string>)} ovs
   * @memberof ClusterMarkerLayer
   */
  remove(ovs: Array<number | string>) {
    if (Array.isArray(ovs)) {
      // 根据ID移除覆盖物
      const ids = ovs as Array<string | number>;

      // 更新本地覆盖物列表
      this.overlayList = this.overlayList.filter(
        item => !ids.includes(item.id)
      );

      // 重新设置聚合数据
      const clusterData = this.convertOverlayDataToClusterData(
        this.overlayList
      );
      this.rawLayerIns.remove(clusterData);
    }
    // 聚合图层不支持直接移除单个实例
  }

  /**
   *
   *`getRawLayer`方法返回高德覆盖物管理对象, 例如: 图层类型为`markerClusterLayer`,方法返回的对象类型为`new AMap.MarkerCluster(xx,'xxx')`
   * @return {*}
   */
  getRawLayer() {
    return this.rawLayerIns.rawLayer;
  }
}

// 注册聚合图层类型
ClusterMarkerLayer.registerLayer('markerClusterLayer', MarkerClusterLayer);

/**
 * MarkerClusterLayer 类型
 * @ignore
 */
export type MarkerClusterLayerIns = InstanceType<typeof MarkerClusterLayer>;

/**
 * 所有聚合图层类型的联合类型
 * @ignore
 */
export type ClusterMarkerLayerTypeIns = MarkerClusterLayerIns;
/**
 * @ignore
 */
export type ClusterMarkerLayerTypeClass = typeof MarkerClusterLayer;
/**
 * @ignore
 */
export type ClusterMarkerLayerClass = typeof ClusterMarkerLayer;
/**
 * @ignore
 */
export type ClusterMarkerLayerIns = InstanceType<ClusterMarkerLayerClass>;

export { MarkerClusterLayer };

export default ClusterMarkerLayer;

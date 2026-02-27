import LabelMarkerLayer from './LabelMarkerLayer';
import MarkerLayer from './MarkerLayer';
import type {
  MarkerLayerBaseType,
  LayerOpts,
  BaseMarkerLayerInfo,
  OverlayData,
} from '@/types';
import { MapUtils } from '@/MapUtils';
import type { MapUtilsConstructor, mapUtilsIns } from '@/MapUtils';

class BaseMarkerLayer<
  U extends object,
  T extends MarkerLayerBaseType = 'markerLayer',
  V extends BaseMarkerLayerInfo[T] = BaseMarkerLayerInfo[T],
> {
  // 图层类型与控制器类的映射关系
  static layerClassMap = new Map<string, BaseMarkerLayerTypeClass>();
  /**
   * 注册图层类型与控制器类的关联
   * @param {string} layerType - 图层类型
   * @param {Function} layerClass - 图层控制器类
   */
  static registerLayer(
    layerType: MarkerLayerBaseType,
    layerClass: BaseMarkerLayerTypeClass
  ) {
    if (typeof layerType !== 'string' || typeof layerClass !== 'function') {
      MapUtils.error('[LayerManager Error]: Invalid layer type or layer class');
      return;
    }

    BaseMarkerLayer.layerClassMap.set(layerType, layerClass);
  }

  overlayList: Array<OverlayData<U>> = [];
  // 策略模式
  rawLayerIns: V['layerIns'];

  layerVisible: boolean = true;

  layerName: string;

  mapUtils: mapUtilsIns;

  getIconUrl: (item: OverlayData<U>) => string;

  layerType: MarkerLayerBaseType;

  getOverlayOpts: (
    item: OverlayData<U>,
    index: number,
    MapUtils: MapUtilsConstructor
  ) => V['overlayOpts'];

  constructor(opts: LayerOpts<U, T>, mapUtils: mapUtilsIns) {
    const { layerType, layerName, ...rest } = opts;

    const OverlaysLayer = BaseMarkerLayer.layerClassMap.get(layerType);

    if (OverlaysLayer) {
      this.rawLayerIns = new OverlaysLayer(mapUtils.map, opts.overlayLayer);
    } else {
      throw new Error(
        `[BaseMarkerLayer Error]: Invalid layer type ${layerType}`
      );
    }

    this.layerName = layerName;

    this.mapUtils = mapUtils; //上层,mapUtils的实例

    this.overlayList = opts.overlayList;

    this.getIconUrl = opts.getIconUrl;

    this.getOverlayOpts = opts.getOverlayOpts;

    this.layerType = opts.layerType;

    Object.assign(this, rest);

    this.initLayer();
  }

  // 图层事件,覆盖物初始化
  initLayer() {
    this.createOverlays(this.overlayList);
  }

  /**
   * 将覆盖物数据转换为覆盖物配置
   * @param overlayList 覆盖物数据列表
   * @returns 覆盖物配置列表
   */
  convertOverlayDataToOpts(
    overlayList: Array<OverlayData<U>>
  ): Array<V['overlayOpts']> {
    const OverlaysLayer = BaseMarkerLayer.layerClassMap.get(this.layerType)!;

    return overlayList.map((item, index) => {
      return OverlaysLayer.convertOverlayDataToOvlOpts(
        item,
        index,
        this.getIconUrl,
        this.getOverlayOpts,
        MapUtils
      );
    });
  }

  createOverlays(overlayList: Array<OverlayData>): Array<V['ovIns']> {
    const markerListOpts: Array<V['overlayOpts']> =
      this.convertOverlayDataToOpts(overlayList as Array<OverlayData<U>>);

    return this.rawLayerIns.createOverlays(
      // @ts-ignore
      markerListOpts
    );
  }

  overlayFitMap() {
    this.rawLayerIns.overlayFitMap();
  }

  bindEventOverlays(clickType: AMap.EventType, callback: () => void) {
    this.rawLayerIns.bindEventOverlay(clickType, callback);
  }

  hide() {
    this.layerVisible = false;
    this.rawLayerIns.hide();
  }

  show() {
    this.layerVisible = true;
    this.rawLayerIns.show();
  }

  getAllOverlay() {
    // 数据进行D会影响覆盖物，浅拷贝
    return [...this.rawLayerIns.getAllOverlay()!];
  }

  destroy() {
    // @ts-ignore
    this.mapUtils.removeLayer(this); //从MapUtils中移除
    this.rawLayerIns.destroy(); //地图层面移除
    this.overlayList = [];

    //TODO layer实例怎么销毁
  }

  clearAllOverlay() {
    this.overlayList = [];
    this.rawLayerIns.clearAllOvl();
  }

  reload() {
    this.rawLayerIns.reload();

    this.createOverlays(this.overlayList);
  }

  findLayerOverlay(ovId: string | number) {
    return this.rawLayerIns.findLayerOverlay(ovId);
  }

  add(overlayList: Array<OverlayData<U>>) {
    const markerListOpts: Array<V['overlayOpts']> =
      this.convertOverlayDataToOpts(overlayList as Array<OverlayData<U>>);

    this.overlayList.push(...overlayList);
    // 类型守卫 缩小实例范围
    if (this.rawLayerIns instanceof MarkerLayer) {
      this.rawLayerIns.add(markerListOpts as AMap.MarkerOptions[]);
    } else if (this.rawLayerIns instanceof LabelMarkerLayer) {
      this.rawLayerIns.add(markerListOpts as AMap.LabelMarkerOptions[]);
    }
  }

  remove(ovs: Array<V['ovIns']> | string[]) {
    // 处理MarkerLayer类型
    if (this.rawLayerIns instanceof MarkerLayer) {
      // 类型守卫：检查是否为Marker实例数组
      const isMarkerArray = (arr: any[]): arr is AMap.Marker[] =>
        arr[0] instanceof AMap.Marker;

      if (!isMarkerArray(ovs)) {
        // 根据ID查找覆盖物实例
        const overlayInstances = ovs
          .map(id => this.findLayerOverlay(id as string | number))
          .filter((ovl): ovl is AMap.Marker => !!ovl);

        this.rawLayerIns.remove(overlayInstances);

        this.overlayList = this.overlayList.filter(
          item => !(ovs as Array<string | number>).includes(item.id)
        );
      } else {
        const ids = ovs.map(item => item.getExtData().id);

        this.overlayList = this.overlayList.filter(
          item => !(ids as Array<string | number>).includes(item.id)
        );
        // 直接使用覆盖物实例数组
        this.rawLayerIns.remove(ovs as AMap.Marker[]);
      }
    }
    // 处理LabelMarkerLayer类型
    else if (this.rawLayerIns instanceof LabelMarkerLayer) {
      // 类型守卫：检查是否为LabelMarker实例数组
      const isLabelMarkerArray = (arr: any[]): arr is AMap.LabelMarker[] =>
        arr[0] instanceof AMap.LabelMarker;

      if (!isLabelMarkerArray(ovs)) {
        // 根据ID查找覆盖物实例
        const overlayInstances = ovs
          .map(id => this.findLayerOverlay(id as string | number))
          .filter((ovl): ovl is AMap.LabelMarker => !!ovl);

        this.rawLayerIns.remove(overlayInstances);

        this.overlayList = this.overlayList.filter(
          item => !(ovs as Array<string | number>).includes(item.id)
        );
      } else {
        const ids = ovs.map(item => item.getExtData().id);

        this.overlayList = this.overlayList.filter(
          item => !(ids as Array<string | number>).includes(item.id)
        );
        // 直接使用覆盖物实例数组
        this.rawLayerIns.remove(ovs as AMap.LabelMarker[]);
      }
    }
  }

  refreshOverlayIcon(overlayId: string) {
    const ovlDataIndex = this.overlayList.findIndex(
      ovl => ovl.id === overlayId
    );

    if (ovlDataIndex === -1) {
      //抛异常
      return MapUtils.error(
        `[BaseMarkerLayer Error]: Invalid overlayId ${overlayId}`
      );
    }
    const OvlLayer = BaseMarkerLayer.layerClassMap.get(this.layerType);

    const marker = this.rawLayerIns.findLayerOverlay(overlayId);
    // 函数可以动态计算label,
    const ovlOpts = OvlLayer!.convertOverlayDataToOvlOpts(
      this.overlayList[ovlDataIndex],
      ovlDataIndex,
      this.getIconUrl,
      this.getOverlayOpts,
      MapUtils
    );

    const iconImageUrl = this.getIconUrl(this.overlayList[ovlDataIndex]);

    if (this.rawLayerIns instanceof MarkerLayer) {
      let icon = ovlOpts.icon! as AMap.Icon | string;

      if (typeof icon === 'string') {
        icon = iconImageUrl;
      } else {
        (icon as AMap.Icon).setImage(iconImageUrl);
      }

      (this.rawLayerIns as MarkerLayerIns).refreshOverlayIcon(
        (marker as AMap.Marker)!,
        icon
      );
    } else {
      let icon = ovlOpts.icon! as AMap.LabelMarkerIconOptions;

      icon.image = iconImageUrl;

      this.rawLayerIns.refreshOverlayIcon((marker as AMap.LabelMarker)!, icon);
    }
  }

  refreshOverlayLabel(overlayId: string | number) {
    const ovlDataIndex = this.overlayList.findIndex(
      ovl => ovl.id === overlayId
    );

    if (ovlDataIndex === -1) {
      //抛异常
      return MapUtils.error(`[Layer Error]: Invalid overlayId ${overlayId}`);
    }
    const OvlLayer = BaseMarkerLayer.layerClassMap.get(this.layerType);

    // marker拿到手
    const marker = this.rawLayerIns.findLayerOverlay(overlayId)!;

    // 函数可以动态计算label,
    const ovlOpts = OvlLayer!.convertOverlayDataToOvlOpts(
      this.overlayList[ovlDataIndex],
      ovlDataIndex,
      this.getIconUrl,
      this.getOverlayOpts,
      MapUtils
    );

    if (this.rawLayerIns instanceof MarkerLayer) {
      this.rawLayerIns.refreshOverlayLabel(
        marker as AMap.Marker,
        (ovlOpts as AMap.MarkerOptions).label as {
          content: string;
          direction: string;
          offset: [number, number] | Array<number>;
        }
      );
    } else {
      this.rawLayerIns.refreshOverlayLabel(
        marker as AMap.LabelMarker,
        ovlOpts.text as AMap.LabelMarkerTextOptions
      );
    }
  }

  // 返回原始图层对象
  getRawLayer() {
    return this.rawLayerIns.rawLayer;
  }
}

BaseMarkerLayer.registerLayer('markerLayer', MarkerLayer);
BaseMarkerLayer.registerLayer('labelMarkerLayer', LabelMarkerLayer);

// MarkerLayer 类型
/**
 * @ignore
 */
export type MarkerLayerIns = InstanceType<typeof MarkerLayer>;

// LabelMarkerLayer 类型
/**
 * @ignore
 */
export type LabelMarkerLayerIns = InstanceType<typeof LabelMarkerLayer>;

// 所有图层类型的联合类型
/**
 * @ignore
 */
export type BaseMarkerLayerTypeIns = MarkerLayerIns | LabelMarkerLayerIns;
/**
 * @ignore
 */
export type BaseMarkerLayerTypeClass =
  | typeof MarkerLayer
  | typeof LabelMarkerLayer;
/**
 * @ignore
 */
export type BaseMarkerLayerClass = typeof BaseMarkerLayer;
/**
 * @ignore
 */
export type BaseMarkerLayerIns = InstanceType<BaseMarkerLayerClass>;

export { LabelMarkerLayer, MarkerLayer };

export default BaseMarkerLayer;

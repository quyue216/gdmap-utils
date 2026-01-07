import LabelMarkerLayer from './LabelMarkerLayer';
import MarkerClusterLayer from './MarkerClusterLayer';
import MarkerLayer from './MarkerLayer';
import type {
  layerType,
  LayerOpts,
  MapUtilsLayersInfo,
  overlayData,
} from '../types/index.d';
import { MapUtils } from '../MapUtils';
import type { MapUtilsConstructor, mapUtilsIns } from '../MapUtils';

class Layer<
  U extends object,
  T extends layerType = 'markerLayer',
  V extends MapUtilsLayersInfo[T] = MapUtilsLayersInfo[T],
> {
  // 图层类型与控制器类的映射关系
  static layerClassMap = new Map<string, LayerTypeClass>();
  /**
   * 注册图层类型与控制器类的关联
   * @param {string} layerType - 图层类型
   * @param {Function} layerClass - 图层控制器类
   */
  static registerLayer(layerType: layerType, layerClass: LayerTypeClass) {
    if (typeof layerType !== 'string' || typeof layerClass !== 'function') {
      MapUtils.error('[LayerManager Error]: Invalid layer type or layer class');
      return;
    }

    Layer.layerClassMap.set(layerType, layerClass);
  }

  overlayList: Array<overlayData<U>>;
  // 策略模式
  rawLayerIns: LayerTypeIns;

  layerVisible: boolean = true;

  layerName: string;

  mapUtils: mapUtilsIns;

  getIconUrl: (item: overlayData<U>) => string;

  layerType: layerType;

  getOverlayOpts: (
    item: overlayData<U>,
    index: number,
    MapUtils: MapUtilsConstructor
  ) => V['overlayOpts'];

  constructor(opts: LayerOpts<U, T>, mapUtils: mapUtilsIns) {
    const { layerType, layerName, ...rest } = opts;

    const OverlaysLayer = Layer.layerClassMap.get(layerType);

    if (OverlaysLayer) {
      this.rawLayerIns = new OverlaysLayer(mapUtils.map, opts.overlayLayer);
    } else {
      throw new Error(`[Layer Error]: Invalid layer type ${layerType}`);
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
    overlayList: Array<overlayData<U>>
  ): Array<V['overlayOpts']> {
    return overlayList.map((item, index) => {
      // 如果是标记图层，使用 MarkerLayer 的静态方法转换配置
      if (this.rawLayerIns instanceof MarkerLayer) {
        return MarkerLayer.convertOverlayDataToOvlOpts(
          //后续改为从layClassMap中读取
          item,
          index,
          this.getIconUrl,
          this.getOverlayOpts,
          MapUtils
        ) as V['overlayOpts'];
      } else if (this.rawLayerIns instanceof LabelMarkerLayer) {
        return LabelMarkerLayer.convertOverlayDataToOvlOpts(
          //后续改为从layClassMap中读取
          item,
          index,
          this.getIconUrl,
          this.getOverlayOpts,
          MapUtils
        ) as V['overlayOpts'];
      }
      //TODO 待兼容其他类型
      // 其他图层类型的默认转换逻辑
      const {
        overlayData: { lon, lat, extData },
      } = item;

      // 获取当前覆盖物项的动态配置
      const itemOpts = this.getOverlayOpts(item, index, MapUtils);

      return {
        position: [lon, lat],
        extData,
        ...itemOpts,
      } as V['overlayOpts'];
    });
  }

  createOverlays(overlayList: Array<overlayData>): Array<V['ovIns']> {
    const markerListOpts: Array<V['overlayOpts']> =
      this.convertOverlayDataToOpts(overlayList as Array<overlayData<U>>);
    //HACK 类型报错解决方式不优雅
    return this.rawLayerIns.createOverlays(
      // @ts-ignore
      markerListOpts as Array<AMap.MapOptions>
    );
  }

  overlayFitMap() {
    this.rawLayerIns.overlayFitMap();
  }

  bindEventOverlays(clickType: AMap.EventType, callback: () => void) {
    (this.rawLayerIns as MarkerLayerIns).bindEventOverlay(clickType, callback);
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
    // 浅拷贝规避bug
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
    (this.rawLayerIns as MarkerLayerIns).clearAllOvl();
  }

  reload() {
    this.rawLayerIns.reload();

    this.createOverlays(this.overlayList);
  }

  findLayerOverlay(ovId: string | number) {
    if (this.rawLayerIns instanceof MarkerLayer) {
      return this.rawLayerIns.findLayerOverlay(ovId);
    } else if (this.rawLayerIns instanceof LabelMarkerLayer) {
      return this.rawLayerIns.findLayerOverlay(ovId as string);
    }
    return null;
  }

  add(overlayList: Array<overlayData<U>>) {
    const markerListOpts: Array<V['overlayOpts']> =
      this.convertOverlayDataToOpts(overlayList as Array<overlayData<U>>);

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
      return MapUtils.error(`[Layer Error]: Invalid overlayId ${overlayId}`);
    }
    const OvlLayer = Layer.layerClassMap.get(this.layerType);

    if (this.rawLayerIns instanceof MarkerLayer) {
      const marker = this.rawLayerIns.findLayerOverlay(overlayId);

      if (!(marker instanceof AMap.Marker)) {
        //抛异常
        return MapUtils.error(`[Layer Error]: Invalid overlayId ${overlayId}`);
      }

      // 函数可以动态计算label,
      const ovlOpts = (
        OvlLayer as typeof MarkerLayer
      ).convertOverlayDataToOvlOpts(
        this.overlayList[ovlDataIndex],
        ovlDataIndex,
        this.getIconUrl,
        this.getOverlayOpts,
        MapUtils
      );

      const iconImageUrl = this.getIconUrl(this.overlayList[ovlDataIndex]);

      let icon = ovlOpts.icon!;

      if (typeof icon === 'string') {
        icon = iconImageUrl;
      } else {
        icon.setImage(iconImageUrl);
      }

      this.rawLayerIns.refreshOverlayIcon(marker, icon);
    }
  }

  refreshOverlayLabel(overlayId: string | number, labelShow: boolean) {
    const ovlDataIndex = this.overlayList.findIndex(
      ovl => ovl.id === overlayId
    );

    if (ovlDataIndex === -1) {
      //抛异常
      return MapUtils.error(`[Layer Error]: Invalid overlayId ${overlayId}`);
    }
    const OvlLayer = Layer.layerClassMap.get(this.layerType);

    if (this.rawLayerIns instanceof MarkerLayer) {
      // marker拿到手
      const marker = this.rawLayerIns.findLayerOverlay(overlayId)!;

      const ovDataItem = this.overlayList.find(item => item.id === overlayId);
      // 属性值转变为boolean
      ovDataItem!.labelShowed = labelShow;

      // 函数可以动态计算label,
      const ovlOpts = (
        OvlLayer as typeof MarkerLayer
      ).convertOverlayDataToOvlOpts(
        this.overlayList[ovlDataIndex],
        ovlDataIndex,
        this.getIconUrl,
        this.getOverlayOpts,
        MapUtils
      );

      if (labelShow) {
        this.rawLayerIns.refreshOverlayLabel(
          marker,
          ovlOpts.label as {
            content: string;
            direction: string;
            offset: [number, number] | Array<number>;
          }
        );
      } else {
        this.rawLayerIns.refreshOverlayLabel(marker);
      }
    }
  }

  // 返回原始图层对象
  getRawLayer() {
    return this.rawLayerIns.rawLayer;
  }
}

Layer.registerLayer('markerLayer', MarkerLayer);
Layer.registerLayer('labelMarkerLayer', LabelMarkerLayer);
Layer.registerLayer('markerClusterLayer', MarkerClusterLayer);

// MarkerLayer 类型
export type MarkerLayerIns = InstanceType<typeof MarkerLayer>;

// LabelMarkerLayer 类型
export type LabelMarkerLayerIns = InstanceType<typeof LabelMarkerLayer>;

// MarkerClusterLayer 类型
export type MarkerClusterLayerIns = InstanceType<typeof MarkerClusterLayer>;

// 所有图层类型的联合类型
export type LayerTypeIns =
  | MarkerLayerIns
  | LabelMarkerLayerIns
  | MarkerClusterLayerIns;

export type LayerTypeClass =
  | typeof MarkerLayer
  | typeof LabelMarkerLayer
  | typeof MarkerClusterLayer;

export type LayerClass = typeof Layer;

export type LayerIns = InstanceType<LayerClass>;

export { LabelMarkerLayer, MarkerClusterLayer, MarkerLayer };

export default Layer;

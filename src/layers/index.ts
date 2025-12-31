import LabelMarkerLayer from './LabelMarkerLayer';
import MarkerClusterLayer from './MarkerClusterLayer';
import MarkerLayer from './MarkerLayer';
import type {
  layerType,
  ILayer,
  LayerOpts,
  MapUtilsLayersInfo,
  overlayData,
} from '../types/index.d';
import { MapUtils, type mapUtilsIns } from '../MapUtils';

// implements ILayer 暂时不实现
class Layer<
  U extends {},
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
    //TODO 考虑是否添加注册验证
    Layer.layerClassMap.set(layerType, layerClass);
  }

  overlayList: Array<overlayData<U>>;
  // 策略模式
  rawLayerIns: LayerTypeIns;

  layerVisible: boolean = true;

  layerName: string;

  mapUtils: mapUtilsIns;

  overlayOpts: V['overlayOpts'];

  getIconUrl: () => string;

  layerType: layerType;

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

    this.overlayOpts = opts.overlayOpts;

    this.layerType = opts.layerType;

    Object.assign(this, rest);

    this.initLayer();
  }

  // 图层事件,覆盖物初始化
  initLayer() {
    this.createOverlays(this.overlayList, this.overlayOpts);
  }
  /* 
  1. 配置兼容两种marker配置? 定义公共属性名称, 根据layerType做映射
  2. Icon由外部传入
  3. marker与labelMarker灵活切换
*/
  createOverlays(
    overlayList: Array<overlayData>,
    overlayOpts?: V['overlayOpts']
  ): Array<V['ovIns']> {
    // 优先传入,当你未传递使用局部
    const singleOpts = overlayOpts ?? this.overlayOpts;

    const markerListOpts: Array<V['overlayOpts']> = overlayList.map(item => {
      const {
        overlayData: { lon, lat, extData },
      } = item;

      const ovlOpts = {
        position: [lon, lat],
        extData,
        ...singleOpts,
      };

      if (this.rawLayerIns instanceof MarkerLayer) {
        let opts: AMap.MarkerOptions = singleOpts as AMap.MarkerOptions;

        if (!item.labelShowed) {
          opts.label = undefined;
        }

        const imageUrl = this.getIconUrl.call(item);

        if (typeof ovlOpts.icon === 'string') {
          ovlOpts.icon = imageUrl;
        } else {
          (ovlOpts.icon as AMap.Icon).setImage(imageUrl);
        }
      }

      return ovlOpts;
    });

    return this.rawLayerIns.createOverlays(markerListOpts);
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
    return this.rawLayerIns.getAllOverlay();
  }

  destroy() {
    // this.mapUtils
    //TODO  逻辑待补充
    this.rawLayerIns.destroy();
  }

  reload() {
    this.rawLayerIns.reload();

    this.createOverlays(this.overlayList, this.overlayOpts);
  }

  findLayerOverlay(ovId: string) {
    if (this.rawLayerIns instanceof MarkerLayer) {
      //待删除
      this.rawLayerIns.findLayerOverlay(ovId);
    }
  }

  add(ovs: Array<V['overlayOpts']>) {
    if (this.rawLayerIns instanceof MarkerLayer) {
      //待删除
      this.rawLayerIns.add(ovs as AMap.MarkerOptions[]);
    }
  }

  remove(ovs: Array<V['ovIns']>) {
    if (this.rawLayerIns instanceof MarkerLayer) {
      //待删除
      this.rawLayerIns.remove(ovs as AMap.Marker[]);
    }
  }

  refreshOverlayIcon(overlayId: string, imageUrl: string) {
    if (this.rawLayerIns instanceof MarkerLayer) {
      const marker = this.rawLayerIns.findLayerOverlay(overlayId);

      if (!(marker instanceof AMap.Marker)) {
        //抛异常
        return MapUtils.error(`[Layer Error]: Invalid overlayId ${overlayId}`);
      }

      const ovDataItem = this.overlayList.find(item => item.id === overlayId);

      const iconImageUrl = imageUrl ?? this.getIconUrl.call(ovDataItem);

      this.rawLayerIns.refreshOverlayIcon(marker, iconImageUrl);
    }
  }

  refreshOverlayLabel(
    overlayId: string,
    labelOpts?: {
      content: string;
      direction: string;
      offset: [number, number] | Array<number>;
    }
  ) {
    if (this.rawLayerIns instanceof MarkerLayer) {
      const marker = this.rawLayerIns.findLayerOverlay(overlayId);

      if (!(marker instanceof AMap.Marker)) {
        //抛异常
        return MapUtils.error(`[Layer Error]: Invalid overlayId ${overlayId}`);
      }

      const ovDataItem = this.overlayList.find(item => item.id === overlayId);

      // 属性值转变为boolean
      ovDataItem!.labelShowed = Boolean(labelOpts);

      this.rawLayerIns.refreshOverlayLabel(marker, labelOpts);
    }
  }

  // 返回原始图层对象
  gdLayer() {
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

export { LabelMarkerLayer, MarkerClusterLayer, MarkerLayer };

export default Layer;

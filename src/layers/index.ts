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
import type { mapUtilsIns } from '../MapUtils';

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
      console.error('[LayerManager Error]: Invalid layer type or layer class');
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

  constructor(opts: LayerOpts<U, T>, mapUtils: mapUtilsIns) {
    const { layerType, layerName, ...rest } = opts;

    const OverlaysLayer = Layer.layerClassMap.get(layerType);

    if (OverlaysLayer) {
      this.rawLayerIns = new OverlaysLayer(mapUtils.map);
    } else {
      throw new Error(`[Layer Error]: Invalid layer type ${layerType}`);
    }

    this.layerName = layerName;

    this.mapUtils = mapUtils; //上层,mapUtils的实例

    this.overlayList = opts.overlayList;

    this.getIconUrl = opts.getIconUrl;

    this.overlayOpts = opts.overlayOpts;

    Object.assign(this, rest);

    this.initLayer();
  }

  // 图层事件,覆盖物初始化
  initLayer() {}

  createOverlays(
    overlayList: Array<overlayData>,
    overlayOpts?: V['overlayOpts']
  ): Array<V['ovIns']> {
    // 优先传入,当你未传递使用局部
    const singleOpts = overlayOpts ?? this.overlayOpts;

    const markerListOpts: Array<V['overlayOpts']> = overlayList.map(item => {
      const {
        overlayData: { lon, lat },
      } = item;

      const ovlOpts = {
        position: [lon, lat],
        ...singleOpts,
      };
      // 使用传入状态计算Icon
      const iconUrl = this.getIconUrl.call(item);

      return ovlOpts;
    });

    return this.rawLayerIns.createOverlays(markerListOpts);
  }

  overlayFitMap() {
    this.rawLayerIns.overlayFitMap();
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

import LabelMarkerLayer from './LabelMarkerLayer';
import MarkerClusterLayer from './MarkerClusterLayer';
import MarkerLayer from './MarkerLayer';
import { layerType } from '../types/index.d';

class Layer {
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

  // 策略模式
  layerManger: LayerTypeIns;

  layerVisible: boolean = true;

  constructor(type: layerType) {
    const OverlaysLayer = Layer.layerClassMap.get(type);

    if (OverlaysLayer) {
      this.layerManger = new OverlaysLayer();
    } else {
      throw new Error(''); //TODO 异常统一管理
    }
    // this.createOverlays();
  }

  createOverlays() {
    return this.layerManger.createOverlays();
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

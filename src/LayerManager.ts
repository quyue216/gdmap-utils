// import GdMapUtils from './gdMapUtils.js';
// import MarkerLayer from './layers/MarkerLayer.js';
// import MarkerClusterLayer from './layers/MarkerClusterLayer.js';
// import LabelMarkerLayer from './layers/LabelMarkerLayer';

/**
 * 图层管理器 - 负责图层类型与控制器类的关联和管理
 * 实现图层的注册、创建和获取功能
 */
export class LayerManager {
  // 图层类型枚举
  static LayerTypes = {
    MARKER: 'markerLayer', // 普通标记图层
    MARKER_CLUSTER: 'markerClusterLayer', // 聚合标记图层
    LABEL_MARKER: 'labelMarkerLayer', // 标签标记图层
  };

  // 图层类型与控制器类的映射关系
  static layerClassMap = new Map();

  /**
   * 注册图层类型与控制器类的关联
   * @param {string} layerType - 图层类型
   * @param {Function} layerClass - 图层控制器类
   */
  static registerLayer(layerType: string, layerClass: Function) {
    if (typeof layerType !== 'string' || typeof layerClass !== 'function') {
      console.error('[LayerManager Error]: Invalid layer type or layer class');
      return;
    }

    LayerManager.layerClassMap.set(layerType, layerClass);
    console.log(
      `[LayerManager]: Layer '${layerType}' registered with class '${layerClass.name}'`
    );
  }

  /**
   * 根据图层类型创建图层控制器实例
   * @param {string} layerType - 图层类型
   * @param {Object} options - 图层配置选项
   * @returns {Object} 图层控制器实例
   */
  createLayer(layerType: string, options: {}) {
    const LayerClass = LayerManager.layerClassMap.get(layerType);

    if (!LayerClass) {
      console.error(
        `[LayerManager Error]: Layer type '${layerType}' is not registered`
      );
      return null;
    }

    return new LayerClass(options);
  }

  /**
   * 获取图层类型对应的控制器类
   * @param {string} layerType - 图层类型
   * @returns {Function|null} 图层控制器类
   */
  getLayerClass(layerType: string) {
    return LayerManager.layerClassMap.get(layerType);
  }

  /**
   * 获取所有注册的图层类型
   * @returns {Array} 图层类型数组
   */
  getAllLayerTypes() {
    return Array.from(LayerManager.layerClassMap.keys());
  }

  /**
   * 检查图层类型是否已注册
   * @param {string} layerType - 图层类型
   * @returns {boolean} 是否已注册
   */
  isLayerRegistered(layerType: string) {
    return LayerManager.layerClassMap.has(layerType);
  }
}

// // 初始化时自动注册内置图层类型
// LayerManager.registerLayer(LayerManager.LayerTypes.MARKER, MarkerLayer);
// LayerManager.registerLayer(LayerManager.LayerTypes.MARKER_CLUSTER, MarkerClusterLayer);
// LayerManager.registerLayer(LayerManager.LayerTypes.LABEL_MARKER, LabelMarkerLayer);

export default LayerManager;

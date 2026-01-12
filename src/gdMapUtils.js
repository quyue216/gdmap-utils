import AMapLoader from '@amap/amap-jsapi-loader';
import gdHelperMixin from './gdHelper.js'; //抽取的高德mixin工具函数
import OverlayGroupManager from './layers/OverlayGroupManager.js';
import eventMixin from '../eventMixin.js';
import LayerManager from './LayerManager.js';

/**
 * 针对高德的二次封装
 * 目前高德地图使用的是 GCJ-02 坐标，如果你采集的是 WGS84 坐标或者其他，请先进行坐标转换
 */
class GdMapUtils {
  // 地图实例对象
  map = null;
  //高德AMap对象
  AMap = null;
  // 地图Ui对象
  AMapUI = null;
  // loadOpts加载的配置信息 地图配置和加载地图配置分开
  loadOpts = {};
  // 地图容器id
  id = '';
  // 地图的配置对象
  mapOpts = {};

  mapTitleLayers = {}; //图层map对象  第三方图层

  // 缓存实例集合
  static mapInstance = new Map();

  overlayGroupManagerMap = new Map(); //HACK 是否移入到OverlayGroupManager中。

  // 图层实例映射
  layerInstances = new Map();

  // 图层管理器
  layerManager = LayerManager;

  /**
   * 加载地图和初始化地图分开
   * @param {Object} options 加载高德初始化地图配置
   */
  //TODO  构造函数能够接收this.map对象
  constructor(options) {
    if (!options) {
      this.error('请传入配置对象');
    }
    // 某些API加载前必须设置秘钥
    window._AMapSecurityConfig = {
      securityJsCode: process.env.VUE_APP_GD_MAP_CODE, // 安全密钥
    };
    options.key = process.env.VUE_APP_GD_MAP_KEY;
    this.loadOpts = options;
    this.clickMapRestMarkers = options.clickMapRestMarkers ?? true;
  }

  error(msg) {
    console.error(`[AmapUtils Error]:${msg}`);
  }

  /**
   * 异步加载地图插件
   * @param {String} plugins  AMap.ToolBar
   * @returns {Promise}
   * @memberof GdMapUtils
   */
  loadPlugins(plugins) {
    return new Promise((resolve, reject) => {
      this.AMap.plugin(plugins, function (result) {
        resolve(result);
      });
    });
  }

  /**
   * 异步加载UI插件
   * @param {String} plugins overlay/AwesomeMarker
   * @return {Promise}
   * @memberof GdMapUtils
   */
  loadUIPlugins(plugins) {
    return new Promise((resolve, reject) => {
      if (!this.AMapUI) {
        reject(new Error('AMapUI is not initialized.')); // 提供错误信息
        return;
      }
      this.AMapUI.loadUI(plugins, function (result) {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to load UI plugin.')); // 处理加载失败的情况
        }
      });
    });
  }

  /**
   * 初始化地图
   * @param {String} id  DOM 的id
   * @param {Object} options Map地图配置项
   * @return {Promise}
   * @memberof GdMapUtils
   */
  initMap(id, options) {
    this.id = id;
    this.mapOpts = options;
    return new Promise((resolve, reject) => {
      // 确保每次的AMap都是合法的所以不分开创建
      AMapLoader.load(this.loadOpts)
        .then(AMap => {
          // 将 AMap 全局对象挂载到 window 上
          window.AMap = AMap;

          this.AMapUI = window.AMapUI;

          this.AMap = AMap;

          this.map = new AMap.Map(this.id, this.mapOpts); //"container"为 <div> 容器的 id

          resolve(this.map);
          // 将当前实例存储到 mapInstance 中
          GdMapUtils.mapInstance.set(id, this);

          this.bindMapClickEvent(); //初始化绑定事件
        })
        .catch(e => {
          reject(e);
          console.error(e);
          throw new Error(e);
        });
    });
  }
  /**
   * 连接到已有地图
   * @param {String} id  DOM 的id
   * @param {Object} map 已经存在的地图实例
   * @return {Promise}
   * @memberof GdMapUtils
   */
  linkToExistMap(id, gdMapIns) {
    if (!id || !('options' in gdMapIns)) {
      //HACK map上挂属性标识他为地图实例
      return this.error('请传入正确的地图id和地图实例');
    }

    this.id = id;
    // 关联地图配置
    this.mapOpts = gdMapIns.options;

    this.AMap = AMap; //HACK 异步获取AMap对象, 根据map获取当前地图AMap

    this.AMapUI = window.AMapUI; //HACK  AMapUI 是个啥

    this.map = gdMapIns; // 关联地图实例

    this.bindMapClickEvent(); //初始化绑定事件
    // 将当前实例存储到 mapInstance 中
    GdMapUtils.mapInstance.set(id, this);

    return this.map;
  }

  // 初始化绑定地图事件
  bindMapClickEvent() {
    this.map.on('click', () => {
      if (this.clickMapRestMarkers) {
        this.overlayGroupManagerMap.forEach(overlayGroup => {
          overlayGroup.resetActiveMarker(); // 清除图层上的所有覆盖物
        });
      }
    });

    // 绑定缩放时间获取当前层级
    this.map.on('zoomchange', () => {
      const zoom = this.map.getZoom(); // 获取当前缩放级别
    });
  }

  //给所有的marker绑定事件
  bindEventMarker(type, clickType, callback) {
    if (!this.getOverlayGroupManager(type)) {
      return this.error('图层不存在，请检查输入!');
    }
    this.getOverlayGroupManager(type).bindEventMarker(clickType, callback); // 绑定事件到图层管理器
  }

  //创建点位
  createMarker(type, Opts) {
    const overlayGroupManager = this.createOverlayGroupManager(Opts, type); // 关联图层管理器
    // 创建图标
    const marker = new AMap.Marker(Opts);

    // marker上地图
    overlayGroupManager.addOverlay(marker);

    return marker;
  }

  // 关联图层管理器
  createOverlayGroupManager(overlays, overlayType) {
    const overlayManager = this.getOverlayGroupManager(overlayType); //获取图层管理器

    if (overlayManager) return overlayManager; //图层已经关联了

    const overlayGroupManager = new OverlayGroupManager({
      overlays,
      overlayType,
      map: this.map,
    });

    this.overlayGroupManagerMap.set(overlayType, overlayGroupManager); //保存图层管理器

    return overlayGroupManager;
  }

  // 获取图层管理器
  getOverlayGroupManager(overlayType) {
    if (typeof overlayType !== 'string' && overlayType.length === 0) {
      return this.error('请传入图层类型');
    }

    return this.overlayGroupManagerMap.get(overlayType);
  }

  updateMarker(marker, Opts) {
    if (!marker) {
      return this.error('参数错误');
    }
    // 获取旧marker的类型
    const { type } = marker.getExtData();
    // 移除点位数据
    this.removeMarker(type, marker);
    // 更新Marker
    this.createMarker(type, Opts);
  }
  //移除某一个marker或者多个marker
  removeMarker(overlayType, overlay) {
    if (!this.overlayGroupManagerMap.has(overlayType)) {
      return this.error('图层不存在，请检查输入!');
    }

    const overlayGroupManager = this.getOverlayGroupManager(overlayType);

    overlayGroupManager.removeOverlay(overlay); // 关联图层管理器
  }

  // 清楚所有覆盖物
  removeAllOverlay() {
    //BUG 这里只能移除用overlayGroupManagerManager管理的图层
    this.overlayGroupManagerMap.forEach(overlayGroup => {
      overlayGroup.OverlayGroup.clearOverlays(); // 清除图层上的所有覆盖物
    });
  }

  // 高德地图添加覆盖物
  mapToAdd(overlay, autoFit = true) {
    this.map.add(overlay);
    // 调整到合适的视角
    // autoFit && this.map.setFitView();
  }

  // 创建海量点图层
  createMarkerCluster(data, options) {
    return new AMap.MarkerCluster(this.map, data, options);
  }

  // 创建标签图层
  createLabelLayer(options) {
    return new AMap.LabelLayer(options);
  }

  /**
   * 通过图层类型创建图层
   * @param {string} layerType - 图层类型
   * @param {Object} options - 图层配置选项
   * @returns {Object} 图层控制器实例
   */
  createLayer(layerType, options) {
    // 使用图层管理器创建图层控制器实例
    const layerController = this.layerManager.createLayer(layerType, options);

    if (layerController) {
      // 存储图层实例
      this.layerInstances.set(
        options?.config?.name || layerType,
        layerController
      );

      // 初始化创建图层
      layerController.createLayer(this).catch(err => {
        console.error(
          `[GdMapUtils Error]: Failed to create layer '${layerType}':`,
          err
        );
      });
    }

    return layerController;
  }

  /**
   * 获取指定名称的图层实例
   * @param {string} layerName - 图层名称
   * @returns {Object|null} 图层控制器实例
   */
  getLayer(layerName) {
    return this.layerInstances.get(layerName);
  }

  /**
   * 移除指定名称的图层
   * @param {string} layerName - 图层名称
   * @returns {boolean} 是否移除成功
   */
  removeLayer(layerName) {
    const layerController = this.layerInstances.get(layerName);

    if (layerController) {
      // 隐藏图层
      if (typeof layerController.hideLayer === 'function') {
        layerController.hideLayer();
      }

      // 从映射中移除
      this.layerInstances.delete(layerName);
      return true;
    }

    return false;
  }

  /**
   * 获取所有图层实例
   * @returns {Array} 图层控制器实例数组
   */
  getAllLayers() {
    return Array.from(this.layerInstances.values());
  }

  /**
   * 显示指定名称的图层
   * @param {string} layerName - 图层名称
   * @returns {boolean} 是否显示成功
   */
  showLayer(layerName) {
    const layerController = this.layerInstances.get(layerName);

    if (layerController && typeof layerController.showLayer === 'function') {
      layerController.showLayer();
      return true;
    }

    return false;
  }

  /**
   * 隐藏指定名称的图层
   * @param {string} layerName - 图层名称
   * @returns {boolean} 是否隐藏成功
   */
  hideLayer(layerName) {
    const layerController = this.layerInstances.get(layerName);

    if (layerController && typeof layerController.hideLayer === 'function') {
      layerController.hideLayer();
      return true;
    }

    return false;
  }
}
// 加载工具类方法到gdMapUtils中
Object.assign(GdMapUtils.prototype, {
  ...eventMixin,
  ...gdHelperMixin,
});

export default GdMapUtils;

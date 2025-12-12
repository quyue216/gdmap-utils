// import useEnvSanStore from "@/store/modules/envSan.js";
import GdMapUtils from '@/utils/gdMap/gdMapUtils.js';

/*
CollectionPointLayerController
*/
// 海量点图层渲染封装
export default class MarkerClusterLayer {
  dataList = []; // 数据列表

  // 去掉私有属性标识
  layerInstance = null; // 图层实例

  // 去掉私有属性标识
  isLayerCreated = false; // 图层是否已创建

  activeNames = []; // 存储激活图层显示name
  /**
   * 经纬度坐标，用来描述地图上的一个点位置
   * @param {Object} config 图层的config
   * @param {Function} createOverlay  创建marker的方法
   * @param {Function} noWrap  requestCallback  拉去marker请求数据并按规定格式返回
   * @param {Boolean} detectingPosition 是否检测位置变化
   */
  constructor({ config, createOverlay, requestCallback }) {
    this.config = config ?? {}; //保存图层配置

    this.createOverlay = createOverlay;

    this.requestCallback = requestCallback;

    this.activeNames = [...(this?.config?.extraActiveName ?? []), this.config.name]; //图层额外的激活数组
  }

  // 获取地图工具类实例
  getGdMapUtilsIns(id = 'gisMap') {
    return GdMapUtils.mapInstance.get(id);
  }

  // 创建图层
  async createLayer(gdMapUtils) {
    // 获取数据
    this.dataList = await this.requestCallback();

    const { dataList, config } = this; //保存数据

    if (!this.shouldCreationLayer(config.name)) return; //避免网络时间过长用户切换到切tab

    // 创建海量点渲染
    this.layerInstance = gdMapUtils.createMarkerCluster(dataList, {
      gridSize: 80,
      _renderClusterMarker(context) {
        // 绘制聚合点时调用
        const count = dataList.length;
        const factor = Math.pow(context.count / count, 1 / 18);
        const div = document.createElement('div');
        const Hue = 180 - factor * 180;
        const bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
        const fontColor = 'hsla(' + Hue + ',100%,20%,1)';
        const borderColor = 'hsla(' + Hue + ',100%,40%,1)';
        const shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
        div.style.backgroundColor = bgColor;
        const size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
        div.style.width = div.style.height = size + 'px';
        div.style.border = 'solid 1px ' + borderColor;
        div.style.borderRadius = size / 2 + 'px';
        div.style.boxShadow = '0 0 1px ' + shadowColor;
        div.innerHTML = context.count;
        div.style.lineHeight = size + 'px';
        div.style.color = fontColor;
        div.style.fontSize = '14px';
        div.style.textAlign = 'center';
        const Pixel = gdMapUtils.Size(-size / 2, -size / 2);
        context.marker.setOffset(Pixel);
        context.marker.setContent(div);
      }, // 自定义聚合点样式
      _renderMarker: (context) => {
        // 外部控制单个marker的样式
        this.createOverlay({ context, gdMapUtils, config }); // 创建marker
      },
    });

    // 绑定监听控制label显示
    this.layerInstance.on('click', (e) => {
      const { lnglat, marker, clusterData } = e;

      if (clusterData.length > 1) {
        //点击集合样式地图放大一级
        gdMapUtils.setCenter(lnglat, false);
        gdMapUtils.map.zoomIn(); // 放大地图
      }

      if (marker instanceof AMap.Marker) {
        // marker?.dom?.querySelector('.sydw-label').classList.remove('display-none');
        gdMapUtils.trigger('pointerClick', marker, e, gdMapUtils.map, this.config);
      }
    });

    this.isLayerCreated = true; // 设置图层创建状态为true
  }

  // 显示图层
  showLayer(v) {
    if (this.layerInstance && this.dataList.length && this.shouldCreationLayer(v)) {
      this.layerInstance.setData(this.dataList);
    }
  }
  // 判断是否跳过图层创建
  shouldCreationLayer(activeName) {
    return this.activeNames.includes(activeName);
  }

  // 隐藏图层
  hideLayer() {
    if (this.layerInstance && this.dataList.length) {
      this.layerInstance.setData([]);
    }
  }

  // 监听地图类型变化
  handleMapTypeChange(newVal, oldVal) {
    let gdMapUtils = this.getGdMapUtilsIns(); // 获取地图实例

    if (!gdMapUtils) return; // 如果地图实例不存在，则不执行后续操作

    if (this.shouldCreationLayer(newVal)) {
      if (this.isLayerCreated) {
        this.showLayer(newVal); // 显示图层
      } else {
        this.createLayer(gdMapUtils); // 创建图层
      }
    } else {
      this.hideLayer(); // 隐藏图层
    }
  }

  get dataOfLayer() {
    return this.dataList;
  }
}

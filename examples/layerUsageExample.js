import GdMapUtils from '../src/gdMapUtils.js';
import { LayerManager } from '../src/LayerManager.js';

// 示例：如何使用图层管理器创建和管理图层

// 1. 初始化地图工具实例
const mapUtils = new GdMapUtils({
  key: 'your_amap_key',
  version: '2.0',
  plugins: ['AMap.ToolBar', 'AMap.Scale']
});

// 2. 初始化地图
async function initMap() {
  try {
    await mapUtils.initMap('map-container', {
      zoom: 12,
      center: [116.397428, 39.90923]
    });
    
    // 3. 创建普通标记图层
    const markerLayer = mapUtils.createLayer(LayerManager.LayerTypes.MARKER, {
      config: {
        name: 'poi-markers',
        className: 'poi-marker',
        layerOptions: { /* 图层配置 */ }
      },
      // 创建覆盖物的方法
      createOverlay: (gdMapUtils, config, data) => {
        return new gdMapUtils.AMap.Marker({
          position: [data.lng, data.lat],
          title: data.name,
          extData: { type: config.className, data: data }
        });
      },
      // 请求数据的方法
      requestCallback: async () => {
        // 模拟异步请求数据
        return [
          { id: 1, name: '位置1', lng: 116.397428, lat: 39.90923 },
          { id: 2, name: '位置2', lng: 116.407428, lat: 39.91923 },
          { id: 3, name: '位置3', lng: 116.417428, lat: 39.92923 }
        ];
      }
    });
    
    // 4. 创建聚合标记图层
    const markerClusterLayer = mapUtils.createLayer(LayerManager.LayerTypes.MARKER_CLUSTER, {
      config: {
        name: 'cluster-markers',
        className: 'cluster-marker'
      },
      // 创建覆盖物的方法
      createOverlay: (gdMapUtils, config, data) => {
        return new gdMapUtils.AMap.Marker({
          position: [data.lng, data.lat],
          title: data.name,
          extData: { type: config.className, data: data }
        });
      },
      // 请求数据的方法
      requestCallback: async () => {
        // 模拟异步请求数据
        const data = [];
        for (let i = 0; i < 100; i++) {
          data.push({
            id: i,
            name: `聚合点${i}`,
            lng: 116.397428 + Math.random() * 0.1,
            lat: 39.90923 + Math.random() * 0.1
          });
        }
        return data;
      }
    });
    
    // 5. 创建标签标记图层
    const labelMarkerLayer = mapUtils.createLayer(LayerManager.LayerTypes.LABEL_MARKER, {
      config: {
        name: 'label-markers',
        className: 'label-marker',
        layerOptions: { zIndex: 1000 }
      },
      // 创建覆盖物的方法
      createOverlay: (gdMapUtils, config, data) => {
        return new gdMapUtils.AMap.LabelMarker({
          position: [data.lng, data.lat],
          name: data.name,
          label: {
            content: data.name,
            direction: 'top',
            offset: [0, -25]
          },
          extData: { type: config.className, data: data }
        });
      },
      // 请求数据的方法
      requestCallback: async () => {
        // 模拟异步请求数据
        return [
          { id: 1, name: '标签点1', lng: 116.387428, lat: 39.90923 },
          { id: 2, name: '标签点2', lng: 116.397428, lat: 39.89923 },
          { id: 3, name: '标签点3', lng: 116.407428, lat: 39.90923 }
        ];
      }
    });
    
    // 6. 图层管理示例
    
    // 获取图层
    const layer1 = mapUtils.getLayer('poi-markers');
    console.log('获取到的图层:', layer1);
    
    // 获取所有图层
    const allLayers = mapUtils.getAllLayers();
    console.log('所有图层:', allLayers);
    
    // 显示/隐藏图层
    // mapUtils.hideLayer('poi-markers');
    // mapUtils.showLayer('poi-markers');
    
    // 移除图层
    // mapUtils.removeLayer('poi-markers');
    
  } catch (error) {
    console.error('地图初始化失败:', error);
  }
}

// 执行初始化
initMap();

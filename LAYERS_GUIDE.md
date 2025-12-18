# 图层与类关联指南

本文档介绍了mapUtils项目中如何将图层与类进行关联，以及如何使用新的图层管理机制。

## 核心概念

在mapUtils中，图层通过以下方式与类关联：

1. **图层控制器类**：每种图层类型都有对应的控制器类，负责图层的创建、管理和渲染
2. **图层管理器**：统一管理所有图层类型与控制器类的映射关系
3. **图层注册机制**：将图层类型与控制器类注册到图层管理器中
4. **图层创建API**：通过图层类型创建对应的图层实例

## 图层类型与控制器类的对应关系

| 图层类型 | 控制器类 | 功能描述 |
|---------|---------|---------|
| MARKER | MarkerLayer | 普通标记图层，用于显示单个标记点 |
| MARKER_CLUSTER | MarkerClusterLayer | 聚合标记图层，用于显示大量标记点的聚合效果 |
| LABEL_MARKER | LabelMarkerLayer | 标签标记图层，用于显示带有文本标签的标记点 |

## 图层管理器 (LayerManager)

图层管理器是实现图层与类关联的核心组件，提供了以下功能：

### 1. 注册图层类型

```javascript
import { LayerManager } from './LayerManager';
import CustomLayer from './layers/CustomLayer';

// 注册自定义图层类型
LayerManager.registerLayer('customLayer', CustomLayer);
```

### 2. 创建图层实例

```javascript
// 通过图层管理器创建图层实例
const layerController = LayerManager.createLayer('customLayer', options);

// 或者通过GdMapUtils创建
const layerController = mapUtils.createLayer('customLayer', options);
```

### 3. 获取图层类

```javascript
// 获取图层类型对应的控制器类
const LayerClass = LayerManager.getLayerClass('customLayer');
```

### 4. 其他功能

```javascript
// 获取所有注册的图层类型
const layerTypes = LayerManager.getAllLayerTypes();

// 检查图层类型是否已注册
const isRegistered = LayerManager.isLayerRegistered('customLayer');
```

## 图层控制器类的结构

每个图层控制器类都应该遵循以下结构：

```javascript
export default class CustomLayer {
  // 图层配置
  config = {};
  
  // 图层实例
  layerInstance = null;
  
  // 数据列表
  dataList = [];
  
  // 图层是否已创建
  isLayerCreated = false;
  
  // 构造函数
  constructor(options) {
    this.config = options.config || {};
    this.createOverlay = options.createOverlay;
    this.requestCallback = options.requestCallback;
  }
  
  // 创建图层的核心方法
  async createLayer(gdMapUtils) {
    // 获取数据
    this.dataList = await this.requestCallback();
    
    // 创建图层实例
    this.layerInstance = gdMapUtils.createSomeLayer(this.config.layerOptions);
    
    // 创建覆盖物
    const overlays = this.dataList.map(item => {
      return this.createOverlay(gdMapUtils, this.config, item);
    });
    
    // 添加覆盖物到图层
    this.layerInstance.add(overlays);
    
    this.isLayerCreated = true;
  }
  
  // 显示图层
  showLayer() {
    if (this.layerInstance) {
      this.layerInstance.show();
    }
  }
  
  // 隐藏图层
  hideLayer() {
    if (this.layerInstance) {
      this.layerInstance.hide();
    }
  }
}
```

## 使用示例

### 1. 创建普通标记图层

```javascript
const markerLayer = mapUtils.createLayer('markerLayer', {
  config: {
    name: 'poi-markers',
    className: 'poi-marker'
  },
  createOverlay: (gdMapUtils, config, data) => {
    return new gdMapUtils.AMap.Marker({
      position: [data.lng, data.lat],
      title: data.name,
      extData: { type: config.className, data: data }
    });
  },
  requestCallback: async () => {
    // 请求数据
    return [
      { id: 1, name: '位置1', lng: 116.397428, lat: 39.90923 },
      // ...更多数据
    ];
  }
});
```

### 2. 创建聚合标记图层

```javascript
const markerClusterLayer = mapUtils.createLayer('markerClusterLayer', {
  config: {
    name: 'cluster-markers',
    className: 'cluster-marker'
  },
  createOverlay: (gdMapUtils, config, data) => {
    return new gdMapUtils.AMap.Marker({
      position: [data.lng, data.lat],
      title: data.name,
      extData: { type: config.className, data: data }
    });
  },
  requestCallback: async () => {
    // 请求大量数据
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        id: i, name: `聚合点${i}`,
        lng: 116.397428 + Math.random() * 0.1,
        lat: 39.90923 + Math.random() * 0.1
      });
    }
    return data;
  }
});
```

### 3. 创建标签标记图层

```javascript
const labelMarkerLayer = mapUtils.createLayer('labelMarkerLayer', {
  config: {
    name: 'label-markers',
    className: 'label-marker',
    layerOptions: { zIndex: 1000 }
  },
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
  requestCallback: async () => {
    // 请求数据
    return [
      { id: 1, name: '标签点1', lng: 116.387428, lat: 39.90923 },
      // ...更多数据
    ];
  }
});
```

## 图层管理API

### 获取图层实例

```javascript
// 通过名称获取图层实例
const layer = mapUtils.getLayer('poi-markers');
```

### 显示/隐藏图层

```javascript
// 显示图层
mapUtils.showLayer('poi-markers');

// 隐藏图层
mapUtils.hideLayer('poi-markers');
```

### 移除图层

```javascript
// 移除图层
mapUtils.removeLayer('poi-markers');
```

### 获取所有图层

```javascript
// 获取所有图层实例
const allLayers = mapUtils.getAllLayers();
```

## 自定义图层

您可以通过以下步骤创建自定义图层：

1. 创建图层控制器类
2. 注册图层类型
3. 使用图层

```javascript
// 1. 创建自定义图层控制器类
class CustomLayer {
  // 实现图层控制器接口
  async createLayer(gdMapUtils) {
    // 自定义图层创建逻辑
  }
  
  showLayer() {
    // 自定义显示逻辑
  }
  
  hideLayer() {
    // 自定义隐藏逻辑
  }
}

// 2. 注册自定义图层类型
LayerManager.registerLayer('customLayer', CustomLayer);

// 3. 使用自定义图层
const customLayer = mapUtils.createLayer('customLayer', options);
```

## 总结

通过以上机制，mapUtils实现了图层与类的清晰关联，提供了统一的图层管理接口，使得图层的创建、管理和扩展更加灵活和高效。

## 最佳实践

1. **使用标准图层类型**：优先使用预定义的图层类型（MARKER、MARKER_CLUSTER、LABEL_MARKER）
2. **遵循统一接口**：自定义图层控制器类应遵循与内置图层相同的接口
3. **合理命名图层**：为图层指定有意义的名称，便于后续管理
4. **模块化设计**：将不同功能的图层分离为独立的控制器类
5. **使用图层管理器**：始终通过图层管理器创建和管理图层

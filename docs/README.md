# gdmap-utils

公司许多业务与地图相关 （地图厂商为高德）创建工具函数统一地图使用风格，代码一致性，在大屏场景下，地图展示

统一 简化使用 快速 代码复用 风格统一

起因，为什么要写
`gdMap-utils`基于业务提炼出工具函数，将`LabelMarker, Marker ClusterMarker`以图层为单位进行管理,

1. 高德地图AMap常用函数：统一管理、调用。
2. 常用覆盖物统一管理

# 特性

# 示例

 工具库使用示例参考`examples`目录,` new HtmlWebpackPlugin`中`template`指定启动页面

# install

```
$ yarn add gdmap-utils
$ npm install gdmap-utils
```

# API

## initMapSource

高德地图环境加载`initMapSource(Opts: loaderOpts)`, 使用示例如下:

```javascript
 type loaderOpts = {
        key: string;
        version: string;
        plugins?: string[] | undefined;
        AMapUI?: {
            version?: string | undefined;
            plugins?: string[] | undefined;
        } | undefined;
        Loca?: {
            version?: string | undefined;
        } | undefined;
    }
   const loaderOpts = {
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.MapType', 'AMap.MoveAnimation'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        key: 'xxxxxx',
      };

      initMapSource(loaderOpts)
```

## createMapUtils

​	`createMapUtils(opts,loaderOPts)`为`MapUtils`的工厂函数, `opts`配置对象在高德`MapOptions`基础上扩展`mapIns,mountSelector`两个属性。
 `mapIns`为**高德地图实例对象**，地图已存在将其包装成`MapUtils`实例并扩展相关功能。 `mountSelector`为DOM选择器，地图不存在创建`MapUtils`实例。
 `loaderOpts`加载器配置用于配置高德地图相关依赖。 文档参照(`loaderOpts`)
[mapOptions配置对象文档](https://lbs.amap.com/api/javascript-api-v2/documentation#map)

```javascript
interface MapUtilsCreateOpts extends MapOptions {
  mountSelector: string;
}

interface MapUtilsUseExistingOpts extends MapOptions {
  mapIns: mapIns;
}

type MapUtilsOpts = {
  MapUtilsUseExistingOpts: MapUtilsUseExistingOpts;
  MapUtilsCreateOpts: MapUtilsCreateOpts;
};

// ts函数声明
function createMapUtils(
  opts: MapUtilsOpts[keyof MapUtilsOpts],
  loaderOPts?: loaderOpts  //对象结构参照loaderOpts
);

```

## MapUtils
  `MapUtils`实例用于管理图层，`mapUtils`实例对象请通过`createMapUtils`创建，它的主要功能: 图层管理,地图实例常用方法包装,地图常用`AMap`方法包装。

### MapUtils静态方法

#### createAMapMarker
`createAMapMarker`为`new AMap.Marker`函数的包装用于创建Marker覆盖物，函数类型声明如下: 

```javascript
createAMapMarker(options: AMap.MarkerOptions): AMap.Marker
```

#### createIcon
`createIcon`为`new AMap.Icon`函数的包装用于创建图标对象，函数类型声明如下:

```javascript
createIcon(opts: {
  size: [number, number];        // 图标尺寸 [width, height]
  image: string;                 // 图片URL地址
  imageSize: [number, number];   // 图片大小 [width, height]
  imageOffset: [number, number]; // 取图偏移量 [x, y]
}): AMap.Icon
```

#### Size
`Size`为`new AMap.Size`函数的包装用于创建地物对象的像素尺寸，函数类型声明如下:

```javascript
Size(width: number, height: number): AMap.Size
```

#### Pixel
`Pixel`为`new AMap.Pixel`函数的包装用于创建像素坐标（确定地图上的一个像素点），函数类型声明如下:

```javascript
Pixel(x: number, y: number): AMap.Pixel
```

#### LngLat
`LngLat`为`new AMap.LngLat`函数的包装用于创建经纬度坐标（描述地图上的一个点位置），函数类型声明如下:

```javascript
LngLat(lng: number, lat: number, noWrap?: boolean): AMap.LngLat
```

#### createAMapInfoWindow
`createAMapInfoWindow`为`new AMap.InfoWindow`函数的包装用于创建信息窗体，默认`isCustom=true`、`closeWhenClickMap=true`，函数类型声明如下:

```javascript
createAMapInfoWindow(opts: AMap.InfoWindowOptions): AMap.InfoWindow
```

#### createAMapPolyline
`createAMapPolyline`为`new AMap.Polyline`函数的包装用于创建折线，默认配置`showDir=true`、`lineJoin='round'`、`strokeColor='#28F'`、`strokeOpacity=1`、`strokeWeight=6`，函数类型声明如下:

```javascript
createAMapPolyline(options: AMap.PolylineOptions): AMap.Polyline
```

#### loadPlugins
`loadPlugins`用于动态加载高德地图插件，函数类型声明如下:

```javascript
loadPlugins(plugins: string | string[]): Promise<void>
```

使用示例:

```javascript
await MapUtils.loadPlugins(['AMap.MapType', 'AMap.MoveAnimation']);
```

### MapUtils图层管理

#### seZoomAndCenter
`seZoomAndCenter`用于将地图视野切换成指定的状态，函数声明如下：

```javascript
seZoomAndCenter(opts: {
  zoom: number;                           // 目标缩放级别
  center: AMap.LngLat | [number, number]; // 目标中心点
  immediately?: boolean;                  // 是否立即跳转，默认平滑过渡
  duration?: number;                      // 过渡动画时长（毫秒）
}): void
```

使用示例：

```javascript
// 平滑跳转到指定位置和缩放级别
mapUtils.seZoomAndCenter({
  zoom: 14,
  center: [116.397428, 39.90923],
});

// 立即跳转到指定位置
mapUtils.seZoomAndCenter({
  zoom: 16,
  center: [116.397428, 39.90923],
  immediately: true,
});
```

#### clearInfoWindow
`clearInfoWindow`用于将`new AMap.InfoWindow`创建的信息窗体关闭，函数声明如下：

```javascript
clearInfoWindow(): void
```

使用示例：

```javascript
// 关闭地图上所有信息窗体
mapUtils.clearInfoWindow();
```

#### setFitView
`setFitView`用于根据地图覆盖物分布情况，自动缩放地图到合适视野级别，函数声明如下：

```javascript
setFitView(
  overlays?: Array<any>,    // 覆盖物数组，缺省为全部覆盖物
  immediately?: boolean,    // 是否立即过渡
  avoid?: Array<number>,    // 四周边距 [上, 下, 左, 右]
  maxZoom?: number          // 最大地图zoom级别
): void
```

使用示例：

```javascript
// 自动调整视野以显示所有覆盖物
mapUtils.setFitView();

// 调整视野显示指定覆盖物，并设置最大缩放级别
mapUtils.setFitView([marker1, marker2], false, [60, 60, 60, 60], 16);
```

#### bindMapClickEvent
`bindMapClickEvent`用于为地图实例绑定事件，函数声明如下：

```javascript
bindMapClickEvent(
  type: AMap.EventType,     // 地图事件类型
  fn: (e: any) => void,     // 回调函数
  context?: any,            // 事件上下文，缺省为当前实例
  once?: boolean            // 事件是否执行一次
): void
```

使用示例：

```javascript
// 绑定地图点击事件
mapUtils.bindMapClickEvent('click', (e) => {
  console.log('点击位置：', e.lnglat);
});

// 绑定一次性的地图移动事件
mapUtils.bindMapClickEvent('moveend', () => {
  console.log('地图移动结束');
}, null, true);
```

## baseMarkerLayer图层

`baseMarkerLayer`支持创建两种类型的图层`type MarkerLayerBaseType = 'markerLayer' | 'labelMarkerLayer';`，他们分别用于管理`Marker/LabelMarker`覆盖物。

创建图层
```javascript
const markerLayer = mapUtils.createBaseMarkerLayer({
  layerType: 'markerLayer',
  layerName: 'markerLayer',
  getIconUrl(item) {
    return 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';
  },
  getOverlayOpts(item, index, MapUtils) {
    return {
      anchor: 'bottom-center',
      clickable: true,
      zooms: [2, 20],
      zIndex: 1000,
         label: {
        content: `<div class="labelTitle">${item.overlayData.title}</div>`,
        offset: MapUtils.Pixel(0, -5),
        direction: 'top',
      },
    };
  },
  overlayList: data.slice(0, 10).map(item => {
    return {
      overlayData: {
        lon: item.jd,
        lat: item.wd,
        title: item.sydmc,
        id: item.id,
        extData: item,
      },
      id: item.id, //覆盖物id 唯一
      labelShowed: true,
    };
  }),
});
```
注意[`AMap.LabelsLayerOptions`](https://lbs.amap.com/api/javascript-api-v2/documentation#labelslayer)在layerType为`labelMarkerLayer`时必传，LayerOpts属性具体介绍参考属性文档。`overlayList`基本格式如上,它的格式必须符合规范否则产生error


### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| layerType | `'markerLayer'\|'labelMarkerLayer'`(字符串) | `undefind` | 图层类型分别管理两类覆盖物类型`marker, labelMarker` |
| layerName | `string` | `undefind` | 图层的唯一标识名称，创建时传入，用于区分不同图层（不可重复）|
| layerVisible | `boolean` | `true` | 图层的显示状态，`true` 为显示在地图上，`false` 为隐藏|
| mapUtils | `MapUtils` | `mapUtils` | 关联的`MapUtils` 实例，用于操作地图和图层管理 |
| getIconUrl | `(item: OverlayData) => string` | `undefined` | 获取图标 URL 的回调函数，根据覆盖物数据返回对应的图标地址 （根据状态计算图标） |
| rawLayerIns | `MarkerLayer` | `LabelMarkerLayer` | 原始高德图层实例的包装对象。`markerLayer` 类型时为 `MarkerLayer`（内部使用`AMap.OverlayGroup`），`labelMarkerLayer` 类型时为 `LabelMarkerLayer`（内部使用`AMap.LabelsLayer`）|
| overlayList | `Array<OverlayData<U>>`([详细](https://github.com/quyue216/gdmap-utils/blob/master/src/types/BaseMarkerLayer.d.ts)) | [] | 点位信息对象: 位置信息，标题，扩展数据，收运重量。点位状态对象 标题是否显示，图标是否激活|
| getOverLayOpts| `getOverlayOpts: (item: OverlayData<U>,index: number,MapUtils: MapUtilsConstructor) => ['overlayOpts']`| `undefined` |函数返回原始高德覆盖物配置对象,`layerType`为 `MarkerLayer`（['overlayOpts']为[`AMap.MarkerOptions`](https://lbs.amap.com/api/javascript-api-v2/documentation#marker)）, `layerType`为`labelMarkerLayer`(['overlayOpts']为)[`AMap.labelMarkerLayer`](https://lbs.amap.com/api/javascript-api-v2/documentation#labelmarker)|

### 方法

| 方法名 | 说明 |
|--------|------|
| `createOverlays` | 创建覆盖物，将配置列表转换为高德覆盖物实例并添加到图层 |
| `add` | 向图层中添加新的覆盖物数据，会自动创建对应的覆盖物实例 |
| `remove` | 从图层中移除指定的覆盖物，支持传入覆盖物实例数组或 ID 数组 |
| `hide` | 隐藏当前图层及其所有覆盖物 |
| `show` | 显示当前图层及其所有覆盖物 |
| `getAllOverlay` | 获取图层中所有的覆盖物实例数组（返回浅拷贝） |
| `clearAllOverlay` | 清空图层中的所有覆盖物，同时清空 `overlayList` 数据 |
| `reload` | 重新加载图层，先清空所有覆盖物，然后根据 `overlayList` 重新创建 |
| `overlayFitMap` | 根据图层中的所有覆盖物，自动调整地图视野以适应所有覆盖物 |
| `findLayerOverlay` | 根据覆盖物 ID 查找对应的覆盖物实例 |
| `bindEventOverlays` | 为图层中的所有覆盖物绑定指定类型的事件 |
| `refreshOverlayIcon` | 根据 `getIconUrl` 重新计算并刷新指定覆盖物的图标 |
| `refreshOverlayLabel` | 根据 `getOverlayOpts` 重新计算并刷新指定覆盖物的标签/文本 |
| `getRawLayer` | 获取高德地图的原始图层实例（`AMap.OverlayGroup` 或 `AMap.LabelsLayer`） |
| `destroy` | 销毁图层，从 `MapUtils` 中移除并清空所有覆盖物 |

## clusterMarkerLayer图层
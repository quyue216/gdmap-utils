# gdmap-utils

公司许多业务与地图相关 （地图厂商为高德）创建工具函数统一地图使用风格，代码一致性，在大屏场景下，地图展示

统一 简化使用 快速 代码复用 风格统一

起因，为什么要写
`gdMap-utils`基于业务提炼出工具函数，将`LabelMarker, Marker ClusterMarker`以图层为单位进行管理,

1. 高德地图AMap常用函数：统一管理、调用。
2. 常用覆盖物统一管理

# 特性

# 示例

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
### MapUtils实例方法

`MapUtils`实例方法包装`map`实例常用的工具函数

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

`baseMarkerLayer`用于管理`Marker/LabelMarker`


## clusterMarkerLayer图层

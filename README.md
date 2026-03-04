# gdmap-utils
为什么写`gdmap-utils`
1. 公司许多业务与地图相关 （地图厂商为高德）创建工具函数统一地图使用风格提高代码一致性，
2. 公司大屏业务深度依赖地图能力（基于高德地图），涉及车辆监控、站点管理、设施分布等多类场景，地图覆盖物类型繁多（车辆、中转站、公厕、压缩站等）第一版开发采用分散式实现，为每种覆盖物独立编写控制逻辑（显隐切换、标签管理、生命周期控制）。随着覆盖物类型增加，代码出现高度重复——同类逻辑分散在数十个方法中，导致："维护成本高,一致性难保障,新增效率低"。工具库引入统一的图层管理来解决上述问题
   
# 特性

1. 将 `AMap.Marker`, `AMap.LabelMarker`, `AMap.MarkerCluster` 统一封装为图层，支持图层显示/隐藏、覆盖物增删查改、事件绑定等功能
2. 数据驱动的覆盖物更新：图标和标签与数据属性关联，属性发生变化调用 `refreshOverlayIcon` / `refreshOverlayLabel` 即可实现刷新
3. 灵活的初始化方式：支持创建新地图实例或包装已有实例
4. 工具函数集成：封装常用的 Map 实例方法和 AMap 静态工具方法(自己可以根据需要自定义形参默认值,当然得自己手动改)
5. TypeScript 全支持：完整的类型定义和泛型支持

# 示例

📖 使用示例请参考 `examples` 目录，在 `HtmlWebpackPlugin` 配置中通过 `template` 指定启动页面

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
 `loaderOpts`加载器配置用于配置高德地图相关依赖。文档参照 [`loaderOpts`](#initmapsource)

[mapOptions 配置对象文档](https://lbs.amap.com/api/javascript-api-v2/documentation#map)

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
  opts: MapUtilsOpts[keyof MapUtilsOpts],//类型等于 MapUtilsCreateOpts  | MapUtilsUseExistingOpts
  loaderOPts?: loaderOpts  //对象结构参照loaderOpts
);

```

## MapUtils
  `MapUtils`实例用于管理图层，`mapUtils`实例对象请通过`createMapUtils`创建，它的主要功能: “图层管理、地图实例常用方法包装、地图常用`AMap`方法包装”。

### MapUtils静态方法

#### createAMapMarker
`createAMapMarker`为`AMap.Marker`函数的包装用于创建Marker覆盖物，函数类型声明如下: 

```javascript
createAMapMarker(options: AMap.MarkerOptions): AMap.Marker
```

#### createIcon
`createIcon`为`AMap.Icon`函数的包装用于创建图标对象，函数类型声明如下:

```javascript
createIcon(opts: {
  size: [number, number];        // 图标尺寸 [width, height]
  image: string;                 // 图片URL地址
  imageSize: [number, number];   // 图片大小 [width, height]
  imageOffset: [number, number]; // 取图偏移量 [x, y]
}): AMap.Icon
```

#### Size
`Size`为`AMap.Size`函数的包装用于创建像素尺寸，函数类型声明如下:

```javascript
Size(width: number, height: number): AMap.Size
```

#### Pixel
`Pixel`为`AMap.Pixel`函数的包装用于创建像素坐标（确定地图上的一个像素点），函数类型声明如下:

```javascript
Pixel(x: number, y: number): AMap.Pixel
```

#### LngLat
`LngLat`为`AMap.LngLat`函数的包装用于创建经纬度坐标（描述地图上的一个点位置），函数类型声明如下:

```javascript
LngLat(lng: number, lat: number, noWrap?: boolean): AMap.LngLat
```

#### createAMapInfoWindow
`createAMapInfoWindow`为`AMap.InfoWindow`函数的包装用于创建信息窗体，默认`isCustom=true`、`closeWhenClickMap=true`，函数类型声明如下:

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
  zoom: number;                           // 目标缩放级别, zoom不传参默认使用当前层级
  center: AMap.LngLat | [number, number]; // 目标中心点, center不传参默认使用当前中心位置
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
`clearInfoWindow`用于将`AMap.InfoWindow`创建的信息窗体关闭，函数声明如下：

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
interface LayerOpts<
  U = {},
  T extends MarkerLayerBaseType = 'markerLayer',
  V = BaseMarkerLayerInfo[T],
> {
  layerType: T;
  layerName: string;
  overlayList: Array<OverlayData<U>>;
  getIconUrl: (item: OverlayData<U>) => string; //overlayList中优先级更高
  getOverlayOpts: (
    item: OverlayData<U>,
    index: number,
    MapUtils: MapUtilsConstructor
  ) => V['overlayOpts']; //动态生成覆盖物配置
  overlayLayer?: AMap.LabelsLayerOptions; //当你使用labelMarker时传递
}

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
      labelShowed: true,  //label是否显示
      overlaySelected: false; // 当前marker是否被选中
    };
  }),
});
```
注意:overlayLayer类型为[`AMap.LabelsLayerOptions`](https://lbs.amap.com/api/javascript-api-v2/documentation#labelslayer)在layerType为`labelMarkerLayer`时必传，LayerOpts 属性具体介绍参考[下方属性表格](###属性)。`overlayList`基本格式如上,它的格式必须符合**规范**否则产生error。


### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| layerType | `markerLayer`|'' | 图层类型分别管理两类覆盖物类型`marker, labelMarker` |
| layerName | `string` | `undefined` | 图层的唯一标识名称，创建时传入，用于区分不同图层（不可重复）|
| layerVisible | `boolean` | `true` | 图层的显示状态，`true` 为显示在地图上，`false` 为隐藏|
| mapUtils | `MapUtils` | `mapUtils` | 关联的`MapUtils` 实例，用于操作地图和图层管理 |
| getIconUrl | `(item: OverlayData) => string` | `undefined` | 获取图标 URL 的回调函数，根据覆盖物数据返回对应的图标地址 （根据状态计算图标） |
| rawLayerIns | `MarkerLayer` | `LabelMarkerLayer` | 原始高德图层实例的包装对象。`markerLayer` 类型时为 `MarkerLayer`（内部使用`AMap.OverlayGroup`），`labelMarkerLayer` 类型时为 `LabelMarkerLayer`（内部使用`AMap.LabelsLayer`）|
| overlayList | `Array<OverlayData<U>>`（[类型定义](https://github.com/quyue216/gdmap-utils/blob/master/src/types/BaseMarkerLayer.d.ts)） | `[]` | 覆盖物数据数组，包含点位信息（位置、标题、扩展数据等）和状态信息（标题显隐、图标激活状态），格式须符合规范 |
| getOverLayOpts| `getOverlayOpts: (item: OverlayData<U>,index: number,MapUtils: MapUtilsConstructor) => ['overlayOpts']`| `undefined` |函数返回原始高德覆盖物配置对象,`layerType`为 `MarkerLayer`（['overlayOpts']为[`AMap.MarkerOptions`](https://lbs.amap.com/api/javascript-api-v2/documentation#marker)）, `layerType`为`labelMarkerLayer`(['overlayOpts']为)[`AMap.labelMarkerLayer`](https://lbs.amap.com/api/javascript-api-v2/documentation#labelmarker)|

### 方法

| 方法名 | 说明 | 参数 |
|--------|------|-----|
| `add(overlayList: Array<OverlayData<U>>)` | 向图层中添加新的覆盖物数据，会自动创建对应的覆盖物实例 |`Array<OverlayData<U>>`[类型详细说明文档](https://github.com/quyue216/gdmap-utils/blob/master/src/types/BaseMarkerLayer.d.ts)|
| <code>remove(ovs: Array<AMap.Marker \| AMap.LabelMarker> \| string[])</code> | 从图层中移除指定的覆盖物，支持传入覆盖物实例数组或 ID 数组 | `ovs` 为字符串数组时表示覆盖物 ID 集合；为对象数组时元素类型为图层管理的覆盖物实例 |
| `hide` | 隐藏当前图层及其所有覆盖物 |无|
| `show` | 显示当前图层及其所有覆盖物 |无|
| `getAllOverlay` | 获取图层中所有的覆盖物实例数组（返回浅拷贝）<code>Array<AMap.Marker \| AMap.LabelMarker></code> | 无 |
| `clearAllOverlay` | 清空图层中的所有覆盖物，同时清空 `overlayList` 数据 |无|
| `reload` | 重新加载图层，先清空所有覆盖物，然后根据 `overlayList` 重新创建 |无|
| `overlayFitMap` | 根据图层中的所有覆盖物，自动调整地图视野以适应所有覆盖物 |无|
| `findLayerOverlay` | 根据覆盖物 ID 查找对应的覆盖物实例 |图层创建传递的overList属性存储覆盖物列表信息，在其中每个Item需要指定覆盖物的id|
| `bindEventOverlays(clickType: AMap.EventType, callback: () => void)` | 为图层中的所有覆盖物绑定指定类型的事件 |clickType为事件类型 （仅支持绑定覆盖物支持的事件），callback事件对应回调|
| `refreshOverlayIcon` | 根据 `getIconUrl` 重新计算并刷新指定覆盖物的图标 |传递指定覆盖物ID刷新Icon|
| `refreshOverlayLabel` | 根据 `getOverlayOpts` 重新计算并刷新指定覆盖物的标签/文本 |传递指定覆盖物ID刷新Label|
| `getRawLayer` | 获取高德地图的原始图层实例（`AMap.OverlayGroup` 或 `AMap.LabelsLayer`） |无|
| `destroy` | 销毁图层，从 `MapUtils` 中移除并清空所有覆盖物 |无|

## clusterMarkerLayer图层
`clusterMarkerLayer` 图层适用于海量点数据场景，它对高德原生的 `new AMap.MarkerCluster` 进行包装（如需扩展，可自行接入 `AMap.MassMarks` 等同类组件，`MarkerCluster` 与 `MassMarks` 调用方式相似，均适合大数据量渲染，故将其抽象整合。但`MassMarks`在我司业务中并未使用，所以并未整合在一起） 


[`clusterMarkerLayer`类型文档参考](https://github.com/quyue216/gdmap-utils/blob/master/src/types/clusterMarkerLayer.d.ts)，图层创建示例: 
```javascript

  interface ClusterMarkerLayerOpts<
    U = {},
    T extends MarkerClusterLayerType = 'markerClusterLayer',
    V = ClusterMarkerLayerInfo[T],
  > {
    layerType: T;
    layerName: string;
    overlayList: Array<OverlayData<U>>;
    layerOpts: V['layerOpts']; //类型动态计算，图层类型layerType决定layerOpts参数传递方式
  }

 const defaultIcon = gdMapUtils.createIcon({
        size: config.size,
        image: config.icon,
        imageSize: config.size,
        imageOffset: config.pixel,
      });

    // 激活图标
    const activeIcon = gdMapUtils.createIcon({
      size: config.size,
      image: config.iconActive,
      imageSize: config.size,
      imageOffset: config.pixel,
    });

    //图层创建
    window.clusterMarkerLayer = mapUtils.createClusterMarkerLayer({
      layerType: 'markerClusterLayer',
      layerName: 'sydwCollecte',
      overlayList: data.slice(0, 10).map(item => {
        return {
          overlayData: {
            lon: item.jd,
            lat: item.wd,
            title: item.sydmc,
            id: item.id,
            extData: item,
          },
          id: item.id,
          labelShowed: false,
          iconActive: false,
        };
      }),
      layerOpts: {
        gridSize: 80,
        renderClusterMarker(context) {
          // 绘制聚合点时调用
          const count = data.length;
          const factor = Math.pow(context.count / count, 1 / 18);
          const div = document.createElement('div');
          const Hue = 180 - factor * 180;
          const bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
          const fontColor = 'hsla(' + Hue + ',100%,20%,1)';
          const borderColor = 'hsla(' + Hue + ',100%,40%,1)';
          const shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
          div.style.backgroundColor = bgColor;
          const size = Math.round(
            30 + Math.pow(context.count / count, 1 / 5) * 20
          );
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
        renderMarker: context => {
          const {
            overlayData: { extData },
            iconActive,
            labelShowed,
          } = context.data[0];

          const curIcon = iconActive ? activeIcon : defaultIcon;

          context.marker.setOffset(gdMapUtils.Pixel(...config.pixel));
          context.marker.setExtData(extData);
          context.marker.setIcon(curIcon);
          context.marker.setLabel({
            offset: gdMapUtils.Pixel(0, 0),
            content: `<div class="${!labelShowed ? 'display-none' : ''} sydw-label">${extData.sydmc}</div>`,
            direction: 'top',
          });
        },****
      },
    });
```

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| layerType | `MarkerClusterLayerType`|`undefined` | 图层类型只管理一类覆盖物`new AMap.MarkerCluster` |
| layerName | `string` | `undefined` | 图层的唯一标识名称，创建时传入，用于区分不同图层（不可重复）|
| layerVisible | `boolean` | `true` | 图层的显示状态，`true` 为显示在地图上，`false` 为隐藏|
| mapUtils | `MapUtils` | `mapUtils` | 关联的`MapUtils` 实例，用于操作地图和图层管理 |
| getIconUrl | `(item: OverlayData) => string` | `undefined` | 获取图标 URL 的回调函数，根据覆盖物数据返回对应的图标地址 （根据状态计算图标） |
| rawLayerIns | `MarkerLayer` | `LabelMarkerLayer` | 原始高德图层实例的包装对象。`markerLayer` 类型时为 `MarkerLayer`（内部使用`new AMap.MarkerCluster`）|
| overlayList | `Array<OverlayData<U>>`（[类型定义](https://github.com/quyue216/gdmap-utils/blob/master/src/types/BaseMarkerLayer.d.ts)） | `[]` | 覆盖物数据数组，包含点位信息（位置、标题、扩展数据等）和状态信息（标题显隐、图标激活状态），格式须符合规范 |
| layerOpts| `AMap.MarkerClusterOptions`| `undefined` | 聚合图层配置选项，由`layerType`决定对应的配置类型。当`layerType`为`'markerClusterLayer'`时，对应高德`AMap.MarkerCluster`的构造参数配置 |

### 方法

| 方法名 | 说明 | 参数 |
|--------|------|-----|
| `add(overlayList: Array<OverlayData<U>>)` | 向图层中添加新的覆盖物数据，会自动转换为聚合数据格式并添加到地图 | [`overlayList`类型说明](https://github.com/quyue216/gdmap-utils/blob/master/src/types/clusterMarkerLayer.d.ts): 覆盖物数据数组，包含位置、标题、权重等信息 |
| `remove(ovs: Array<number \| string>)` | 根据覆盖物ID从图层中移除指定的覆盖物，会更新内部数据列表并重新渲染聚合图层 | `ovs`: 覆盖物ID数组，字符串或数字类型，表示需要移除的覆盖物id集合 |
| `hide()` | 隐藏当前聚合图层及其所有聚合标记 | 无 |
| `show()` | 显示当前聚合图层，会将当前`overlayList`数据转换为聚合格式后重新渲染 | 无 |
| `clearAllOverlay()` | 清空图层中的所有覆盖物，同时清空内部的`overlayList`数据 | 无 |
| `bindEventOverlays(clickType: AMap.EventType, callback: () => void)` | 为图层中的聚合标记绑定指定类型的事件 | `clickType`: 事件类型（如`'click'`等，参考高德地图事件文档）<br>`callback`: 事件触发时的回调函数 |
| `getRawLayer()` | 获取高德地图的原始聚合图层实例（`AMap.MarkerCluster`） | 无 |
| `destroy()` | 销毁图层，从`MapUtils`中移除图层管理，销毁地图实例，并清空`overlayList`数据 | 无 |
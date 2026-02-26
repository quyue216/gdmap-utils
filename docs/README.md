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



## baseMarkerLayer

## clusterMarkerLayer

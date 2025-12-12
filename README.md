1. 高德地图AMap常用函数：统一管理、调用。
# 组织架构
1. gdUtils
    1.1 前置: 地图配置保，初始化操, plugins
    2.1 地图事件绑定
    3.1 marker部分逻辑耦合在`gdMapUtils` 
2. markerPointerController 名称更改为`markerLayer`
    1.1 点位批量创建
    2.1 点位管理:"添加、删除、更新、事件绑定(图层事件管理)"
    3.1 `markerList`经纬度变化自动更新位置
    4.1 marker激活状态管理
    5.1 图层管理：“图层生命周期，图层销毁”
3.  CollectionPointLayerController `markerClusterLayer`
    1. 图层管理：“显示,隐藏, 销毁, 图层生命周期”
4. LabelLayerRender 名称更改为`labelMarkerLayer`

## idea
```js
    //工具库调用方式太奇怪, new GdMapUtils需要在initMap之前
    this.gdMapUtils = new GdMapUtils({
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.MapType', 'AMap.MoveAnimation'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      });

    this.map = await this.gdMapUtils.initMap('gisMap', {
        zoom: 14, // 初始化地图级别
        resizeEnable: true,
        rotateEnable: true,
        pitchEnable: true,
        center: [121.589604, 31.051637],
        zooms: [1, 20],
        zoom: '13.3',
        showLabel: true,
        viewMode: '2D',
        pitch: 50,
    });
```

## 改进点
1. `new MapUtils()`关联一个地图, `mapUtils`实例对地图进行管理,以取代`linkToExistMap`
2. 高德地图使用不太了解, 一些函数的调用方式不是很熟悉
3. 考虑将`overlayGroupManagerMap`从`gdMapUtils`中分离出来, 作为一个独立的类`OverlayGroupManager`，他用于管理图层
4. 地图初始化从`gdMapUtils`中分离出来, 作为一个独立的函数`initMap`，引入地图相关依赖
5. 为什么要引入`OverlayGroupManger.js` ，marker功能扩展让其与labelMarker保持一致，`Overlay`可以管理所有覆盖物，他内部包含许多`marker`代码 (单一性原则违反掉)
6. `this.layerInstance = gdMapUtils.getOverlayGroupManager(this.config.className); // 获取图层对象` 图层对象存放在GdMapUtils中是否合理
8. ts实现抽象类,接口约束图层类
7. 工具库实现自定义事件, 用于派发自定义事件, 如`markerShowed`、`markerMouseover`等
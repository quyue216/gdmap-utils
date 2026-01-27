[**GdMapUtils**](../README.md)
***

[GdMapUtils](../globals.md) / MapUtils

## Constructors

### Constructor

> **new MapUtils**(`opts`, `AMap`): `MapUtils`
***

### options

> **options**: `object`
***

### LayerManager

> **LayerManager**: `LayerManager`
***

### createAMapMarker()

> `static` **createAMapMarker**: (`options`) => `Marker` = `MapMixin.createAMapMarker`

创建高德地图标注
***

### createIcon()

> `static` **createIcon**: (`opts`) => `Icon` = `MapMixin.createIcon`

创建一个图标
***

### Size()

> `static` **Size**: (`width`, `height`) => `Size` = `MapMixin.Size`

地物对象的像素尺寸
***

### Pixel()

> `static` **Pixel**: (...`rest`) => `Pixel` = `MapMixin.Pixel`

像素坐标，确定地图上的一个像素点
***

### LngLat()

> `static` **LngLat**: (`lng`, `lat`, `noWrap?`) => `LngLat` = `MapMixin.LngLat`

经纬度坐标，用来描述地图上的一个点位置
***

### createAMapInfoWindow()

> `static` **createAMapInfoWindow**: (`opts`) => `InfoWindow` = `MapMixin.createAMapInfoWindow`
***

### createAMapPolyline()

> `static` **createAMapPolyline**: (`options`) => `Polyline` = `MapMixin.createAMapPolyline`

创建高德地图折线
***

### loadPlugins()

> `static` **loadPlugins**: (`plugins`) => `Promise`\<`unknown`\> = `MapMixin.loadPlugins`
***

### initMap()

> **initMap**(`id`, `opts`): `Map_2`
***

### createBaseMarkerLayer()

> **createBaseMarkerLayer**\<`U`, `T`\>(`opts`): `BaseMarkerLayer`\<`U`, `T`, `BaseMarkerLayerInfo`\[`T`\]\>
***

### createClusterMarkerLayer()

> **createClusterMarkerLayer**\<`U`, `T`\>(`opts`): `ClusterMarkerLayer`\<`U`, `T`, `ClusterMarkerLayerInfo`\[`T`\]\>

创建聚合标记图层
***

### removeLayer()

> **removeLayer**(`layer`): `void`

`removeLayer`接收图层实例将其从mapUtils的关联中移除
***

### setFitView()

> **setFitView**(opts: Parameters<mapIns['setFitView']>): `void`

根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
***

### clearInfoWindow()

> **clearInfoWindow**(): `void`

地图弹窗关闭
***

### seZoomAndCenter()

> **seZoomAndCenter**(opts: { zoom: number; center: AMap.LngLat | [number, number]; immediately?: boolean; duration?: number }): `void`

将地图视图切换到指定状态
***

### showLayer()

> **showLayer**(opts: Parameters<mapIns['setFitView']>): `void`

地图指定图层显示, `layerName`为创建图层所传递的参数，用于标识图层名称。
***

### hideLayer()

> **hideLayer**(`layerName`): `void`

地图指定图层隐藏, `layerName`为创建图层所传递的参数，用于标识图层名称。
***

### showAllLayers()

> **showAllLayers**(): `void`

地图显示所有图层
***

### hideAllLayers()

> **hideAllLayers**(): `void`

地图隐藏所有图层
***

### reloadLayers()

> **reloadLayers**(): `void`

地图重新渲染所有图层


import type { OverlaysLayer, mapIns, OverlayData } from '../../types/index.d';
import { MapUtils } from '../../MapUtils';
import type { MapUtilsConstructor } from '../../MapUtils';

// 接口约束类暂时去掉implements OverlaysLayer<AMap.Marker, AMap.OverlayGroup>
class MarkerLayer {
  rawLayer = new AMap.OverlayGroup();

  map: mapIns;

  events = new Map<AMap.EventType, () => void>();

  constructor(map: mapIns) {
    this.map = map;
    //@ts-ignore
    this.map.add(this.rawLayer);
  }

  /**
   * 将覆盖物数据转换为标记配置
   * @param item 覆盖物数据
   * @param index 索引
   * @param getIconUrl 获取图标URL的方法
   * @param getOverlayOpts 动态获取覆盖物配置的方法
   * @param MapUtils MapUtils构造函数
   * @returns 标记配置
   */
  static convertOverlayDataToOvlOpts<U extends {}>(
    item: OverlayData<U>,
    index: number,
    getIconUrl: (item: OverlayData<U>) => string,
    getOverlayOpts: (
      item: OverlayData<U>,
      index: number,
      MapUtils: MapUtilsConstructor
    ) => any,
    MapUtils: MapUtilsConstructor
  ): AMap.MarkerOptions {
    const {
      overlayData: { lon, lat, extData },
    } = item;

    // 获取当前覆盖物项的动态配置
    const itemOpts = getOverlayOpts(item, index, MapUtils);

    const ovlOpts: AMap.MarkerOptions = {
      position: [lon, lat],
      extData,
      ...itemOpts,
    };

    if (!item.labelShowed) {
      ovlOpts.label = undefined;
    } else {
      ovlOpts.label = ovlOpts.label ?? {
        content: `<div class="markerLayer">${item.overlayData.title}</div>`,
        offset: MapUtils.Pixel(0, -5),
        direction: 'top',
      };
    }

    ovlOpts.icon =
      ovlOpts.icon ??
      MapUtils.createIcon({
        size: [25, 34],
        image: '',
        imageSize: [25, 34],
        imageOffset: [0, 0],
      });

    const imageUrl = getIconUrl(item);

    if (typeof ovlOpts.icon === 'string') {
      ovlOpts.icon = imageUrl;
    } else {
      (ovlOpts.icon as AMap.Icon).setImage(imageUrl);
    }

    return ovlOpts as AMap.MarkerOptions;
  }

  bindEventOverlay(clickType: AMap.EventType, callback: () => void) {
    if (typeof callback !== 'function') {
      MapUtils.error('Please provide an event callback function');
      return;
    }

    // 获取地图的所有点位，绑定上事件
    this.rawLayer.on(clickType, callback);

    // 保存事件
    this.events.set(clickType, callback);
  }
  //高德地图，marker新添加会自动绑定事件
  addOverlayBindEvent(marker: InstanceType<typeof AMap.Marker>) {
    this.events.forEach((callback, clickType) => {
      marker.on(clickType, callback);
    });
  }

  createOverlays(ovOptList: Array<AMap.MapOptions>) {
    const markers = ovOptList.map(item => MapUtils.createAMapMarker(item));

    this.rawLayer.addOverlays(markers);

    return markers;
  }

  add(markers: Array<AMap.MarkerOptions>) {
    this.createOverlays(markers);
  }

  remove(markers: Array<AMap.Marker>) {
    this.rawLayer.removeOverlays(markers);
  }

  hide() {
    this.rawLayer.hide();
  }

  show() {
    this.rawLayer.show();
  }

  getAllOverlay(): Array<AMap.Marker> {
    return this.rawLayer.getOverlays();
  }

  destroy() {
    this.rawLayer.clearOverlays();
    //@ts-expect-error
    this.rawLayer.setMap(null);
  }

  reload() {
    this.rawLayer.clearOverlays();
  }

  clearAllOvl() {
    this.rawLayer.clearOverlays();
  }

  overlayFitMap() {
    const makers = this.getAllOverlay();

    this.map.setFitView(makers);
  }

  findLayerOverlay(markerId: string | number) {
    if (!markerId) {
      MapUtils.error('Please provide a markerId');
      return;
    }

    const markers: InstanceType<typeof AMap.Marker>[] = this.getAllOverlay();

    const marker = markers.find(item => {
      return item.getExtData().id === markerId;
    });

    return marker || null; // 如果没有找到，返回null
  }

  // 设置激活的marker
  refreshOverlayIcon(
    marker: InstanceType<typeof AMap.Marker>,
    icon: string | AMap.Icon
  ) {
    if (!marker) {
      // 如果没有找到对应的marker
      return MapUtils.error('marker is not found');
    }
    // 获取点击的标记对象
    marker.setIcon(icon);
  }

  /* 
   DOM过多页面会卡顿, 用到才创建
  */
  refreshOverlayLabel(
    marker: InstanceType<typeof AMap.Marker>,
    labelOpts?: {
      content: string;
      direction: string;
      offset: [number, number] | Array<number>;
    }
  ) {
    if (!marker) {
      // 如果没有找到对应的marker
      return MapUtils.error('marker is not found');
    }
    if (labelOpts) {
      marker.setLabel(labelOpts);
    } else {
      let labelOpts = marker.getLabel();

      marker.setLabel({
        ...labelOpts,
        content: '',
      });
    }
  }
}

export default MarkerLayer;

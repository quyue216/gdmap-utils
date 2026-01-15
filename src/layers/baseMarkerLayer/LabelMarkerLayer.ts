import type { OverlaysLayer, mapIns, OverlayData } from '../../types';
import type { MapUtilsConstructor } from '../../MapUtils';
import { MapUtils } from '../../MapUtils';

class LabelMarkerLayer {
  rawLayer: AMap.LabelsLayer;

  map: mapIns;

  events = new Map<AMap.EventType, () => void>();

  constructor(map: mapIns, opts?: AMap.LabelsLayerOptions) {
    this.map = map;

    this.rawLayer = new AMap.LabelsLayer({
      collision: true,
      opacity: 1,
      zIndex: 120,
      allowCollision: true,
      ...opts,
    });

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
  ): AMap.LabelMarkerOptions {
    const {
      overlayData: { lon, lat, extData, title },
    } = item;

    // 获取当前覆盖物项的动态配置
    const itemOpts = getOverlayOpts(item, index, MapUtils);

    const ovlOpts: AMap.LabelMarkerOptions = {
      position: [lon, lat],
      extData,
      ...itemOpts,
    };

    if (!item.labelShowed) {
      const textOpts = ovlOpts.text ?? {
        content: title,
        direction: 'top',
        style: {
          fontSize: 16,
          strokeWidth: 5,
        },
        zooms: [5, 20],
      };

      textOpts.content = '';

      ovlOpts.text = textOpts;
    } else {
      ovlOpts.text = ovlOpts.text ?? {
        content: title,
        direction: 'top',
        style: {
          fontSize: 16,
          strokeWidth: 5,
        },
        zooms: [5, 20],
      };
    }

    const imageUrl = getIconUrl(item);

    const icon = {
      image: '',
      size: [25, 34],
      anchor: 'bottom-center',
    };
    //@ts-ignore
    ovlOpts.icon = ovlOpts.icon ?? icon;
    //@ts-ignore
    ovlOpts.icon?.image = imageUrl;

    return ovlOpts as AMap.LabelMarkerOptions;
  }

  bindEventOverlay(clickType: AMap.EventType, callback: () => void) {
    if (typeof callback !== 'function') {
      MapUtils.error('Please provide an event callback function');
      return;
    }

    this.on(clickType, callback);

    this.events.set(clickType, callback);
  }

  addOverlayBindEvent(marker: InstanceType<typeof AMap.LabelMarker>) {
    this.events.forEach((callback, clickType) => {
      marker.on(clickType, callback);
    });
  }

  createOverlays(ovOptList: Array<AMap.LabelMarkerOptions>) {
    const labelMarkers = ovOptList.map(item => {
      const labelMarker = new AMap.LabelMarker(item); //包装吗?
      this.addOverlayBindEvent(labelMarker);
      return labelMarker;
    });

    // @ts-ignore
    this.rawLayer.add(labelMarkers);

    return labelMarkers;
  }

  add(markers: Array<AMap.LabelMarkerOptions>) {
    this.createOverlays(markers);
  }

  remove(markers: Array<AMap.LabelMarker>) {
    //@ts-ignore
    this.rawLayer.remove(markers);
  }

  hide() {
    this.rawLayer.hide();
  }

  show() {
    this.rawLayer.show();
  }

  getAllOverlay(): AMap.LabelMarker[] {
    // @ts-ignore
    return this.rawLayer.getAllOverlays();
  }

  destroy() {
    // @ts-expect-error
    this.rawLayer.clear();

    this.map.remove(this.rawLayer);
  }

  reload() {
    // @ts-expect-error
    this.rawLayer.clear();
  }

  clearAllOvl() {
    // @ts-expect-error
    this.rawLayer.clear();
  }

  overlayFitMap() {
    const labelMarkers = this.getAllOverlay();
    this.map.setFitView(labelMarkers);
  }

  findLayerOverlay(markerId: string | number) {
    if (!markerId) {
      MapUtils.error('Please provide a markerId');
      return null;
    }

    const labelMarkers: InstanceType<typeof AMap.LabelMarker>[] =
      this.getAllOverlay();

    const labelMarker = labelMarkers.find(item => {
      return item.getExtData().id === markerId;
    });

    return labelMarker || null;
  }

  refreshOverlayIcon(
    labelMarker: InstanceType<typeof AMap.LabelMarker>,
    iconOpts: AMap.LabelMarkerIconOptions
  ) {
    if (!labelMarker) {
      MapUtils.error('labelMarker is not found');
      return;
    }

    labelMarker.setIcon(iconOpts);
  }

  refreshOverlayLabel(
    labelMarker: InstanceType<typeof AMap.LabelMarker>,
    labelOpts?: AMap.LabelMarkerTextOptions
  ) {
    if (!labelMarker) {
      MapUtils.error('labelMarker is not found');
      return;
    }

    if (labelOpts) {
      labelMarker.setText(labelOpts);
    } else {
      const currentLabel = labelMarker.getText();
      labelMarker.setText({
        ...currentLabel,
        content: '', //清空可以生效吗
      });
    }
  }

  /**
   *
   * labelLayer不存在on方法
   * @param {AMap.EventType} clickType  事件类型
   * @param {() => void} callback  事件函数
   * @memberof LabelMarkerLayer
   */
  on(clickType: AMap.EventType, callback: () => void) {
    const labelMarkers = this.getAllOverlay();

    labelMarkers.forEach(labelMarker => {
      labelMarker.on(clickType, callback);
    });
  }
}

export default LabelMarkerLayer;

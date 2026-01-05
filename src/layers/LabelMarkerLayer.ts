import type { OverlaysLayer, mapIns } from '../types/index.d';
import { MapUtils } from '../MapUtils';

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

  //TODO marker可以直接绑定事件?
  bindEventOverlay(clickType: AMap.EventType, callback: () => void) {
    if (typeof callback !== 'function') {
      MapUtils.error('Please provide an event callback function');
      return;
    }

    this.rawLayer.on(clickType, callback);

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
    // @ts-expect-error
    this.rawLayer.add(labelMarkers);

    return labelMarkers;
  }

  add(markers: Array<AMap.LabelMarkerOptions>) {
    this.createOverlays(markers);
  }

  remove(markers: Array<AMap.LabelMarker>) {
    // @ts-expect-error
    this.rawLayer.remove(markers);
  }

  hide() {
    this.rawLayer.hide();
  }

  show() {
    this.rawLayer.show();
  }

  getAllOverlay() {
    // @ts-expect-error
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
  //TODO 调用效果存疑
  overlayFitMap() {
    const labelMarkers = this.getAllOverlay();
    this.map.setFitView(labelMarkers);
  }

  findLayerOverlay(markerId: string) {
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
    iconImgUrl: string
  ) {
    if (!labelMarker) {
      MapUtils.error('labelMarker is not found');
      return;
    }
    //你需要改动
    const iconOpts = labelMarker.getIcon();

    if (iconOpts) {
      iconOpts.image = iconImgUrl;

      labelMarker.setIcon(iconOpts);
    }
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
}

export default LabelMarkerLayer;

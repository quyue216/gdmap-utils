import type { OverlaysLayer } from '../types/index.d';
class LabelMarkerLayer implements OverlaysLayer<
  AMap.Marker,
  AMap.OverlayGroup
> {
  rawLayer = new AMap.OverlayGroup();

  constructor() {}

  createOverlays() {
    return [];
  }

  bindEventMarker(clickType: AMap.EventType, callback: () => void) {}
  add(markers: Array<AMap.Marker>) {}

  remove(markers: Array<AMap.Marker>) {}

  highlightOverLay() {}

  hide() {}

  show() {}

  getAllOverlay() {}

  destroy() {}

  reload() {}

  overlayFitMap() {}
}

export default LabelMarkerLayer;

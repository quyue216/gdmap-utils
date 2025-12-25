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

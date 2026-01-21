import type { mapIns } from '@/types/index.d';

class MarkerClusterLayer {
  rawLayer: any; //高德未提供cluster的类型

  map: mapIns;

  constructor(
    map: mapIns,
    dataOptions: Array<{ lnglat: [number, number]; weight: number }>,
    opts: any
  ) {
    this.map = map;
    //@ts-expect-error
    this.rawLayer = new AMap.MarkerCluster(map, dataOptions, opts);
  }

  bindEventMarker(clickType: AMap.EventType, callback: () => void) {}

  add(dataOption: { lnglat: [number, number]; weight: number }) {
    this.rawLayer.addData(dataOption);
  }

  remove(dataOptions: Array<{ lnglat: [number, number]; weight: number }>) {
    this.rawLayer.setData(dataOptions);
  }

  hide() {
    this.rawLayer.setData([]);
  }

  show(dataOptions: Array<{ lnglat: [number, number]; weight: number }>) {
    this.rawLayer.setData(dataOptions);
  }

  destroy() {
    this.rawLayer.setData([]);
    this.rawLayer.setMap(null);
  }

  clearAllOvl() {
    this.rawLayer.setData([]);
  }
}

export default MarkerClusterLayer;

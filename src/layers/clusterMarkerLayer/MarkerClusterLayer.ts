import type {
  mapIns,
  MarkerClusterDataOptions,
  MarkerClusterOptions,
} from '@/types/index.d';

class MarkerClusterLayer {
  rawLayer: any; //高德未提供cluster的类型

  map: mapIns;

  constructor(
    map: mapIns,
    dataOptions: Array<MarkerClusterDataOptions>,
    opts: MarkerClusterOptions
  ) {
    this.map = map;
    //@ts-expect-error
    this.rawLayer = new AMap.MarkerCluster(map, dataOptions, opts);
  }

  bindEventMarker(clickType: AMap.EventType, callback: () => void) {
    this.rawLayer.on(clickType, callback);
  }

  add(dataOption: MarkerClusterDataOptions) {
    this.rawLayer.addData(dataOption);
  }

  remove(dataOptions: Array<MarkerClusterDataOptions>) {
    this.rawLayer.setData(dataOptions);
  }

  hide() {
    this.rawLayer.setData([]);
  }

  show(dataOptions: Array<MarkerClusterDataOptions>) {
    this.rawLayer.setData(dataOptions);
  }

  destroy() {
    this.rawLayer.setData([]);
    this.rawLayer.setMap(null);
    this.rawLayer = null;
  }

  clearAllOvl() {
    this.rawLayer.setData([]);
  }
}

export default MarkerClusterLayer;

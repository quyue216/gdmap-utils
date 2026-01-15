// 高德地图实例
type mapIns = InstanceType<typeof AMap.Map>;

type MapOptions = AMap.MapOptions;

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

interface MapUtilsStatic extends MapMixinType {
  new (
    opts: MapUtilsOpts[keyof MapUtilsOpts],
    AMap: Simplify<typeof gdAMap>
  ): MapUtils;
}

// 图层管理器
interface LayerManger<T = new (...args: any[]) => any, K = InstanceType<T>> {
  layers: WeakMap<K, K>; //组合模式

  addLayer(layer: K): void;

  removeLayer(layerIdOrLayer: K | string): void;

  show(): void;

  hide(): void;

  showAll(): void;

  hideAll(): void;

  reload(): void;
}

export type {
  mapIns,
  MapOptions,
  MapUtilsCreateOpts,
  MapUtilsUseExistingOpts,
  MapUtilsOpts,
  LayerManger,
  MapUtilsStatic,
};

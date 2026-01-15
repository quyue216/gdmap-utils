import type { LayerManger } from './types/index.d.ts';
import type { BaseMarkerLayerClass } from './layers/index.ts';

type LayerIns = InstanceType<BaseMarkerLayerClass>;
export class LayerManager implements LayerManger<BaseMarkerLayerClass> {
  layers: WeakMap<LayerIns, LayerIns> = new WeakMap(); //组合模式

  addLayer(layer: LayerIns) {
    if (this.hasLayer(layer)) {
      throw new Error(`Layer with name "${layer.layerName}" already exists`);
    }
    this.layers.set(layer, layer);
  }

  removeLayer(layer: LayerIns) {
    this.layers.delete(layer);
  }

  show() {} //! 你怎么知道，你要隐藏或者显示某个图层

  hide() {}

  showAll() {}

  hideAll() {}

  reload() {}

  hasLayer(layer: LayerIns): boolean {
    return this.layers.has(layer);
  }
}
export default LayerManager;

import type { LayerManger } from './types/index.d.ts';
import type { LayerClass } from './layers/index.ts';

type LayerIns = InstanceType<LayerClass>;
export class LayerManager implements LayerManger<LayerClass> {
  layers: Map<string, LayerIns> = new Map(); //组合模式

  addLayer(layer: LayerIns) {
    if (this.hasLayer(layer.layerName)) {
      throw new Error(`Layer with name "${layer.layerName}" already exists`);
    }
    this.layers.set(layer.layerName, layer);
  }

  removeLayer(layerIdOrLayer: LayerIns | string) {}

  show() {} //! 你怎么知道，你要隐藏或者显示某个图层

  hide() {}

  showAll() {}

  hideAll() {}

  reload() {}

  hasLayer(layerName: string): boolean {
    return this.layers.has(layerName);
  }
}
export default LayerManager;

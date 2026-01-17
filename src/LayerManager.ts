import type { LayerManger } from './types/index.d.ts';
import type { BaseMarkerLayerClass } from './layers/index.ts';

type LayerIns = InstanceType<BaseMarkerLayerClass>;
export class LayerManager {
  layers: Map<string, LayerIns> = new Map(); //组合模式

  addLayer(layer: LayerIns) {
    if (this.hasLayer(layer)) {
      throw new Error(`Layer with name "${layer.layerName}" already exists`);
    }
    this.layers.set(layer.layerName, layer);
  }

  removeLayer(layer: LayerIns) {
    this.layers.delete(layer.layerName);
  }

  show(LayerName: string) {
    let layer = this.layers.get(LayerName);
    if (layer) {
      layer.show();
    }
  }

  hide(LayerName: string) {
    let layer = this.layers.get(LayerName);
    if (layer) {
      layer.hide();
    }
  }

  showAll() {
    this.layers.forEach(val => val.show());
  }

  hideAll() {
    this.layers.forEach(val => val.hide());
  }

  reload() {
    this.layers.forEach(val => val.reload());
  }

  hasLayer(layer: LayerIns): boolean {
    return this.layers.has(layer.layerName);
  }
}
export default LayerManager;

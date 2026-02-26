import type {
  BaseMarkerLayerClass,
  ClusterMarkerLayerClass,
} from '@/layers/index.ts';
import { MapUtils } from '@/MapUtils';

type LayerIns =
  | InstanceType<BaseMarkerLayerClass>
  | InstanceType<ClusterMarkerLayerClass>;
export class LayerManager {
  layers: Map<string, LayerIns> = new Map(); //组合模式

  addLayer(layer: LayerIns) {
    if (this.hasLayer(layer)) {
      const errorMsg = `Layer with name "${layer.layerName}" already exists`;
      return MapUtils.error(errorMsg);
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
    } else {
      const errorMsg = `Layer with name "${LayerName}" not found`;
      return MapUtils.error(errorMsg);
    }
  }

  hide(LayerName: string) {
    let layer = this.layers.get(LayerName);
    if (layer) {
      layer.hide();
    } else {
      const errorMsg = `Layer with name "${LayerName}" not found`;
      return MapUtils.error(errorMsg);
    }
  }

  showAll() {
    this.layers.forEach(val => val.show());
  }

  hideAll() {
    this.layers.forEach(val => val.hide());
  }

  reload() {
    this.layers.forEach(val => {
      if (typeof (val as any).reload === 'function') {
        (val as any).reload();
      }
    });
  }

  hasLayer(layer: LayerIns): boolean {
    return this.layers.has(layer.layerName);
  }

  clear() {
    this.layers.forEach(layer => {
      if (typeof (layer as any).destroy === 'function') {
        (layer as any).destroy();
      }
    });
  }
}
export default LayerManager;

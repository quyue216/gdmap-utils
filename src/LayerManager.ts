import type { LayerManger } from './types/index.d.ts';
import type { LayerClass } from './layers/index.ts';

type LayerIns = InstanceType<LayerClass>;
export class LayerManager implements LayerManger<LayerClass> {
  layers: Map<string, LayerIns> = new Map(); //组合模式

  addLayer(layer: LayerIns) {}

  removeLayer(layerIdOrLayer: LayerIns | string) {}

  show() {} //! 你怎么知道，你要隐藏或者显示某个图层

  hide() {}

  showAll() {}

  hideAll() {}

  reload() {}
}
export default LayerManager;

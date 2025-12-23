class MarkerClusterLayer {
  dataList: any[] = [];
  layerInstance: any = null;
  isLayerCreated: boolean = false;
  activeNames: any[] = [];
  config: any = {};
  createOverlay: Function;
  requestCallback: Function;

  constructor({ config, createOverlay, requestCallback }: any) {
    this.config = config ?? {};
    this.createOverlay = createOverlay;
    this.requestCallback = requestCallback;
    this.activeNames = [
      ...(this?.config?.extraActiveName ?? []),
      this.config.name,
    ];
  }

  getGdMapUtilsIns(id: string = 'gisMap'): any {
    return null;
  }

  async createLayer(gdMapUtils: any): Promise<void> {}

  showLayer(v: any): void {}

  shouldCreationLayer(activeName: any): boolean {
    return false;
  }

  hideLayer(): void {}

  handleMapTypeChange(newVal: any, oldVal: any): void {}

  get dataOfLayer(): any[] {
    return this.dataList;
  }
}

export default MarkerClusterLayer;

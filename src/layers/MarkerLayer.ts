class MarkerLayer {
  dataList: any[] = [];
  updatePointerTimer: NodeJS.Timeout | null = null;
  layerInstance: any = null;
  isLayerCreated: boolean = false;
  detectingPosition: any = null;
  activeNames: any[] = [];
  config: any = {};
  createOverlay: Function;
  requestCallback: Function;

  constructor({
    config,
    createOverlay,
    requestCallback,
    detectingPosition = false,
  }: any) {
    this.config = config ?? {};
    this.createOverlay = createOverlay;
    this.requestCallback = requestCallback;
    this.detectingPosition = detectingPosition;
    this.activeNames = [
      ...(this?.config?.extraActiveName ?? []),
      this.config.name,
    ];
  }

  getGdMapUtilsIns(id: string = 'gisMap'): any {
    return null;
  }

  handleVisibilityChange(): void {}

  async createLayer(gdMapUtils: any): Promise<void> {}

  showLayer(): void {}

  hideLayer(): void {}

  highlightMarker(id: any): void {}

  shouldCreationLayer(activeName: any = this.config.name): boolean {
    return false;
  }

  startDetectingPositionChange(getGdMapUtilsIns: any): void {}

  stopDetectingPositionChange(): void {}

  async updatePointer(getGdMapUtilsIns: any): Promise<void> {}

  differenceWith(newestDataList: any[], oldDataList: any[]): any[] {
    return [];
  }

  handleMapTypeChange(newVal: any, oldVal: any, id: any): void {}

  destroy(): void {}

  get markerList(): any[] {
    return [];
  }

  get dataOfLayer(): any[] {
    return this.dataList;
  }
}

export default MarkerLayer;

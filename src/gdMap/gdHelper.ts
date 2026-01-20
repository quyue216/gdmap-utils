const gdHelperMixin = {
  /**
   * 创建高德地图标注
   * @param {AMap.MarkerOptions} options 标注配置
   * @returns {AMap.Marker} 标注对象
   */
  createAMapMarker(options: AMap.MarkerOptions): AMap.Marker {
    return new AMap.Marker({
      ...options,
    });
  },

  /**
   * 创建一个图标
   * @param {[number, number]} size - 图标尺寸，格式为 [width, height]
   * @param {string} image - 图片的 URL 地址
   * @param {[number, number]} imageSize - 图标所用图片的大小，格式为 [width, height]
   * @param {[number, number]} imageOffset - 图标取图的偏移量，格式为 [x, y]
   * @returns {AMap.Icon} 图标对象
   */
  createIcon(opts: {
    size: [number, number];
    image: string;
    imageSize: [number, number];
    imageOffset: [number, number];
  }): AMap.Icon {
    return new AMap.Icon({
      size: this.Size(...opts.size),
      image: opts.image,
      imageSize: this.Size(...opts.imageSize),
      imageOffset: this.Pixel(...opts.imageOffset),
    });
  },

  /**
   * 地物对象的像素尺寸
   * @param {number} width 宽度
   * @param {number} height 高度
   * @returns {AMap.Size} 尺寸对象
   */
  Size(width: number, height: number): AMap.Size {
    return new AMap.Size(width, height);
  },

  /**
   * 像素坐标，确定地图上的一个像素点
   * @param {number} x x坐标
   * @param {number} y y坐标
   * @returns {AMap.Pixel} 像素对象
   */
  Pixel(...rest: [number, number]): AMap.Pixel {
    return new AMap.Pixel(...rest);
  },

  /**
   * 经纬度坐标，用来描述地图上的一个点位置
   * @param {number} lng 经度值
   * @param {number} lat 纬度值
   * @param {boolean} noWrap 是否不进行标准化处理
   * @returns {AMap.LngLat} 经纬度对象
   */
  LngLat(lng: number, lat: number, noWrap?: boolean): AMap.LngLat {
    return new AMap.LngLat(lng, lat, noWrap);
  },

  /*
   创建点位信息窗体
   */
  createAMapInfoWindow(opts: ConstructorParameters<typeof AMap.InfoWindow>[0]) {
    const defIsCustom = true;
    const defCloseWhenClickMap = true;
    const {
      isCustom = defIsCustom,
      closeWhenClickMap = defCloseWhenClickMap,
      ...rest
    } = opts!;
    return new AMap.InfoWindow({
      isCustom,
      closeWhenClickMap,
      ...rest,
    });
  },
};

export default gdHelperMixin;

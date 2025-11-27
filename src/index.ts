/**
 * 地图工具库
 */

export class MapUtils {
  /**
   * 计算两个经纬度之间的距离
   * @param lat1 第一个点的纬度
   * @param lon1 第一个点的经度
   * @param lat2 第二个点的纬度
   * @param lon2 第二个点的经度
   * @returns 距离（单位：米）
   */
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // 地球半径（单位：米）
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * 将经纬度转换为墨卡托坐标
   * @param lat 纬度
   * @param lon 经度
   * @returns 墨卡托坐标 [x, y]
   */
  static latLngToMercator(lat: number, lon: number): [number, number] {
    const x = lon * 20037508.34 / 180;
    let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    return [x, y];
  }

  /**
   * 将墨卡托坐标转换为经纬度
   * @param x 墨卡托坐标 x
   * @param y 墨卡托坐标 y
   * @returns 经纬度 [lat, lon]
   */
  static mercatorToLatLng(x: number, y: number): [number, number] {
    const lon = x / 20037508.34 * 180;
    let lat = y / 20037508.34 * 180;
    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
    return [lat, lon];
  }
}
console.log("你好世界哈哈哈");

export default MapUtils;
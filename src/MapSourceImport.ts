import AMapLoader from '@amap/amap-jsapi-loader';
import type { AMap, loaderOpts } from './types/amap.d.ts'; //TODO   项目配置ts自动引入，移除导入信息

// AMap
let gdAMap: typeof AMap | null = null;

class MapSourceImport {
  static async loadScript(opts: loaderOpts) {
    // 确保每次的AMap都是合法的所以不分开创建
    return AMapLoader.load(opts)
      .then((rawAMap: typeof AMap) => {
        // 将 AMap 全局对象挂载到 window 上
        gdAMap = rawAMap;

        return gdAMap;
      })
      .catch(e => {
        console.error(e);
        throw new Error(e);
      });
  }
}

export default MapSourceImport;

import AMapLoader from '@amap/amap-jsapi-loader';
import type { AMap, loaderOpts } from './types/amap.d.ts'; //TODO   项目配置ts自动引入，移除导入信息

class MapSourceImport {
  static async loadScript(opts: loaderOpts) {
    // 某些API加载前必须设置秘钥
    // window._AMapSecurityConfig = {
    //   securityJsCode: process.env.VUE_APP_GD_MAP_CODE, // 安全密钥
    // };
    // 确保每次的AMap都是合法的所以不分开创建
    return AMapLoader.load(opts)
      .then((rawAMap: typeof AMap) => {
        // 将 AMap 全局对象挂载到 window 上
        return rawAMap;
      })
      .catch(e => {
        console.error(e);
        throw new Error(e);
      });
  }
}

export default MapSourceImport;

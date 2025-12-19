import AMapLoader from "@amap/amap-jsapi-loader";
import type { AMap, loaderOpts } from "./types/amap.d.ts";  //TODO   项目配置ts自动引入，移除导入信息

// AMap
let gdAMap: AMap | null = null;

class MapSourceImport {

  static async loadScript(opts: loaderOpts) {

    if ('AMap' in window) {  //外部已加载高德资源
      !gdAMap && (gdAMap = window.AMap)
      return gdAMap
    } else {
      // 确保每次的AMap都是合法的所以不分开创建
      return AMapLoader.load(opts)
        .then((AMap: AMap) => {
          // 将 AMap 全局对象挂载到 window 上
          gdAMap = AMap;

          return AMap;
        })
        .catch((e) => {
          console.error(e);
          throw new Error(e);
        });
    }
  }

}


export default MapSourceImport;
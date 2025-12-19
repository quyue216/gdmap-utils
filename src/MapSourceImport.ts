import AMapLoader from "@amap/amap-jsapi-loader";


// AMap
let a: AMapLoaderConfig = {}
let gdAMap = null;

class MapSourceImport {

  static async loadScript(opts) {

    if ('AMap' in window) {  //外部已加载高德资源
      !gdAMap && (gdAMap = window.AMap)
      return AMap
    } else {
      // 确保每次的AMap都是合法的所以不分开创建
      return AMapLoader.load(opts)
        .then((AMap) => {
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
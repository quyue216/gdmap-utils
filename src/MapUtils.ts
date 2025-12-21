import MapSourceImport from './MapSourceImport';
import type {AMap, loaderOpts, MapOptions}  from './types/amap.d';
import type {MapUtilsOpts,mapIns}  from './types/index.d'

class MapUtils {
  // 地图实例信息
  map:mapIns;

   constructor(optsOrMapIns:MapUtilsOpts | mapIns ,AMap:AMap) {

    if(!(typeof AMap === 'object' && 'BaseLayer' in AMap)){
      this.error("AMap is not exist");
    }

     if(optsOrMapIns instanceof AMap.Map){
      
      this.map = optsOrMapIns ;
     
    }else{
      
      const {mountSelector,...mapOptions} = optsOrMapIns;
      
      this.map = this.initMap(mountSelector,mapOptions) //地图初始化
     }

     this.bindMapClickEvent();
  }

  // 初始化绑定地图事件
  bindMapClickEvent() {
    this.map.on('click', () => {
      // if (this.clickMapRestMarkers) {
      //   this.overlayGroupManagerMap.forEach((overlayGroup) => {
      //     overlayGroup.resetActiveMarker(); // 清除图层上的所有覆盖物
      //   });
      // }
    });
  }
  
  initMap(id:string,opts:MapOptions):mapIns{ //参数要作检验吗
    return new AMap.Map(id,opts);
  }

  error(msg:string) {
    console.error(`[MapUtils Error]:${msg}`);
  }

}


async function createMapUtils(optsOrMapIns:MapUtilsOpts | mapIns ,loaderOPts?:loaderOpts) {
   let AMap = window.AMap;
   if(loaderOPts){
     AMap =  await  initMapSource(loaderOPts);
   }

  return new MapUtils(optsOrMapIns, AMap)
}

// 地图拆分
export async function initMapSource(Opts:loaderOpts) {
  return  await MapSourceImport.loadScript(Opts);
}

/* 
 地图资源加载与地图初始化进行拆分吗?
 1. 地图资源加载与构造函数耦合
    1.1 地图资源确保加载
    1.2 地图配置 (每次都要传入)
 2. 单例模式, 实例对所有组件可见
*/
export default createMapUtils;
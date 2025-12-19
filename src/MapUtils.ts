import MapSourceImport from './MapSourceImport'
// declare AMap;

class MapUtils {

  map = null;

  constructor(opsOrMap) {
    
  }

  // 初始化绑定地图事件
  bindMapClickEvent() {
    /*   this.map.on('click', () => {
        if (this.clickMapRestMarkers) {
          this.overlayGroupManagerMap.forEach((overlayGroup) => {
            overlayGroup.resetActiveMarker(); // 清除图层上的所有覆盖物
          });
        }
      });
  
      // 绑定缩放时间获取当前层级
      this.map.on('zoomchange', () => {
        const zoom = this.map.getZoom(); // 获取当前缩放级别
      }); */
  }


}

async function createMapUtils() {
  
  await MapSourceImport.loadScript({})

  return  new MapUtils() 
}


export default createMapUtils;
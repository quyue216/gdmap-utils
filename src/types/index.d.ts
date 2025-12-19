// 项目类型声明文件
import type {AMap} from './amap'

// 高德地图实例
type mapIns = InstanceType<typeof AMap.Map>


type MapUtilsOpts = {
    mountSelector:string 
}& AMap.MapOptions


export type {
    MapUtilsOpts,
    mapIns
}
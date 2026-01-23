// 图层模块入口文件
// 从baseMarkerLayer目录导入BaseMarkerLayer相关内容并重新导出
export type * from './baseMarkerLayer';

export type * from './clusterMarkerLayer';

export { default as BaseMarkerLayer } from './baseMarkerLayer';

export { default as ClusterMarkerLayer } from './clusterMarkerLayer';

import * as THREE from '../build/three.module.js';

/**
 * 创建场景对象Scene
 */
var scene = new THREE.Scene();

// 导出几何体信息。
console.log("导出几何体信息。");
var geometry = new THREE.BoxGeometry(100, 100, 100);
// 控制台查看立方体数据
console.log(geometry);
// 控制台查看geometry.toJSON()结果
console.log(geometry.toJSON());
// JSON对象转化为字符串
console.log(JSON.stringify(geometry.toJSON()));
// JSON.stringify()方法内部会自动调用参数的toJSON()方法
console.log(JSON.stringify(geometry));

// 导出材质信息。
console.log("导出材质信息。");
var material = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
}); //材质对象Material
console.log(material);
console.log(material.toJSON());
console.log(JSON.stringify(material));

// 导出场景scene信息。
console.log("导出场景scene信息。");
var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
scene.add(mesh); //网格模型添加到场景中
console.log(scene);




console.log(scene.toJSON());
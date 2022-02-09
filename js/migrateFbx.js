import * as THREE from '../build/three.module.js';
import {FBXLoader} from "../examples/jsm/loaders/FBXLoader.js";
import {TrackballControls} from "../examples/jsm/controls/TrackballControls.js";
import {OrbitControls} from "../examples/jsm/controls/OrbitControls.js";
import * as SkeletonUtils from "../examples/jsm/utils/SkeletonUtils.js";

let scene = new THREE.Scene();
let loader = new FBXLoader();//创建一个FBX加载器
let sourceObj=null;
let targetObj=null;
// 混合器变量
let sourceMixer = null;
let targetMixer = null;
let cloneMixer = null;
// 骨骼对象
let sourceSkinMesh = null;
let targetSkinMesh = null;

loader.load("./fbx/c_with_skin.fbx", function(obj) {
    console.log("c_with_skin.json");
    console.log(obj.toJSON());
    sourceObj = obj;
    console.log("sourceObj:");
    console.log(sourceObj);
    scene.add(sourceObj);
    // 骨骼辅助对象
    const sourceSkeletonHelper = new THREE.SkeletonHelper( sourceObj );
    scene.add( sourceSkeletonHelper );
    sourceMixer = new THREE.AnimationMixer(sourceObj);
    console.log("sourceMixer:");
    console.log(sourceMixer);
    sourceSkinMesh = new THREE.SkinnedMesh(sourceObj, new THREE.MeshLambertMaterial({color:0xfb397,skinning: true}));
    console.log("sourceSkinMesh:");
    console.log(sourceSkinMesh);
});

loader.load("./fbx/c_without_skin.fbx", function(obj) {
    console.log("c_without_skin.son");
    console.log(obj.toJSON());
    targetObj = obj;
    targetObj.position.set(200, 0, 0);
    console.log("targetObj:");
    console.log(targetObj);
    scene.add(targetObj);
    // 骨骼辅助对象
    const targetSkeletonHelper = new THREE.SkeletonHelper( targetObj );
    scene.add( targetSkeletonHelper );
    targetMixer = new THREE.AnimationMixer(targetObj);
    console.log("targetMixer:");
    console.log(targetMixer);
    targetSkinMesh = new THREE.SkinnedMesh(targetObj, new THREE.MeshLambertMaterial({color:0xfb397,skinning: true}));
    console.log("targetSkinMesh:");
    console.log(targetSkinMesh);
});

//环境光:环境光颜色RGB成分分别和物体材质颜色RGB成分分别相乘
let ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);//环境光对象添加到scene场景中
// 200表示网格模型的尺寸大小，25表示纵横细分线条数量
let gridHelper = new THREE.GridHelper(2000, 100);
// gridHelper和普通的网格模型、线模型一样需要插入到场景中才会被渲染显示出来
scene.add(gridHelper);
/**
 * 相机设置
 */
let width = window.innerWidth; //窗口宽度
let height = window.innerHeight; //窗口高度
let k = width / height; //窗口宽高比
let s = 300; //三维场景显示范围控制系数，系数越大，显示的范围越大
//创建相机对象
let camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(200, 300, 200); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
let renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);//设置渲染区域尺寸
renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
document.body.appendChild(renderer.domElement); //body元素中插入canvas对象

// 三维宣传场景控制
let axes = new THREE.AxisHelper(200);               //创建三轴表示
scene.add(axes);
let controls = new OrbitControls(camera, renderer.domElement);     //创建场景旋转缩放事件
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.0;
controls.panSpeed = 1.0;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;
// controls.addEventListener('change', renderer);

let combineFinished = false;
function combineSource() {
    let cloneObj = null;
    let cloneSkinMesh = null;
    console.log("sourceObj:");
    console.log(sourceObj);
    console.log("targetObj:");
    console.log(targetObj);
    cloneObj = SkeletonUtils.copyObj(sourceObj, targetObj);
    cloneObj.position.set(0, 200, 0);
    scene.add(cloneObj);
    const cloneSkeletonHelper = new THREE.SkeletonHelper( cloneObj );
    scene.add( cloneSkeletonHelper );
    cloneMixer = new THREE.AnimationMixer(cloneObj);
    console.log("cloneMixer:");
    console.log(cloneMixer);
    cloneSkinMesh = new THREE.SkinnedMesh(cloneObj, new THREE.MeshLambertMaterial({color:0xfb397,skinning: true}));
    console.log("cloneSkinMesh:");
    console.log(cloneSkinMesh);
}

// 创建一个时钟对象Clock
let clock = new THREE.Clock();
// 渲染函数
function render() {
    renderer.render(scene, camera); //执行渲染操作
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
    let delta = clock.getDelta();
    if (sourceMixer !== null) {
        // 更新混合器相关的时间
        sourceMixer.update(delta);
    }
    if (targetMixer !== null) {
        // 更新混合器相关的时间
        targetMixer.update(delta);
    }
    if (cloneMixer !== null) {
        // 更新混合器相关的时间
        cloneMixer.update(delta);
    }
    if (controls !== null) {
        controls.update();
    }
    if (sourceObj !== null && targetObj !== null && combineFinished === false) {
        combineSource();
        combineFinished = true;
    }
}
render();




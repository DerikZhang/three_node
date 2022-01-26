import * as THREE from '../build/three.module.js';
import {FBXLoader} from "../examples/jsm/loaders/FBXLoader.js";
import {TrackballControls} from "../examples/jsm/controls/TrackballControls.js";

var scene = new THREE.Scene();
var mixer=null;//声明一个混合器变量
var loader = new FBXLoader();//创建一个FBX加载器
loader.load("./fbx/c_with_skin.fbx", function(obj) {
    console.log("into loader");
    console.log(obj.toJSON());
    scene.add(obj);
    // obj.translateY(-80);
    // obj作为参数创建一个混合器，解析播放obj及其子对象包含的动画数据
    mixer = new THREE.AnimationMixer(obj);
    // 查看动画数据
    console.log(obj.animations)
    // obj.animations[0]：获得剪辑对象clip
    var AnimationAction=mixer.clipAction(obj.animations[0]);
    // AnimationAction.timeScale = 1; //默认1，可以调节播放速度
    // AnimationAction.loop = THREE.LoopOnce; //不循环播放
    // AnimationAction.clampWhenFinished=true;//暂停在最后一帧播放的状态
    AnimationAction.play();//播放动画
});

//环境光:环境光颜色RGB成分分别和物体材质颜色RGB成分分别相乘
var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);//环境光对象添加到scene场景中
// 200表示网格模型的尺寸大小，25表示纵横细分线条数量
var gridHelper = new THREE.GridHelper(2000, 100);
// gridHelper和普通的网格模型、线模型一样需要插入到场景中才会被渲染显示出来
scene.add(gridHelper);

/**
 * 相机设置
 */
var width = window.innerWidth; //窗口宽度
var height = window.innerHeight; //窗口高度
var k = width / height; //窗口宽高比
var s = 300; //三维场景显示范围控制系数，系数越大，显示的范围越大
//创建相机对象
var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(200, 300, 200); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);//设置渲染区域尺寸
renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
document.body.appendChild(renderer.domElement); //body元素中插入canvas对象

// 三维宣传场景控制
var axes = new THREE.AxisHelper(200);               //创建三轴表示
scene.add(axes);
var controls = new TrackballControls(camera, renderer.domElement);     //创建场景旋转缩放事件
controls.rotateSpeed = 2.5;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;
// controls.addEventListener('change', renderer);


// 创建一个时钟对象Clock
var clock = new THREE.Clock();
// 渲染函数
function render() {
    renderer.render(scene, camera); //执行渲染操作
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
    if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(clock.getDelta());
    }
    if (controls !== null) {
        controls.update();
    }
}
render();




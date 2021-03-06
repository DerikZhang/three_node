import * as THREE from '../build/three.module.js';
import {FBXLoader} from "../examples/jsm/loaders/FBXLoader.js";
import {TrackballControls} from "../examples/jsm/controls/TrackballControls.js";
import {OrbitControls} from "../examples/jsm/controls/OrbitControls.js";
import * as SkeletonUtils from "../examples/jsm/utils/SkeletonUtils.js";


//将多有的骨骼节点存储到一个数组中
function getBoneArray(obj, boneArr){
    for(let i=0; i<obj.children.length; i++){
        if (obj.children[i].isBone) {
            boneArr[obj.children[i].name] = obj.children[i];
        }
        getBoneArray(obj.children[i], boneArr);
    }
}

//将多有的骨骼节点存储到一个数组中
function getSkeletonBoneArray(obj, boneArr){
    console.log("obj.skeletons:");
    console.log(obj.skeletons);
    for(let i=0; i<obj.skeletons.length; i++){
        boneArr[obj.skeletons[i].name] = obj.skeletons[i].bones;
    }
}



let skinnedMesh;
let scene = new THREE.Scene();
let mixer=null;//声明一个混合器变量
let loader = new FBXLoader();//创建一个FBX加载器
loader.load("./fbx/c_with_skin.fbx", function(obj) {
    console.log("obj.json");
    console.log(obj.toJSON());
    scene.add(obj);
    // 骨骼辅助对象
    const skeletonHelper = new THREE.SkeletonHelper( obj );
    scene.add( skeletonHelper );
    console.log("skeletonHelper:");
    console.log(skeletonHelper);
    // obj.translateY(-80);
    // obj作为参数创建一个混合器，解析播放obj及其子对象包含的动画数据
    mixer = new THREE.AnimationMixer(obj);
    console.log("mixer:");
    console.log(mixer);
    // 查看动画数据
    console.log(obj.animations)
    // obj.animations[0]：获得剪辑对象clip
    let AnimationAction=mixer.clipAction(obj.animations[0]);
    // AnimationAction.timeScale = 1; //默认1，可以调节播放速度
    // AnimationAction.loop = THREE.LoopOnce; //不循环播放
    // AnimationAction.clampWhenFinished=true;//暂停在最后一帧播放的状态
    AnimationAction.play();//播放动画

    // 复制对象
    let newObj = obj.clone(false);
    obj.children.forEach(chd => {
        console.log("child:");
        console.log(chd.toJSON());
        console.log("child.skeletons:");
        console.log(chd.skeletons);
    });
    let newBone = obj.children[2].clone();
    newObj.add(newBone);
    console.log("newBone.toJSON():");
    console.log(newBone.toJSON());

    let cloneObj = SkeletonUtils.clone(obj);
    console.log("cloneObj:");
    console.log(cloneObj);

    let boneArr = {};
    getBoneArray(obj, boneArr);
    console.log("boneArr:");
    console.log(boneArr);
    let skeletonBoneArr = {};
    getSkeletonBoneArray(obj, skeletonBoneArr);
    console.log("skeletonBoneArr:");
    console.log(skeletonBoneArr);

    //
    // let skinMesh = obj.children[1].clone();
    //
    // console.log("skeleton.json:");
    // console.log(obj.children[1].skeleton.toJSON());
    // let newArr = [];
    // obj.children[1].skeleton.bones.forEach(item=>{
    //     newArr.push(boneArr[item.name]);
    // });
    //
    // skinMesh.bind(new THREE.Skeleton(newArr, obj.children[1].boneInverses));
    //
    // newObj.add(skinMesh);
    newObj.position.set(100, 0, 0);
    newObj.scale.set(10,10,10);
    scene.add(newObj);
    console.log("newObj.json");
    console.log(newObj.toJSON());

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


// 创建一个时钟对象Clock
let clock = new THREE.Clock();
// 渲染函数
function render() {
    renderer.render(scene, camera); //执行渲染操作
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
    let delta = clock.getDelta();
    if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(delta);
    }
    if (controls !== null) {
        controls.update();
    }
}
render();




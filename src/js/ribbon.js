// import '../style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'dat.gui'
// import { PlaneBufferGeometry } from 'three'

import front from '../../static/front.png'
import back from '../../static/back.png'

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('.ribbons')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry( 1, 30, 30 );

// Materials
let frontTexture = new THREE.TextureLoader().load(front)
let backTexture = new THREE.TextureLoader().load(back)

function ribbonsPos() {
    [frontTexture, backTexture].forEach(t=> {
        t.wrapS = 1000;
        t.wrapT = 1000;
        t.repeat.set(1,1);
        t.offset.setX(0.5)
        t.flipY = false
    })
}
ribbonsPos()

backTexture.repeat.set(-1,1);
// frontTexture.flipY = false

let frontMaterial = new THREE.MeshStandardMaterial({
    map:frontTexture,
    side: THREE.BackSide,
    roughness: 0.1,
    metalness: 0.5,
    alphaTest: 1,
    flatShading: true
})
let backMaterial = new THREE.MeshStandardMaterial({
    map:backTexture,
    side: THREE.FrontSide,
    roughness: 0.1,
    metalness: 0.5,
    alphaTest: 1,
    flatShading: true
})



const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true
})

let num = 7;
let curvePoints = [];

for (let i = 0; i < num; i++) {

    let theta = i/num*Math.PI*2

    curvePoints.push (
        new THREE.Vector3().setFromSphericalCoords(
            1, Math.PI/2+0.7*(Math.random()-0.5),theta
        )
    )
}

const curve = new THREE.CatmullRomCurve3(curvePoints);
curve.tension = 0.7
curve.closed = true

const points = curve.getPoints( 500 );
const ggeometry = new THREE.BufferGeometry().setFromPoints( points );

const gmaterial = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// Create the final object to add to the scene
const curveObject = new THREE.Line( ggeometry, gmaterial );

// scene.add(curveObject)

let number = 1000

let frenetFrames = curve.computeFrenetFrames(number,true)

let spacePoints = curve.getSpacedPoints(number)

let temPlane = new THREE.PlaneBufferGeometry(1,1,number,1)

let dimentions = [-0.12,0.12]

let doubleSideMaterials = [frontMaterial,backMaterial]

temPlane.addGroup(0,6000,0)
temPlane.addGroup(0,6000,1)

let point = new THREE.Vector3()
let binormalShift = new THREE.Vector3()
let temp2 = new THREE.Vector3()

let finalPoints = []

dimentions.forEach(d=> {
    for (let i = 0; i <= number; i++) {
        point = spacePoints[i]
        binormalShift.add(frenetFrames.binormals[i]).multiplyScalar(d)

        finalPoints.push(new THREE.Vector3().copy(point).add(binormalShift).normalize())
    }
})

// finalPoints[number+1].copy()
// finalPoints.push(new THREE.Vector3(Math.random(), Math.random()))



finalPoints[0].copy(finalPoints[number])
finalPoints[number+1].copy(finalPoints[2*number+1])

temPlane.setFromPoints(finalPoints)

let finalMesh = new THREE.Mesh(temPlane,doubleSideMaterials)
// finalMesh.rotation.z = Math.PI / 2;
// finalMesh.rotation.x = -Math.PI / 1;


if(screen.width >= 1100) {
    finalMesh.scale.set(1,1,1)
} else {
    finalMesh.scale.set(.7,.7,.7)
}


scene.add(finalMesh)


// Mesh
const mesh = new THREE.Mesh(geometry,material)
// scene.add(mesh)

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, .5)

const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(0,10,10)

// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// pointLight.position.set(-4.02,-4.02,-1.57)
// pointLight.intensity = 0.6

// const light2 = gui.addFolder('light 2')

// light2.add(pointLight.position, 'y').min(-10).max(10).step(0.01);
// light2.add(pointLight.position, 'x').min(-10).max(10).step(0.01);
// light2.add(pointLight.position, 'z').min(-10).max(10).step(0.01);
// light2.add(pointLight, 'intensity').min(0).max(10).step(0.01);

scene.add(ambientLight,directionalLight)

/**
 * Sizes
 */

const sizes = {
    width: '',
    height: window.innerHeight
}

if(screen.width >= 992) {
    sizes.width = window.innerWidth / 2
} else {
    sizes.width = window.innerWidth
}
window.addEventListener('resize', () =>
{
    // Update sizes
    if(screen.width >= 992) {
        sizes.width = window.innerWidth / 2
    } else {
        sizes.width = window.innerWidth 
    }
    
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true

})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', ribbonsMooved)

let mouse = {
    x: 0,
    y: 0
}
let target = {
    x: 0,
    y: 0
}

const windowSize = {
    x: window.innerWidth,
    y: window.innerHeight
}

function ribbonsMooved(event) {
    mouse.x = (event.clientX - windowSize.x)
    mouse.y = (event.clientY - windowSize.y)

    // console.log(mouse.x);
}

const clock = new THREE.Clock()

const tick = () =>
{

    target.x = mouse.x * 0.001
    target.y = mouse.y * 0.001

    const elapsedTime = clock.getElapsedTime()*0.2

    finalMesh.rotation.y += .07 * (target.x - finalMesh.rotation.y)
    finalMesh.rotation.z += .07 * (target.y - finalMesh.rotation.z)

    // controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)

    doubleSideMaterials.forEach((m,i)=> {
        m.map.offset.setX(elapsedTime)
        if(i>0) {
            m.map.offset.setX(-elapsedTime)
        }
    })
}

tick()

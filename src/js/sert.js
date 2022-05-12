
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import * as dat from 'dat.gui'



// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('.sert_webgl')

// Scene
const scene = new THREE.Scene()
const gltfLoader = new GLTFLoader().setPath("../static/")
// import logo from '../../static/logo.png'

// let logoTexture = new THREE.TextureLoader().load(logo)

// let material = new THREE.MeshStandardMaterial({
//     map:logoTexture,
//     side: THREE.BackSide,
//     roughness: 0.1,
//     metalness: 0.5,
//     alphaTest: 1,
//     flatShading: true
// })
let cert = null
gltfLoader.load(`sert5.gltf`, (sert)=> {
    // const certificate = sert.scene.children[0]
    const certificate = sert.scene
    if(screen.width >= 560) {
        certificate.scale.set(9,9,9)
    } else {
        certificate.scale.set(6.5,6.5,6.5)
    }
    
    // certificate.position.z = -35;
    certificate.rotation.y = 1;
    certificate.position.y = -.8;
    cert = certificate
    scene.add(certificate)
    console.log(scene.children)
})

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
ambientLight.position.x = 2
ambientLight.position.y = 3
ambientLight.position.z = 4

const pointLight = new THREE.PointLight(0xffffff, .3)
pointLight.position.x = -1
pointLight.position.y = 1.5
pointLight.position.z = 4

const pointLight2 = new THREE.PointLight(0xffffff, .7)
pointLight2.position.x = -0.2
pointLight2.position.y = -3
pointLight2.position.z = 4
scene.add(ambientLight, pointLight, pointLight2)

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
        sizes.width = window.innerWidth 
    } else {
        sizes.width = window.innerWidth / 2
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
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


const clock = new THREE.Clock()

document.addEventListener('mousemove', certMooved)

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

function certMooved(event) {
    mouse.x = (event.clientX - windowSize.x)
    mouse.y = (event.clientY - windowSize.y)

    // console.log(mouse.x);
}


const tick = () =>
{
    if(cert)
    {
        target.x = mouse.x * -0.001
        target.y = mouse.y * -0.001

        cert.rotation.y += .05 * (target.x - cert.rotation.y)
        // cert.rotation. += .05 * (target.x - cert.rotation.y)
        // cert.rotation.z += .07 * (target.y / cert.rotation.y)
        // cert.rotation.y += .007 * (target.y - cert.rotation.z)
    }
        const elapsedTime = clock.getElapsedTime()*0.2


    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
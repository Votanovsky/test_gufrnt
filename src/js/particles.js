import '../style.css'

import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import gsap from 'gsap'

console.log(gsap);


import t from '../../static/three_end.jpg'
import t1 from '../../static/four_first.jpg'
import t2 from '../../static/four_end.jpg'
import t3 from '../../static/three_first.jpg'

const video = document.getElementById('video3')
const video2 = document.getElementById('video1')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    composer.setSize( sizes.width, sizes.height );
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.001, 5000)
camera.position.set(0,0,1500);
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    // canvas: canvas,
    canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Bloom
function postProcessing() {
    const renderScene = new RenderPass( scene, camera );
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( sizes.width, sizes.height ), 0, 0, 0 );
    const composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
    
    return composer 
}

/**
 * Animate
 */

const clock = new THREE.Clock()

let utime = 0;

const composer = postProcessing()
const bloomPass = composer.passes.at(-1)

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    utime+=0.05

    // Render
    composer.render()
    
    updateUniforms()
    // console.log(composer.passes[1].strength)
    
    window.requestAnimationFrame(tick)
}

tick()

function updateUniforms() {
    scene.traverse(function(child) {
        if (child instanceof THREE.Points
            && child.material.type === 'ShaderMaterial') {
            child.material.uniforms.time.value = utime;
            child.material.needsUpdate = true;
            
        }
    });
    
}

// Objects
const geometry = new THREE.PlaneBufferGeometry( 1920, 1080, 700, 600);

// Materials
const material = new THREE.ShaderMaterial({
    // extensions: {
    //     derivatives: "#extension GL_OES_standard_derivatives : enable"
    // },
    // side: THREE.DoubleSide,
    uniforms: {
        time: {type: "float", value: utime},
        progress: {type: "float", value: utime},
        distortion: {type: "float", value: 0},
        t: {type: "t", value: new THREE.TextureLoader().load(t2)},
        t1: {type: "t", value: new THREE.TextureLoader().load(t3)},
        resolution: {tupe: "v4", value: new THREE.Vector4()},
        uvRate1: {
            value: new THREE.Vector2(1,1)
        }
    },
    vertexShader:   document.getElementById('vertex-shader').textContent,
    fragmentShader: document.getElementById('fragment-shader').textContent

    
});

const material1 = new THREE.ShaderMaterial({
    // extensions: {
    //     derivatives: "#extension GL_OES_standard_derivatives : enable"
    // },
    // side: THREE.DoubleSide,
    uniforms: {
        time: {type: "float", value: utime},
        progress: {type: "float", value: utime},
        distortion: {type: "float", value: 0},
        t: {type: "t", value: new THREE.TextureLoader().load(t)},
        t1: {type: "t", value: new THREE.TextureLoader().load(t1)},
        resolution: {tupe: "v4", value: new THREE.Vector4()},
        uvRate1: {
            value: new THREE.Vector2(1,1)
        }
    },
    vertexShader:   document.getElementById('vertex-shader').textContent,
    fragmentShader: document.getElementById('fragment-shader').textContent

    
});

// Mesh
const mesh = new THREE.Points(geometry,material)
const mesh1 = new THREE.Points(geometry,material1)
if(screen.width >= 370 && screen.height >= 667)
{
    const newScale = [.9, .88, 1]
    mesh.geometry.scale(...newScale)
    mesh1.geometry.scale(...newScale)
}
if(screen.width >= 390 && screen.height >= 844)
{
    const newScale = [.9, .92, 1]
    mesh.geometry.scale(...newScale)
    mesh1.geometry.scale(...newScale)
}
if(screen.width >= 820)
{
    const newScale = [1.20, 1.30, 1]
    mesh.geometry.scale(...newScale)
    mesh1.geometry.scale(...newScale)
}

// gsap ===========
video.addEventListener('ended', ()=> {
    scene.add(mesh)
    gsap.to(video, {
        duration: 0.1,
        opacity: 0
    })
    gsap.to(material.uniforms.distortion, {
        duration: 3,
        value:2,
        ease: "power2.inOut"
    })

    gsap.to(material.uniforms.progress, {
        duration: 1,
        delay:1.5,
        value:1,
    })

    gsap.to(bloomPass, {
        duration: 2,
        strength:3,
        ease: "power2.in"
    })
    gsap.to(material.uniforms.distortion, {
        duration: 2,
        value:0,
        delay: 2,
        ease: "power2.inOut"
    })
    gsap.to(bloomPass, {
        duration: 2,
        strength:0,
        delay: 2,
        ease: "power2.out",
        onComplete:()=> {
            video2.currentTime = 0;
            video2.play()
            gsap.to(video2, {
                duration: 0.1,
                opacity: 1
            })
            gsap.to(material.uniforms.progress, {
                duration: 1,
                value:0,
            })
            scene.clear()
        }
    })
})

video2.addEventListener('ended', ()=> {
    scene.add(mesh1)
    gsap.to(video2, {
        duration: 0.1,
        opacity: 0
    })
    gsap.to(material1.uniforms.distortion, {
        duration: 3,
        value:1.5,
        ease: "power2.inOut"
    })

    gsap.to(material1.uniforms.progress, {
        duration: 1,
        delay:1.5,
        value:1,
    })

    gsap.to(bloomPass, {
        duration: 2,
        strength:2,
        ease: "power2.in"
    })
    gsap.to(material1.uniforms.distortion, {
        duration: 2,
        value:0,
        delay: 2,
        ease: "power2.inOut"
    })
    gsap.to(bloomPass, {
        duration: 2,
        strength:0,
        delay: 2,
        ease: "power2.out",
        onComplete:()=> {
            video.currentTime = 0;
            video.play()
            gsap.to(video, {
                duration: 0.1,
                opacity: 1
            })
            gsap.to(material1.uniforms.progress, {
                duration: 1,
                value:0,
            })
            scene.clear()
        }
    })
})
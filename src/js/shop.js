const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let spots = []
let hue = 0

const mouse = {
    x: undefined,
    y: undefined
}

document.addEventListener('mousemove', (e)=> {
    mouse.x = e.x
    mouse.y = e.y

    for(let i = 0; i < 2; i++) {
        spots.push(new Particle())

    }
})

class Particle{
    constructor() {
        this.x = mouse.x
        this.y = mouse.y
        this.size = Math.random()*2+0.1
        this.speedX = Math.random()*2-1
        this.speedY = Math.random()*2-1
        // this.color = 'hsl('+ hue +', 120%, 50%)'
        this.color = 'rgba(242, 45, 0, 0.15)'

    }

    update() {
        this.x += this.speedX   
        this.y += this.speedY   

        if(this.size>0.1) this.size -= 0.03
    }
    
    draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI *2)
        ctx.fill()
    }
}

function handleParticles() {
    for(let i = 0; i < spots.length; i++) {
        spots[i].update()
        spots[i].draw()

        for (let j =i; j<spots.length; j++) {
            const dx = spots[i].x - spots[j].x
            const dy = spots[i].y - spots[j].y

            const distance = Math.sqrt(dx*dx + dy*dy)
            if(distance < 50) {
                ctx.beginPath()
                ctx.strokeStyle = spots[i].color
                ctx.innerWidth = spots[i].size / 10
                ctx.moveTo(spots[i].x, spots[i].y)
                ctx.lineTo(spots[j].x, spots[j].y)
                ctx.stroke()
            }
        }
        if (spots[i].size  <= 0.09) {
            spots.splice(i, 1);
            i--
        }
    }
}
function animate() {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    handleParticles()
    hue++
    requestAnimationFrame(animate)
}
window.addEventListener('resize', function() {
    canvas.width = innerWidth
    canvas.height = innerHeight
    init()
})
window.addEventListener('mouseout', ()=> {
    mouse.x = undefined,
    mouse.y = undefined
})
animate()
window.addEventListener('load', () => {
    const layers = document.querySelectorAll('.carousel__wrapper')
    let start = null
    let checker = 0
    let offset = (window.innerWidth > 576) ? window.innerWidth : window.innerWidth * 2
    function step(frame)
    {
        if(!start) 
            start = frame
        let progress = frame - start
        if(progress / 8 >= checker)
        {
            layers[0].style.transform = 'translateX(0)'
            layers[1].style.transform = 'translateX(' + offset + 'px)'
            checker += offset
        }
        else
        {
            layers[0].style.transform = 'translateX(' + (checker - offset - progress / 8) + 'px)'
            layers[1].style.transform = 'translateX(' + (checker - progress / 8) + 'px)'
        }

        window.requestAnimationFrame(step)
    }

    window.requestAnimationFrame(step)
    window.addEventListener('resize', () => { offset = (window.innerWidth > 576) ? window.innerWidth : window.innerWidth * 2 })
})
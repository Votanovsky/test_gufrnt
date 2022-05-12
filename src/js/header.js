var nav = document.querySelector('.navigation');
var toggle = document.querySelector('.hamburger');
var navItems = nav.querySelectorAll('.navigation__link');

toggle.addEventListener('click', toggleNav);

function toggleNav() {

    // Show Nav
    nav.classList.toggle('active');
    
    // Transform Hamburger into 'X'
    toggle.classList.toggle('active');
    
    // Show Nav Items
    for (var i = 0, ii = navItems.length; i < ii; i++) {
        navItems[i].classList.toggle('active');
    }
}

// const li_items = document.querySelectorAll('.li_item')
// const li_lines = document.querySelectorAll('.li_line')

// li_items.forEach(e=> {
//     e.addEventListener('mousemove', ()=> {

//     })
// })

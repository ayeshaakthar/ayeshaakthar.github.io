const faqs = document.querySelectorAll('.faq_wrapper')

faqs.forEach((faq) => {
    faq.addEventListener('click', () => {
        faqs.forEach((faq) => {
            faq.classList.remove('faq_active')
        })
        faq.classList.add('faq_active')
    })
})

const ben_cards = document.querySelectorAll('.demo_details_card')

ben_cards.forEach((item) => {
    item.addEventListener('click', () => {
        ben_cards.forEach((item) => {
            item.classList.remove('demo_details_card_active')
        })
        item.classList.add('demo_details_card_active')
    })
})

// Toggle Mobile Menu
const menuBtn = document.querySelector('.mobile_menu_icon')
const nav = document.querySelector('.nav')

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('nav_active')
    
    if(menuBtn.classList.contains('fa-bars')) {
        menuBtn.classList.remove('fa-bars')
        menuBtn.classList.add('fa-xmark')
    }else{
        menuBtn.classList.add('fa-bars')
        menuBtn.classList.remove('fa-xmark')
    }
})
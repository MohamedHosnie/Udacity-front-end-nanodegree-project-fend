/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

"use strict";

const LandingPage = (() => {
    /**
     * Define Global Variables
     * 
    */

    let _document;
    let _window;

    let sections;
    let menu;
    let menuItems;

    let menu_link_class;
    let active_class;

    /**
     * End Global Variables
     * Start Helper Functions
     * 
    */

    // Create menu item for a specified section
    let createMenuItemForSection = (section) => {
        let sectionId = section.getAttribute('ID');

        let menuItemLink = _document.createElement('A');
        menuItemLink.textContent = section.dataset.nav;
        menuItemLink.classList.add(menu_link_class);
        menuItemLink.setAttribute('HREF', `#${sectionId}`);
        menuItemLink.dataset.target = sectionId;

        let menuItem = _document.createElement('LI');
        menuItem.dataset.section = sectionId;
        if(section.classList.contains(active_class)) menuItem.classList.add(active_class);
        menuItem.appendChild(menuItemLink);

        return menuItem;
    };
    
    // Get the top offset of an element relative to the whole document
    let getElementOffsetTop = (el) => {
        var rect = el.getBoundingClientRect(),
        scrollTop = _window.pageYOffset || _document.documentElement.scrollTop;
        return rect.top + scrollTop;
    };

    // Get the target section of a specified anchor in the nav menu
    let getTargetSection = (anchor) => {
        return Array.from(sections).find((section) => {
            return section.getAttribute('id') == anchor.dataset.target;
        });
    };

    // Make a scroll by a specified number of pixels from the top of the whole document
    let scrollTop = (sectionOffsetTop) => {
        _window.scrollTo({
            top: sectionOffsetTop - menu.offsetHeight,
            behavior: 'smooth'
        });
    };

    /**
     * End Helper Functions
     * Begin Main Functions
     * 
    */

    // build the nav
    // Build the menu dynamically for the number of sections in the page
    let buildNavMenu = () => {
        let menuFrag = _document.createDocumentFragment();
        for(const section of sections) {
            let menuItem = createMenuItemForSection(section);
            menuFrag.appendChild(menuItem);
        }
        menuItems = menu.getElementsByTagName('LI');
        menu.appendChild(menuFrag);
    };

    // Find the supposed to be active section based on the viewport
    let findActiveSection = () => {
        let tops = Array.from(sections).map((section) => {
            return Math.abs(section.getBoundingClientRect().top);
        });
        let min = Math.min(...tops);
        return sections[tops.indexOf(min)];
    };

    // Add class active_class to section when near top of viewport and to the nav menu item
    let addClassActiveToSection = (targetSection) => {
        let sectionId = targetSection.getAttribute('ID');

        for(const menuItem of menuItems) {
            if(menuItem.dataset.section == sectionId) {
                if(!menuItem.classList.contains(active_class))
                menuItem.classList.add(active_class)
            } else {
                menuItem.classList.remove(active_class);
            }
        }
        
        for(const section of sections) {
            section.classList.remove(active_class);
        }
        targetSection.classList.add(active_class);
    };

    // Scroll to anchor ID using scrollTO event
    let scrollToAnchorId = (anchor) => {
        let targetSection = getTargetSection(anchor);
        let sectionOffsetTop = getElementOffsetTop(targetSection);
        scrollTop(sectionOffsetTop);
    };


    /**
     * End Main Functions
     * Begin Events
     * 
    */

    let attachEvents = () => {
        // Scroll to section on link click
        menu.addEventListener('click', (ev) => {
            if(ev.target.nodeName === 'A' && ev.target.classList.contains(menu_link_class)) {
                ev.preventDefault();
                scrollToAnchorId(ev.target);
            }
        });

        // Set sections as active
        _document.addEventListener('scroll', () => {
            let activeSection = findActiveSection();
            addClassActiveToSection(activeSection);
        });

    };

    return {
        init: (options) => {
            _document = options.document;
            _window = options.window;
            sections = _document.querySelectorAll(options.sections_selector);
            menu = _document.querySelector(options.menu_selector);
            menu_link_class = options.menu_link_class;
            active_class = options.active_class;

            buildNavMenu();
            attachEvents();
        }
    };

})();

/**
 * Initialize component 
 * when DOM is loaded
*/

document.addEventListener('DOMContentLoaded', () => {
    LandingPage.init({
        document: document,
        window: window,
        sections_selector: 'section[data-nav]',
        menu_selector: '#navbar__list',
        menu_link_class: 'menu__link',
        active_class: 'active'
    });
});








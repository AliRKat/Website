(function($) {
    // DOM Elements
    const $window = $(window);
    const $body = $('body');
    const $wrapper = $('#wrapper');
    const $header = $('#header');
    const $banner = $('#banner');
    const $menu = $('#menu');

    // Breakpoints
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
    });

    // Parallax Background
    $.fn._parallax = (browser.name === 'ie' || browser.name === 'edge' || browser.mobile) ? function() { return $(this); } : function(intensity = 0.25) {
        if (!this.length || intensity === 0) return $(this);
        this.each(function() {
            const $element = $(this);
            const updatePosition = () => {
                const offset = $window.scrollTop() - $element.position().top;
                $element.css('background-position', `center ${offset * (-1 * intensity)}px`);
            };
            breakpoints.on('<=medium', () => $element.css('background-position', ''));
            breakpoints.on('>medium', updatePosition);
            $window.on('scroll._parallax', updatePosition);
        });
        return $(this);
    };

    // Initial Page Load Animations
    $window.on('load', () => {
        setTimeout(() => $body.removeClass('is-preload'), 100);
    });

    // Clear transitioning state on unload
    $window.on('unload pagehide', () => {
        setTimeout(() => $('.is-transitioning').removeClass('is-transitioning'), 250);
    });

    // Scrolly Links
    $('.scrolly').scrolly({
        offset: () => $header.height() - 2
    });

    // Banner Parallax
    if ($banner.length > 0) {
        $banner._parallax(0.275);
    }

    // Menu Handling
    const $menuInner = $('<div class="inner"></div>').appendTo($menu);
    $menu.wrapInner($menuInner);

    const lockDuration = 350;
    let menuLocked = false;
    const lockMenu = () => {
        if (menuLocked) return false;
        menuLocked = true;
        setTimeout(() => menuLocked = false, lockDuration);
        return true;
    };

    $menu.on('click', e => {
        e.stopPropagation();
        $body.removeClass('is-menu-visible');
    });

    $menuInner.on('click', e => e.stopPropagation());

    $body.on('click', '[href="#menu"]', e => {
        e.preventDefault();
        e.stopPropagation();
        if (lockMenu()) $body.toggleClass('is-menu-visible');
    }).on('click', () => $body.removeClass('is-menu-visible'))
      .on('keydown', e => {
        if (e.keyCode === 27) $body.removeClass('is-menu-visible');
    });

    $menu.append('<a class="close" href="#menu">Close</a>');

})(jQuery);
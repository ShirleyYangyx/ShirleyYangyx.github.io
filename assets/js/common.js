// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    var hasLazyPlugin = $.fn && (typeof $.fn.Lazy === 'function' || typeof $.fn.lazy === 'function');
    var hasMasonryPlugin = typeof $.fn.masonry === 'function';
    var hasImagesLoaded = typeof $.fn.imagesLoaded === 'function';
    var initLazy = function($elements, options) {
        if (typeof $elements.Lazy === 'function') {
            $elements.Lazy(options);
            return true;
        }
        if (typeof $elements.lazy === 'function') {
            $elements.lazy(options);
            return true;
        }
        return false;
    };

    if (hasLazyPlugin) {
        var lazyLoadOptions = {
            scrollDirection: 'vertical',
            effect: 'fadeIn',
            effectTime: 300,
            placeholder: "",
            onError: function(element) {
                console.log('[lazyload] Error loading ' + element.data('src'));
            },
            afterLoad: function(element) {
                if (element.is('img')) {
                    // remove background-image style
                    element.css('background-image', 'none');
                    element.css('min-height', '0');
                } else if (element.is('div')) {
                    // set the style to background-size: cover;
                    element.css('background-size', 'cover');
                    element.css('background-position', 'center');
                }
            }
        };

        try {
            var okNormal = initLazy($('img.lazy, div.lazy:not(.always-load)'), {visibleOnly: true, ...lazyLoadOptions});
            var okAlways = initLazy($('div.lazy.always-load'), {visibleOnly: false, ...lazyLoadOptions});
            hasLazyPlugin = okNormal || okAlways;
        } catch (e) {
            console.warn('[lazyload] Plugin initialization failed, falling back to eager data-src loading.', e);
            hasLazyPlugin = false;
        }
    }

    if (!hasLazyPlugin) {
        // Fallback: ensure lazy-marked images still load when plugin is unavailable or failed.
        $('img.lazy[data-src]').each(function() {
            var $img = $(this);
            if (!$img.attr('src') || $img.attr('src').indexOf('empty_300x200.png') !== -1) {
                $img.attr('src', $img.data('src'));
            }
        });
        $('div.lazy[data-src]').each(function() {
            var $div = $(this);
            $div.css('background-image', 'url("' + $div.data('src') + '")');
            $div.css('background-size', 'cover');
            $div.css('background-position', 'center');
        });
    }

    $('[data-toggle="tooltip"]').tooltip();

    if (hasMasonryPlugin && $('.grid').length > 0) {
        var $grid = $('.grid').masonry({
            "percentPosition": true,
            "itemSelector": ".grid-item",
            "columnWidth": ".grid-sizer"
        });
        // layout Masonry after each image loads
        if (hasImagesLoaded) {
            $grid.imagesLoaded().progress(function () {
                $grid.masonry('layout');
            });
        }

        $(".lazy").on("load", function () {
            $grid.masonry('layout');
        });
    }
});

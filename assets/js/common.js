// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    var hasLazyPlugin = typeof $.fn.Lazy === 'function';
    var hasMasonryPlugin = typeof $.fn.masonry === 'function';
    var hasImagesLoaded = typeof $.fn.imagesLoaded === 'function';

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

        $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
        $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});
    } else {
        // Fallback: ensure lazy-marked images still load when plugin is not enabled for this page.
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

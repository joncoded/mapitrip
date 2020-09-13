mapboxgl.accessToken = 'pk.eyJ1Ijoiam9uY29kZWQiLCJhIjoiY2tlN3g0eHRhMXJnbTJ2cDg1dnFmdGtlciJ9.LmG4I8KmIzqedp-5SYR3wQ';

var activeChapterName;

/* initialize base map */
var map = new mapboxgl.Map({
    container: 'map',
    style: config['basemap']['style'],
    center: config['basemap']['center'],
    zoom: config['basemap']['zoom'],
    bearing: config['basemap']['bearing'],
    pitch: config['basemap']['pitch']
});

/* load sections */
$(document).ready(function() {

    var template = $.trim($('#section-template').html());

    $('title').html(config['site']['title'] + ' - a Mapstory map');
    $('h1').html(config['site']['title']);
    $('p.intro').html(config['site']['intro']);

    $.each(chapters, function(index, o) {

        var heading = o['heading'];

        var paragraphs = '';        
        $.each(o['paragraphs'], function(index, p) {
            paragraphs += '<p>' + p + '</p>';
        });

        var readmore = '';
        if (o['readmore'] !== undefined) {
            readmore =  '<p>&rarr; <a href="' + o['readmore']['link'] + '">' + o['readmore']['label'] + '</a></p>';
        }

        var html = template
            .replace(/{{id}}/ig, index)
            .replace(/{{heading}}/ig, heading)
            .replace(/{{paragraphs}}/ig, paragraphs)
            .replace(/{{readmore}}/ig, readmore);
        
        $('main').append(html);

    });

    $('section').first().addClass('active');
    activeChapterName = $('.active').first().attr('id');

});

/* scroll event */
$(window).on('scroll', function () {
    var chapterNames = Object.keys(chapters);
    
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];        
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            break;
        }
    }
});

/* increase opacity to active chapter */

function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;

    map.flyTo(chapters[chapterName]);

    document.getElementById(chapterName).setAttribute('class', 'active');
    document.getElementById(activeChapterName).setAttribute('class', '');

    activeChapterName = chapterName;
}

/* helper method for determining location of scroll */
function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    var headerHeight = $('header').outerHeight();
    return bounds.top < window.innerHeight && bounds.bottom > headerHeight;
}

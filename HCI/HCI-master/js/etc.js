
$('#modal6').hover(function () {
    $('.calculator').css("background-color", "green");
    $('.calculator').hide();
}, function () {
    $('.calculator').css("background-color", "green");
    $('.calculator').show();

})

$(function () {

    function showMenu() {
        $('.subMenu:not(:last), #overlay').addClass('show')
    }

    function hideMenu() {
        $('.subMenu:not(:last)').removeClass('show');
        $('.subMenu:last')[0].tog = 0;
        window.setTimeout(function () {
            $('#overlay').removeClass('show');
        }, 300);
    }

    $('.subMenu:last').on('click', function () {
        (this.tog ^= 1) ? showMenu() : hideMenu();
    });

    $('#overlay').on('click', hideMenu);

});

    //위치값 알아내기
    // var html_position = $('html');
    // html_position.click(function (event) {
    //     x = event.clientX;
    //     y = event.clientY;
    //     alert('x좌표:' + x + ', y좌표:' + y);
    // })

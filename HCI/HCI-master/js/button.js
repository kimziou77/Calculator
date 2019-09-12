$(document).ready(function () {

    function selectText() {
        var selectionText = "";
        if (document.getSelection) {
            selectionText = document.getSelection();
        } else if (document.selection) {
            selectionText = document.selection.createRange().text;
        }
        return selectionText;
    }

    function openHelpModal() {
        $('.helpModal').removeClass('hidden');
        // $(".function_key").bind("click",keyhandling);
    }
    function closeHelpModal() {
        $('.helpModal').addClass('hidden');
    }
    $('.closeHelpModal').click(closeHelpModal);
    $('.modal_overlay').click(closeHelpModal);
    //function 버튼 클릭시 모달창 on

    if($('.par').hasClass('cont')){
        alert("색변경");
        $('.par').css("backgrond-color","gray");
    }

    var displayValue = "0";
    var parser = math.parser();
    var copy = "";
    var origin="";//괄호시작전
    var par="";//괄호
    var id=0;
    var exchange="";
    $('#result').text(displayValue);

    var history = [];//수식저장
    var historyEval = [];//결과저장


    // $('*').click(function(){
    //     alert($(this).attr('class'));
    // })
    $('.key,.key2').click(function (e) {
        // alert("key 가 눌렸습니다.");
        // console.log($(this).hasClass('history_key'));
        if ($(this).text() == 'EV') {
            try {
                $('.par').removeClass('atv');
                history.push(displayValue.toString());
                
                if(displayValue.indexOf("ln") + 1) {//없으면 -1이출력됨
                    // console.log(displayValue.indexOf("ln"));
                    exchange = displayValue.replace('ln', 'log');
                    // console.log(exchange);
                }
                if (displayValue.indexOf("√") + 1) {
                    exchange = displayValue.replace('√', 'sqrt');
                    // console.log(exchange);
                }
                if (displayValue.indexOf("°") + 1) {
                    exchange = displayValue.replace('°', 'deg')                    
                    // console.log(exchange);
                }
                if(exchange.length){
                    displayValue = parser.eval(exchange).toString();
                }
                else{
                    displayValue = parser.eval(displayValue).toString();
                }
                var tokens = displayValue.split(' ');

                $('#latex').text(displayValue);
                historyEval.push(displayValue);//히스토리에 계산결과 등록

                // console.log(history);
                // console.log(historyEval);
                if (tokens[0] == 'function') {
                    displayValue = tokens[0];
                    $('#latex').text(displayValue);
                    displayValue = "";
                    historyEval[historyEval.length - 1]='function';
                }//함수일 때

                    $('.history').append($('<button/>', {
                        class: 'hk',
                        text: history[history.length - 1] + ' = ' + historyEval[historyEval.length - 1]
                    }));
                    // $('.history_key').addClass('function_key');
            }
            catch (e) {
                displayValue = '0';
                if (displayValue != 'function') {
                    console.log($('#result').text(e));
                }
                let tmp = "error : check your expression";
                $('#latex').text(tmp);
            }
        }
        else if ($(this).text() == 'CL') {
            $('.par').removeClass('atv');
            displayValue = '0';
            $('#result').text(displayValue);
            $('#latex').text(tmp);
        }
        else if ($(this).text() == 'save') {
            $('.history').append($('<button/>', {
                type: 'Button',
                class: 'key history_key',
                text: $('#result').text()
            }));
        }
        else if ($(this).text() == '?') {
            openHelpModal();
        }
        else if ($(this).text() == '<') {
            var tmp = "";

            switch (displayValue[displayValue.length - 1]) {//마지막 글자가
                case 'n':
                case 's':
                    for (let i = 0; i < displayValue.length - 3; i++) {
                        tmp += displayValue[i];
                    }
                    break;//tan,sin && cos 일 경우 3글자를 지움.

                case 'h':
                    for (let i = 0; i < displayValue.length - 4; i++) {
                        tmp += displayValue[i];
                    }
                    break;//h가 붙은 경우. 4글자를 지움.
                default:
                    for (let i = 0; i < displayValue.length - 1; i++) {
                        tmp += displayValue[i];
                    }
                    break;//나머지는 그냥 하나 지움.

            }
            displayValue = tmp;
            $('#inputText').val(displayValue);
            $('#result').text(displayValue);
            //이걸 누르면 글자가 하나가 사라짐
        }
        else if ($(this).text() == 'c/p') {
            if(document.getSelection())
            {
                let txt = selectText();
                if (window.getSelection) {
                    txt = window.getSelection();
                    if (txt.toString() != ""){
                        copy = txt.toString();
                        $('.history').append($('<button/>', {
                            type: 'Button',
                            class: 'key history_key',
                            text: txt
                        }));
                    }
                    else
                    {
                        displayValue = displayValue + copy;
                        $('#result').text(displayValue);
                    }
                }
            }
        }
        else if ($(this).text() == 'inv') {
            displayValue = 'inv(' + displayValue + ')';
            $('#result').text(displayValue);
        }
        else if ($(this).text() == 'det') {
            displayValue = 'det(' + displayValue + ')';
            $('#result').text(displayValue);
        }
        else if ($(this).text() == 'cross') {
            displayValue = 'cross(' + displayValue + ')';
            $('#result').text(displayValue);
        }
        else if ($(this).text() == 'cont') {
            $('.calculator *').toggleClass('cont');
        }
        else if ($(this).text()=='clear'){
            $('.history').empty();
        }
        else if ($(this).text() == 'load') {
            displayValue = history[history.length - 1];
            $('#result').text(displayValue);
        }
        else if ($(this).hasClass('atv')) {
            $(this).removeClass('atv');
            par = "";
        }
        else if ($('.par').hasClass('atv') === true) {
            if (origin[0] == '0') {
                origin = "";
            }
            par = par + $(this).text();
            displayValue = displayValue + $(this).text();
            console.log(id);
            if(id==3){
                displayValue = origin + '(' + par + ')';
            }
            else{
                displayValue = origin + '[' + par + ']';
            }
            $('#result').text(displayValue);
        }
        else if ($(this).text() == '[]') {
            id=5;
            $('#square').addClass('atv');
            origin = displayValue;//이거가 한번만 저장되어야 하는데
            par = "";
        }
        else if ($(this).text() == '()') {
            id=3;
            $('#round').addClass('atv');
            origin = displayValue;//이거가 한번만 저장되어야 하는데
            par = "";
        }
        else if ($(this).text() == '[ ]') {
            displayValue = '[' + displayValue + ']';
            $('#result').text(displayValue);
        }
        else if ($(this).text() == '( )') {
            displayValue = '(' + displayValue + ')';
            $('#result').text(displayValue);
        }
        else if ($(this).hasClass("operator") === true)//중복된 operator는 나중에 입력한 operator로 대체됨
        {
            //입력되어 있는 마지막 값이 +-/* 이라면 다음을 실행
            switch (displayValue[displayValue.length - 1]) {
                case '+':
                case '-':
                case '/':
                case '*':
                    let tmp = "";
                    for (let i = 0; i < displayValue.length - 1; i++) {
                        tmp += displayValue[i];
                    }
                    displayValue = tmp;
                    displayValue += $(this).text();
                    $('#result').text(displayValue);
                    break;
                default:
                    displayValue += $(this).text();
                    $('#inputText').val(displayValue);
                    $('#result').text(displayValue);
                    break;
            }
        }
        else {
            let tmp=$(this).text();
            if (displayValue[0] == '0'){
                displayValue = "";
            }
            if ($(this).text() == 'f'|| $(this).text() == 'g'){
                displayValue = "";
            }
            if($(this).text()=='arc')
            {
                tmp='a';
            }
            displayValue = displayValue + tmp;
            $('#result').text(displayValue);
        }
    })

    // function handler(event){
    //     var $target = $(event.target);
    //     if ($target.is("button")) {
    //         $target.children().toggle();
    //     }
    // }
    


    $('.history').click(function(event){

        // alert("키가눌림");
        let tmp = $(event.target).text();
        // console.log(tmp);
        console.log($(this).hasClass('cont'));//-1
        if($('#latex').hasClass('cont')==(-1)){//아무거나싸잡아서 cont를 가지고 있지않다면
            // alert("비워진다");
            displayValue = "";//비우고 시작
        }
        displayValue = "";//비우고 시작



        
        console.log(n_indexOf(tmp, "=", 2));

        if(tmp[0]=='f'||tmp[0]=='g')//함수라면 두번째 = 까지 복사
        {
            for (let i = 0; i < n_indexOf(tmp,"=",2)-1; i++) {
                // console.log(i);
                displayValue = displayValue + tmp[i];//카피한다.
            }
        }
        else if (tmp.indexOf("=")+1){//없으면 -1 있으면 1 

            for (let i = 0; i < tmp.indexOf("=") - 1; i++) {
                // console.log(i);
                displayValue = displayValue + tmp[i];//카피한다.
            }
        }
        else{
            displayValue = displayValue + tmp;
        }
        $('#result').text(displayValue);
        return false;
    })

    function n_indexOf(str,searchvalue,nth){
        var times=0; num=null;
        
        while(times<nth && num !==-1)
        {
            num=str.indexOf(searchvalue,num+1);
            times++;
        }
        return num;
    }
    
})
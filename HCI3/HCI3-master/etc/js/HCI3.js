$(document).ready(function () {
    const parser = math.parser();
    var parVal;//히스토리에 저장할 parval입니다.ㅜ
    var history = [];//수식저장
    var historyEval = [];//결과저장


    function IOC(){
        input();
        output();
        clearValue();
    }

    $('.input').click(function (e) {
        IOC();
        execute();
    })

    $('.hisdel').click(function (e) {
        console.log("hisdel 눌림!!");
        $('.user_chat[type="text"]').val(""); 
        $('.hhssttrr').empty();
        $('.display').text("");
        $('.display').append($('<p/>', {
            class: 'save button',
            text: "SAVE"
        }));
        history = [];
        historyEval = [];
        // <p class="button hisdel">reset</p>
    })

    $('.hhssttrr').click(function(event){
        // console.log("history click");
        let tmp = $(event.target).text();
        let input = document.getElementsByClassName("user_chat")[0];
        console.log(tmp);
        
        input.value=input.value+tmp;

    })
    // $('html').css({ 'cursor': 'url(../img/miniLion.png), auto' });
    $('.tb_2').click(function (event) {
        let tmp=""
        console.log(this.text());
        if ($(event.target).hasClass('cross')) {
            //변수하나만들어서 for문으로 row와 col에 넣은 값들을 넣어준다음에 저기 안에 넣어주기
            tmp = "cross" + "([" + "])"; //이 안에 괄호쌍에 따라
            $('.user_chat').val(tmp);
        }
        else if ($(event.target).hasClass('det')) {
            tmp = "det" + "([" + "])";
            $('.user_chat').val(tmp);
        }
        else if ($(event.target).hasClass('submit')) {
            tmp = "[" + "]";
            $('.user_chat').val(tmp);
        }
        

    })

var row=0;
var col=0;
    $('.submit').click(function(e){
        // alert("submitted");
        $('.submit').css('background-color', 'rgba(0, 0, 0, 0.6)');
        // $('.make > table').addClass('hidden');
        row = document.getElementsByClassName("row")[0];
        col = document.getElementsByClassName("col")[0];
        console.log("row ; ",row.value,"col ; ",col.value);
        $('.second_step').empty();
        $('.second_step').append($('<table/>', {
            class: 'tb'
        }));
        for(let i=0;i<row.value;i++)
        {
            $('.tb').append($('<tr/>', {
                class: 'tr'+i
            }));

            for(let j=0;j<col.value;j++)
            {
                $('.tr'+i).append($('<td/>', {
                    class: 'td'+i
                }));
            }
            $('.td' + i).append($('<input/>', {
                class: 'make2'
            }));
        }

        ///////////////////////////////
        $('.second_step').append($('<table/>', {
            class: 'tb_2'
        }));
        $('.tb_2').append($('<tr/>', {
            class: 'tr_2'
        }));


        $('.tr_2').append($('<td/>', {
            class: 'td_2 cross',
            text: "cross"
        }));
        $('.tr_2').append($('<td/>', {
            class: 'td_2 det',
            text: "det"
        }));
        $('.tr_2').append($('<td/>', {
            class: 'td_2 submit submit2',
            text: "submit"
        }));
    })

    $('.make').click(function(event){
        if($(event.target).hasClass('submit2')){
            // console.log("submit2 버튼 눌림");
            let tr=$('.td0 make2').value;
            let td=tr.children().value;
            var tdArr=new Array();
            console.log("클릭한 row의 모든 데이터 ; ", tr);
            console.log("클릭한 col의 모든 데이터 ; ",td);
            td.each(function(i){
                tdArr.push(td.eq(i).text());
            });
            console.log("배열에 담긴 값 : ",tdArr);

        }


    })

    $('.del').click(function (e) {
        $('.user_chat[type="text"]').val("");
    })

    function execute(e) {
        try {
            let parseVal = "";
            //selected.name을 불러와서 parse해주기
            parseVal = parser.eval(parVal).toString();

            if (parseVal == "false") {
                parseVal = "false";
            }
            else if (parseVal[0] == 'f') {
                parseVal = "function";
            }
            //display
            console.log(parseVal);
            $('.display').text(parseVal);
            $('.display').append($('<p/>', {
                class: 'save button',
                text: "SAVE"
            }));


        }
        catch (e) {
            $('.display').text(e);
            
            // alert(e);
        }
    }


    $('li').click(function (event) {

        let input = document.getElementsByClassName("user_chat")[0];
        parVal = input.value;
        if(parVal==undefined)
        {
            parVal = "";
        }
        
        let tmp = $(event.target).text();

        
        parVal = parVal + tmp;



        if(tmp[0]=='E')
        {
            IOC();
            execute();
        }
        else{
            $('.user_chat').val(parVal);
        }
        
        parVal="";

        return false;
    })

    function n_indexOf(str, searchvalue, nth) {
        var times = 0; num = null;

        while (times < nth && num !== -1) {
            num = str.indexOf(searchvalue, num + 1);
            times++;
        }
        return num;
    }

    function input() {
        let input = document.getElementsByClassName("user_chat")[0];
        parVal = input.value;
    }

    function output() {
        if (history.length > 9) {
            history.splice(0, 1);
            historyEval.splice(0, 1);
        }
            history.push(parVal);
            historyEval.push(parVal);//히스토리에 계산결과 등록
            $('.hhssttrr').empty();
            for (let i=history.length-1;i>=0;i--)
            {
                $('.hhssttrr').append($('<p/>', {
                    class: 'history',
                    text: history[i]
                }));
            }
    }

    function scrollLink(obj) {

        var position = $("#" + obj).offset();
        $('html, body').animate({ scrollTop: position.top }, 2000);

    }
    function clearValue() {
        // console.log("clearValue 실행");
        $('.user_chat[type="text"]').val(""); 
    }

    $(".user_chat").keypress(function (e) {
        if (e.which == 13) {//enter이면 IOC 함수 실행
            IOC();
            execute();
            $(".miniLion").animate({opacity: 0.3},200,function(e){});
            $(".miniLion").animate({ opacity: 0.6 }, 50, function (e) { });
            $(".miniLion").animate({ opacity: 0.3 }, 100, function (e) { });
            $(".miniLion").animate({ opacity: 0 }, 200, function (e) { });

        }
    });

    $('.display').click(function(event){
        console.log("p버튼은 눌림");
        if($(event.target).text()=="SAVE")
        {

            let input = document.getElementsByClassName("display")[0];
            console.log("input : ",input);

            let pp=""
            parVal = $('.display').text();
            for (let i = 0; i < parVal.length - 4; i++) {
                pp += parVal[i];
            }

            parVal=pp;
            console.log("parVal : ", parVal);
            if (history.length > 9) {
                history.splice(0, 1);
                historyEval.splice(0, 1);
            }
            history.push(parVal);
            historyEval.push(parVal);//히스토리에 계산결과 등록
            $('.hhssttrr').empty();
            for (let i = history.length - 1; i >= 0; i--) {
                $('.hhssttrr').append($('<p/>', {
                    class: 'history',
                    text: history[i]
                }));
            }
        }
        
    })


    $('.mat').click(function(){
        $('.make').css('display', 'block');
    })

    $('.key').click(function (event) {
            let input = document.getElementsByClassName("user_chat")[0];
            parVal = input.value;
            if (parVal == undefined) {
                parVal = "";
            }
        let tmp = $(event.target).children().eq(0).text();

            console.log(tmp);
            parVal = parVal + tmp;

            if (tmp[0] == 'E') {
                IOC();
                execute();
            }
            else {
                $('.user_chat').val(parVal);
            }

        parVal = "";
    })

})
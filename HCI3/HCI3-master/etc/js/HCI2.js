const parser = math.parser();
const SYMBOL_WIDTH = 50;
const SYMBOL_HEIGHT = 50;
let MathApp = {};
var errorRange = 5;
MathApp.symbol_paths = {
    '√': "./etc/img/sqrt",
    '°': "./etc/img/deg",
    '+': "./etc/img/add",
    '-': "./etc/img/sub",
    '*': "./etc/img/mul",
    '/': "./etc/img/div",
    '(': "./etc/img/parenthesis_open",
    ')': "./etc/img/parenthesis_close",
    '[': "./etc/img/squarebracket_open",
    ']': "./etc/img/squarebracket_close",
    '{': "./etc/img/curlybrace_open",
    '}': "./etc/img/curlybrace_close",
    '.': "./etc/img/period",
    ',': "./etc/img/comma",
    ':': "./etc/img/colon",
    ';': "./etc/img/semicolon",
    '=': "./etc/img/equal",
    '>': "./etc/img/more",
    '<': "./etc/img/less",
    '!': "./etc/img/exclamation"
};

MathApp.blocks = [];
MathApp.selected_block = null;
MathApp.is_mouse_dragging = false;
MathApp.mouse_drag_prev = { x: 0, y: 0 };

MathApp.block_types = {
    UNDEFINED: "undefind",
    SYMBOL: "symbol"
};

MathApp.initialize = function () {
    for (let i = 0; i <= 9; i++) {
        let key = i.toString();//TODO: 그런데 toString 하면 얘는 문자열인데,
        let value = "./etc/img/" + key;
        this.symbol_paths[key] = value;//TODO: 여기서 [key] 하면 indexing 할 수 있나? 왜 value 변수를 따로 만들어서 여기에 저장하는거지?
        //TODO: 여기서의 symbol_paths의 [key] 이거는 인덱스가 아니라 '1' : '1' 이런 것을 만들기 위함이라 그런건가? 그렇다고 해도 왜 value값을 넣었는지는 의문인데,,
    }
    for (let c = "a".charCodeAt(0); c <= "z".charCodeAt(0); c++) {
        let key = String.fromCharCode(c);
        let value = "./etc/img/" + key;
        this.symbol_paths[key] = value;
    }
    this.canvas = new fabric.Canvas("c", {
        backgroundColor: "rgb(192, 213, 219)",
        hoverCursor: "pointer",//TODO:원래는 default 였음
        selection: false
    });
    //TODO: hover시에 바뀌는 무언가도 해줬으면 좋겠는데
    //
    $(document).keypress(function (event) {
        let key = String.fromCharCode(event.which);
        MathApp.handleKeyPress(key);
    });
    $(document).mousedown(function (event) {
        let p = { x: event.pageX, y: event.pageY };
        MathApp.handleMouseDown(p);
    });
    $(document).mouseup(function (event) {
        let p = { x: event.pageX, y: event.pageY };
        MathApp.handleMouseUp(p);
    });
    $(document).mousemove(function (event) {
        let p = { x: event.pageX, y: event.pageY };
        MathApp.handleMouseMove(p);
    });
}
MathApp.handleKeyPress = function (key) {
    if (key in this.symbol_paths) //symbol_path 안에 있는 key라면, 생성한다.
    {
        let size = {
            width: SYMBOL_WIDTH,
            height: SYMBOL_HEIGHT
        };
        let position = {
            x: Math.random() * (this.canvas.width - size.width) + size.width / 2,
            y: Math.random() * (this.canvas.height - size.height) + size.height / 2
        };
        let new_symbol = new MathApp.Symbol(position, size, key);
    }
    else {
        $('.error').text("Press another key");
        console.log("press another key");
    }
}
MathApp.handleMouseDown = function (window_p) {
    if (MathApp.isInCanvas(window_p)) {
        let canvas_p = MathApp.transformToCanvasCoords(window_p);
        if (MathApp.selected_block != null) {
            MathApp.selected_block.onDeselected();
            MathApp.selected_block = null;
        }
        let block = MathApp.findBlockOn(canvas_p);
        if (block != null) {
            MathApp.selected_block = block;
            MathApp.selected_block.onSelected();
        }
        MathApp.is_mouse_dragging = true;
        MathApp.mouse_drag_prev = canvas_p;
        MathApp.canvas.requestRenderAll();
    }
    else {
        MathApp.is_mouse_dragging = false;
        MathApp.mouse_drag_prev = { x: 0, y: 0 };
    }
}
MathApp.handleMouseMove = function (window_p) {
    if (MathApp.is_mouse_dragging) {
        let canvas_p = MathApp.transformToCanvasCoords(window_p);
        if (MathApp.selected_block != null) {
            let tx = canvas_p.x - MathApp.mouse_drag_prev.x;
            let ty = canvas_p.y - MathApp.mouse_drag_prev.y;
            MathApp.selected_block.translate({ x: tx, y: ty });
        }
        MathApp.mouse_drag_prev = canvas_p;
        MathApp.canvas.requestRenderAll();
    }
}
MathApp.handleMouseUp = function (window_p) {
    let canvas_p = MathApp.transformToCanvasCoords(window_p);
    let block = MathApp.findBlockOn(canvas_p);
    if (block != null) { //만약 선택된 블럭이 있으면
        MathApp.Collision();//충돌검사
    }
    if (MathApp.is_mouse_dragging) {
        MathApp.is_mouse_dragging = false;
        MathApp.mouse_drag_prev = { x: 0, y: 0 };
    }
    MathApp.canvas.requestRenderAll();
}
MathApp.transformToCanvasCoords = function (window_p) {
    let rect = MathApp.canvas.getElement().getBoundingClientRect();
    let canvas_p = {
        x: window_p.x - rect.left,
        y: window_p.y - rect.top
    };
    return canvas_p;
}
MathApp.isInCanvas = function (window_p) {
    let rect = MathApp.canvas.getElement().getBoundingClientRect();
    if (window_p.x >= rect.left &&
        window_p.x < rect.left + rect.width &&
        window_p.y >= rect.top &&
        window_p.y < rect.top + rect.height) {
        return true;
    }
    else {
        return false;
    }
}

MathApp.findBlockOn = function (canvas_p) {
    let x = canvas_p.x;
    let y = canvas_p.y;
    for (let i = 0; i < this.blocks.length; i++) {
        let block = this.blocks[i];
        if (x >= block.position.x - block.size.width / 2 &&
            x <= block.position.x + block.size.width / 2 &&
            y >= block.position.y - block.size.height / 2 &&
            y <= block.position.y + block.size.height / 2) {
            return block;
        }
    }
    return null;
}


//FIXME: 내가 만든 함수임 ㅎㅎ
MathApp.Collision = function () {
    //내가 선택한 블럭이 다른 블럭들과의 거리가 설정값 이상일 때, 두 블럭을 합친다
    if (MathApp.selected_block != null) {
        let select = MathApp.selected_block;

        for (let i = 0; i < this.blocks.length; i++) {
            let block = this.blocks[i];
            let disX = Math.abs(select.position.x - block.position.x);//두개의 차이가 blocksize/2보다 작을때
            let disY = Math.abs(select.position.y - block.position.y);
            let rangeX = (select.size.width / 2) + (block.size.width / 2);
            if ((disX == 0) && (disY == 0)) continue;//자기 자신은 검사에서 제외 해줘야 함!
            else if ((disX <= (rangeX + errorRange)) && (disY <= (block.size.height + errorRange))) {
                MathApp.canvas.requestRenderAll();
                MathApp.Assemble(i); //만약 거리 이내에 블럭이 있다면, 합친다
                // console.log("충돌!");
            }
            else {
                // console.log("안 충돌!");
            }
        }
        // console.log("===========================");
    }

}
MathApp.Assemble = function (idx) {
    // I want merge selected_block && blocks[idx];
    if (MathApp.selected_block != null) {
        let s = MathApp.selected_block;
        let b = this.blocks[idx];

        console.log("s.size.width: ", s.size.width);
        console.log("b.size.width: ", b.size.width);
        let size = {
            width: s.size.width + b.size.width,
            height: s.size.height
        };
        let position = {//block 위치 그대로
            x: b.position.x,
            y: b.position.y
        };
        let new_symbol = new MathApp.Symbol(position, size, b.name + s.name);
        b.destroy();
        s.destroy();//합친 블럭을 생성하고, 기존 두개의 블럭을 없앤다.
        MathApp.selected_block = null;
    }

}

MathApp.Disassemble = function () {
    let select = MathApp.selected_block;
    for (let i = 0; i < select.name.length; i++) {
        let plus = 50 * i;
        let size = {
            width: SYMBOL_WIDTH,
            height: SYMBOL_HEIGHT
        };
        let position = {
            x: select.position.x - select.size.width / 2 + 5 + plus,
            y: select.position.y
        };
        let new_symbol = new MathApp.Symbol(position, size, select.name[i]);//선택된 블럭의 이름하나하나 블럭을 쪼개준다.
    }
    MathApp.selected_block.destroy();//맨처음 블럭은 없애준다.
}
MathApp.Symbol = function (position, size, name) {
    // console.log("symbol 함수 실행");
    $('.error').text("");

    console.log("name : ", name);
    MathApp.Block.call(this, position, size);//블럭생성함수를 호출함.
    //
    this.type = MathApp.block_types.SYMBOL;
    this.name = name;
    let block = this;
    //네임을 배열별로 잘라서..
    if (name in MathApp.symbol_paths) //만약 symbol_paths에 있는 이름이라면
    {
        let path = MathApp.symbol_paths[name] + ".jpg";
        fabric.Image.fromURL(path, function (img) {
            // (0) Background
            let background = new fabric.Rect({
                left: position.x - size.width / 2,
                top: position.y - size.height / 2,
                width: size.width,
                height: size.height,
                fill: "rgba(255,255,255,1)",
                stroke: "rgba(0,0,0,0)",
                selectable: false
            });
            // (1) Image
            img.scaleToWidth(size.width);
            img.scaleToHeight(size.height);
            let img_w = img.getScaledWidth();
            let img_h = img.getScaledHeight();
            img.set({
                left: position.x - img_w / 2,
                top: position.y - img_h / 2,
                selectable: false
            });
            // (2) Boundary
            let boundary = new fabric.Rect({
                left: position.x - size.width / 2,
                top: position.y - size.height / 2,
                width: size.width,
                height: size.height,
                fill: "rgba(0,0,0,0)",
                stroke: "gray",
                strokeWidth: 5,
                selectable: false
            });
            //
            MathApp.canvas.add(background);
            MathApp.canvas.add(img);
            MathApp.canvas.add(boundary);
            //
            block.visual_items.push(background);
            block.visual_items.push(img);
            block.visual_items.push(boundary);
        });
    }
    else {
        //해당하는 이름의 img 파일이 없다면 else 실행
        let background = new fabric.Rect({
            left: position.x - size.width / 2,
            top: position.y - size.height / 2,
            width: size.width,
            height: size.height,
            fill: "rgba(255,255,255,1)",
            stroke: "rgba(0,0,0,0)",
            selectable: false
        });

        MathApp.canvas.add(background);
        block.visual_items.push(background);

        for (let i = 0; i < name.length; i++) {//name index 별로... 하나하나 모두 생성...
            console.log(name[i]);
            let path = MathApp.symbol_paths[name[i]] + ".jpg";
            fabric.Image.fromURL(path, function (img) {
                // (1) Image
                img.scaleToWidth(50);
                img.scaleToHeight(50);
                let img_w = img.getScaledWidth();
                let img_h = img.getScaledHeight();
                let plus = 50 * i;

                // img.set({
                //     left: Math.random() * (this.canvas.width - size.width) + size.width / 2,
                //     top: Math.random() * (this.canvas.height - size.height) + size.height / 2,
                //     selectable: false
                // });

                img.set({
                    left: position.x - size.width / 2 + errorRange + plus,
                    top: position.y - (img_h / 2),
                    selectable: false
                });

                // (2) Boundary
                let boundary = new fabric.Rect({
                    left: position.x - size.width / 2,
                    top: position.y - size.height / 2,
                    width: size.width,
                    height: size.height + 2,
                    fill: "rgba(0,0,0,0)",
                    stroke: "gray",
                    strokeWidth: 6,
                    selectable: false
                });

                MathApp.canvas.add(img);
                block.visual_items.push(img);//TODO: 이미지들을 누적시키고 싶어 이거 없으면 도장찍히듯이 남아버림 ㅠㅠ
                MathApp.canvas.add(boundary);
                block.visual_items.push(boundary);
            })
        }
    }
}
MathApp.execute = function (e) {
    try {
        let parseVal = "";
        let tmpButton = MathApp.selected_block;
        //selected.name을 불러와서 parse해주기
        parseVal = parser.eval(tmpButton.name).toString();

        if (parseVal == "false") {
            parseVal = "false";
        }
        else if (parseVal[0] == 'f') {
            // console.log("parseVal:",parseVal);
            // console.log("this is funciton");
            parseVal = "function";
        }

        SYMBOL_WIDTH * parseVal.length
        let size = {
            width: SYMBOL_WIDTH * parseVal.length,
            height: SYMBOL_HEIGHT
        };
        let position = {
            x: Math.random() * (this.canvas.width - size.width) + size.width / 2,
            y: Math.random() * (this.canvas.height - size.height) + size.height / 2
        };
        let new_symbol = new MathApp.Symbol(position, size, parseVal);
        MathApp.canvas.requestRenderAll();
    }
    catch (e) {

        $('.error').text(e);
        console.log(e);
    }
}

MathApp.duplicate = function () {
    let tmpButton = MathApp.selected_block;
    let size = {
        width: tmpButton.size.width,
        height: tmpButton.size.height
    };
    let position = {
        x: Math.random() * (this.canvas.width - size.width) + size.width / 2,
        y: Math.random() * (this.canvas.height - size.height) + size.height / 2
    };
    let new_symbol = new MathApp.Symbol(position, size, tmpButton.name);
}


MathApp.Block = function (position, size) {
    this.position = position;
    this.size = size;
    this.type = MathApp.block_types.UNDEFINED;
    this.visual_items = [];
    MathApp.blocks.push(this);
}
MathApp.Block.prototype.onDeselected = function () {
    this.visual_items[this.visual_items.length - 1].set({
        stroke: "gray"
    });
}
MathApp.Block.prototype.onSelected = function () {
    this.visual_items[this.visual_items.length - 1].set({
        stroke: "rgb(255, 240, 35)"
    });
    this.visual_items.forEach(item => {
        MathApp.canvas.bringToFront(item);
    });
}
MathApp.Block.prototype.moveTo = function (p) {
    let tx = p.x - this.position.x;
    let ty = p.y - this.position.y;
    this.translate({ x: tx, y: ty });
}
MathApp.Block.prototype.translate = function (v) {
    this.position.x += v.x;
    this.position.y += v.y;
    this.visual_items.forEach(item => {
        item.left += v.x;
        item.top += v.y;
    });
}
MathApp.Block.prototype.destroy = function () {
    if (this == MathApp.selected_block) {
        MathApp.selected_block = null;
        this.onDeselected();
    }
    this.visual_items.forEach(item => {
        MathApp.canvas.remove(item);
    });
    this.visual_items = [];

    let index = MathApp.blocks.indexOf(this);
    if (index > -1) {
        MathApp.blocks.splice(index, 1);
    }
}

MathApp.Symbol.prototype = Object.create(MathApp.Block.prototype);
$(document).ready(function () {
    MathApp.initialize();

    $('.quick').click(function (e) {
        let text = $(this).text();
        let size = {
            width: SYMBOL_WIDTH * text.length,
            height: SYMBOL_HEIGHT
        };
        let position = {//randomposition
            x: Math.random() * (MathApp.canvas.width - size.width) + size.width / 2,
            y: Math.random() * (MathApp.canvas.height - size.height) + size.height / 2
        };
        let new_symbol = new MathApp.Symbol(position, size, text);
    })

    $('.menu').click(function (e) {
        // console.log("click");
        if ($(this).text() == '실행') {
            MathApp.execute();
        }
        else if ($(this).text() == '삭제') {
            MathApp.selected_block.destroy();
        }
        else if ($(this).text() == '복제') {
            MathApp.duplicate();
        }
        else if ($(this).text() == '분해') {
            MathApp.Disassemble();
        }
        else if ($(this).text() == '전체삭제') {
            let blocks = MathApp.blocks;
            for (let i = blocks.length - 1; i >= 0; i--) {
                blocks[i].destroy();
            }
        }
    })
});
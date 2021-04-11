const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

/*
var cx = 4;
var cy = 0;
var symbols = ["→", "∧", "∨", "￢", "p", "q"];
var symbolC = "p";
var hantei = [];　// E 空　// その他（symbols）
var eraseHantei = []; //0 消す  1消さない
var phase = 1; // 1:落下中　2:ブロック消し中 
var keyHantei = 0; //0;　そのフェーズでまだ押してない　1;もう押した  
var chain = 0;
var maxChain = 0;
var chainHantei = 1;//１続ける　０続けない

for (var y = 0; y < 22; y++) {  //判定初期化
    var hantei2 = [];
    var eraseHantei2 = [];
    for (var x = 0; x < 10; x++) {
        hantei2.push("E");
        eraseHantei2.push(1);
    }
    hantei.push(hantei2);
    eraseHantei.push(eraseHantei2);
}
*/
var SCORE = 0
function score_update() { // 画面上部にSCOREを表示
    ctx.fillStyle = 'red';
    ctx.fillRect(100, 25, 150, 50);
    // ctx.fillStyleで色を指定
    // ctx.fillRectで長方形を描画する。 座標(x,y)から横の長さ、縦の長さ。

    var str = "Score ";
    ctx.fillStyle = 'black';
    ctx.font = "bold 32px serif";
    ctx.fillText(str + SCORE, 100, 60);
    // ctx.fillTextでtextを書く
}

const blockw = 80; // BLOCKの横幅
const blockh = 80; // BLOCKの縦幅
const blank_left = 80; // 左側の余白

const blank_top = 380; // 上側の余白
const tate_masu = 5; // 縦のマス数
const yoko_masu = 8; // 横のマス数

const blank_yoyaku_top = 140; // 上側の余白
const tate_yoyaku_masu = 3; // 縦のマス数



// 縦横5マスの盤面
// その上に3マス分、次に落ちて来るコマが書いてある
function background_color() { // 背景を描く

    // 次に落ちて来る部分の背景
    ctx.fillStyle = 'pink';
    ctx.fillRect(blank_left - 5, blank_yoyaku_top - 5, blockw * yoko_masu + 10, blockh * tate_yoyaku_masu + 10);
    // 背景を緑に

    for (var y = 0; y < tate_yoyaku_masu; y++) {
        for (var x = 0; x < yoko_masu; x++) {
            ctx.fillStyle = 'grey';
            ctx.fillRect(blank_left + blockw * x + 1, blank_yoyaku_top + blockh * y + 1, blockw - 2, blockh - 2);
        }
    }

    // 盤面の背景
    ctx.fillStyle = 'green';
    ctx.fillRect(blank_left - 5, blank_top - 5, blockw * yoko_masu + 10, blockh * tate_masu + 10);
    // 背景を緑に

    for (var y = 0; y < tate_masu; y++) {
        for (var x = 0; x < yoko_masu; x++) {
            ctx.fillStyle = 'black';
            ctx.fillRect(blank_left + blockw * x + 1, blank_top + blockh * y + 1, blockw - 2, blockh - 2);
        }
    }
    // マスそれぞれを黒く塗る
}

// 盤面を初期化
// 論理式を盤面にランダムで入れる
var Board = []; //5*8の盤面
var symbol_bracket = ["(", ")"]
var symbol_variable = ["p", "q"]
var symbol_connective = ["→", "∧", "∨", "￢"];
var symbol_choice = 0
var board_randchoice = "p"

for (var y = 0; y < tate_masu + tate_yoyaku_masu; y++) {
    var board2 = [];
    for (var x = 0; x < yoko_masu; x++) {
        var symbol_choice = Math.floor(Math.random() * 6)
        // console.log(symbol_choice)

        if (symbol_choice == 0) {
            board_randchoice = symbol_bracket[Math.floor(Math.random() * symbol_bracket.length)];
        }
        else if (symbol_choice <= 3) {
            board_randchoice = symbol_variable[Math.floor(Math.random() * symbol_variable.length)];
        }
        else {
            board_randchoice = symbol_connective[Math.floor(Math.random() * symbol_connective.length)];
        }
        board2.push(board_randchoice);
    }
    Board.push(board2);
}

function Boardupdate(){
    for (var x = 0; x < yoko_masu; x++) {
        var noemp = tate_masu + tate_yoyaku_masu-1
        for (var y = tate_masu + tate_yoyaku_masu-1; y>=0; y--) {
            if (Board[y][x]==""){
                noemp=Math.min(noemp,y)
                while (noemp>=0 && Board[noemp][x]==""){
                    noemp-=1
                }
                if (noemp>=0){
                    Board[y][x]=Board[noemp][x]
                    Board[noemp][x]=""
                }
            }
        }
    }


    for (var y = 0; y < tate_masu + tate_yoyaku_masu; y++) {
        for (var x = 0; x < yoko_masu; x++) {
            if (Board[y][x]==""){
                var symbol_choice = Math.floor(Math.random() * 6)
                // console.log(symbol_choice)
        
                if (symbol_choice == 0) {
                    board_randchoice = symbol_bracket[Math.floor(Math.random() * symbol_bracket.length)];
                }
                else if (symbol_choice <= 3) {
                    board_randchoice = symbol_variable[Math.floor(Math.random() * symbol_variable.length)];
                }
                else {
                    board_randchoice = symbol_connective[Math.floor(Math.random() * symbol_connective.length)];
                }
                Board[y][x]=board_randchoice
            }
        }
    }  
}

function formulas_color_update() {
    for (var y = 0; y < tate_masu; y++) {
        for (var x = 0; x < yoko_masu; x++) {
            ctx.fillStyle = '#523456';
            ctx.font = "bold 32px serif";
            ctx.fillText(Board[y + tate_yoyaku_masu][x], 30 + blank_left + x * blockw, 50 + blank_top + y * blockh);
            //console.log(y,x,Board[y][x])
        }
    }

    for (var y = 0; y < tate_yoyaku_masu; y++) {
        for (var x = 0; x < yoko_masu; x++) {
            ctx.fillStyle = '#523456';
            ctx.font = "bold 32px serif";
            ctx.fillText(Board[y][x], 30 + blank_left + x * blockw, 50 + blank_yoyaku_top + y * blockh);
            //console.log(y,x,Board[y][x])
        }
    }
}

var NOW_x = 0;
var NOW_y = 0;
var NOW_x_temp = 0;
var NOW_y_temp = 0;
var player_choice = 0;
var choices_list = [];

function choice_masu_color() {
    if (player_choice == 0) {
        ctx.lineJoin = 'bevel';
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(blank_left + NOW_x * blockh, blank_top + NOW_y * blockw, blockh, blockw);
    }
    else {
        //console.log(choices_list);
        for (var cheese of choices_list) {
            //console.log(cheese,cheese[0],cheese[1]);
            ctx.lineJoin = 'bevel';
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'red';
            ctx.strokeRect(blank_left + cheese[0] * blockh, blank_top + cheese[1] * blockw, blockh, blockw);

        }
        ctx.lineJoin = 'bevel';
        ctx.lineWidth = 25;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(blank_left + NOW_x * blockh, blank_top + NOW_y * blockw, blockh, blockw);

    }
}

function screenUpdate() {
    background_color()
    formulas_color_update()
    choice_masu_color()
    score_update()
}

function classical_tautology_judge(formula) {
    var LEN = formula.length;

    if (LEN==1){
        if (formula[0]=='0'){
            return 0
        }
        else if (formula[0]=='1'){
            return 1
        }
    }

    if (formula[0]=="(" && formula[LEN-1]==")"){
        return classical_tautology_judge(formula.substr(1, LEN-1));
    }

    for (var i = 0; i < LEN-1; i += 1) {
        if (formula[i]=="p" && formula[i+1]=="q"){
            return 0
        }
        if (formula[i]=="q" && formula[i+1]=="p"){
            return 0
        }
        if (formula[i]=="p" && formula[i+1]=="p"){
            return 0
        }
        if (formula[i]=="q" && formula[i+1]=="q"){
            return 0
        }
        if (formula[i]=="∧" && formula[i+1]=="∧"){
            return 0
        }
        if (formula[i]=="∧" && formula[i+1]=="∨"){
            return 0
        }
        if (formula[i]=="∧" && formula[i+1]=="→"){
            return 0
        }
        if (formula[i]=="∨" && formula[i+1]=="∧"){
            return 0
        }
        if (formula[i]=="∨" && formula[i+1]=="∨"){
            return 0
        }
        if (formula[i]=="∨" && formula[i+1]=="→"){
            return 0
        }
        if (formula[i]=="→" && formula[i+1]=="∧"){
            return 0
        }
        if (formula[i]=="→" && formula[i+1]=="∨"){
            return 0
        }
        if (formula[i]=="→" && formula[i+1]=="→"){
            return 0
        }
        if (formula[i]=="￢" && formula[i+1]=="∧"){
            return 0
        }
        if (formula[i]=="￢" && formula[i+1]=="∨"){
            return 0
        }
        if (formula[i]=="￢" && formula[i+1]=="→"){
            return 0
        }
    }

    var br = 0;
    var arind = -1;
    var juncind = -1
    for (var i = 0; i < LEN; i += 1) {
        if (formula[i] == "(") {
            br += 1
        }
        else if (formula[i] == ")") {
            br -= 1
        }
        else if (br == 0 && formula[i] == "→") {
            if (arind == -1) {
                arind = i
            }
        }
        else if (br == 0 && (formula[i] == "" || formula[i] == "")) {
            juncind = i
        }
    }

    if (br!=0){
        return 0;
    }

    if (arind!=-1){
        var f=formula.substr( 0, arind );
        var g=formula.substr( arind+1 );

        return (1-classical_tautology_judge(f))|classical_tautology_judge(g)
    }
    else if (juncind != -1){
        var f=formula.substr( 0, juncind );
        var g=formula.substr( juncind+1 );

        if (formula[juncind]=="∧"){
            return classical_tautology_judge(f) & classical_tautology_judge(g)
        }
        else{
            return classical_tautology_judge(f) | classical_tautology_judge(g)
        }
    }
    else if (formula[0]=="￢"){
            return 1-classical_tautology_judge(formula.substr(1, LEN-1));
    }
    return 0;
}

function formula_make(choices_list) {
    var made_formula = "";
    //console.log(choices_list)
    //console.log(Board)
    for (var c of choices_list) {
        made_formula += Board[tate_yoyaku_masu + c[1]][c[0]]
    }
    //console.log(formulae);

    return made_formula
}

addEventListener("keyup", keyupfunc);
function keyupfunc(event) {
    var key_code = event.keyCode;

    if (key_code === 39) {
        NOW_x_temp = Math.min(NOW_x + 1, 7)
    }
    else if (key_code === 37) {
        NOW_x_temp = Math.max(NOW_x - 1, 0)
    }
    else if (key_code === 40) {
        NOW_y_temp = Math.min(NOW_y + 1, 4)
    }
    else if (key_code === 38) {
        NOW_y_temp = Math.max(NOW_y - 1, 0)
    }
    //console.log(key_code, NOW_x, NOW_y)

    if (key_code === 90) {
        player_choice = 0;
        var made_formula = formula_make(choices_list)
        var tautjudge = 1;
        for (var p of ['0', '1']) {
            for (var q of ['0', '1']) {
                var formula_p = made_formula.replace(/p/g, p);
                var formula_pq = formula_p.replace(/q/g, q);

                console.log(formula_pq)

                if (classical_tautology_judge(formula_pq)==0){
                    tautjudge=0
                    break;
                }
            }
        }
        if (tautjudge==1){
            SCORE+=10
            for (c of choices_list){
                Board[tate_yoyaku_masu + c[1]][c[0]]=""
            Boardupdate()
            }
        }
        choices_list = [];
    }

    for (var tt = 0; tt < choices_list.length; tt += 1) {
        console.log(choices_list[tt])
    }

    //if (player_choice == 1 && choices_list.indexOf([NOW_x_temp, NOW_y_temp]) != -1) {
    //    return;
    //}

    if (player_choice == 1) {

        for (var tt = 0; tt < choices_list.length; tt += 1) {
            if (choices_list[tt][0] == NOW_x_temp && choices_list[tt][1] == NOW_y_temp) {
                console.log("!")
                return;
            }
        }
    }

    NOW_x = NOW_x_temp
    NOW_y = NOW_y_temp
    if (player_choice == 1) {
        choices_list.push([NOW_x, NOW_y])
    }
    //console.log(key_code, player_choice)
    screenUpdate();

}

addEventListener("keydown", keydownfunc);
function keydownfunc(event) {
    var key_code = event.keyCode;

    if (key_code === 90) {
        player_choice = 1;
        for (var tt = 0; tt < choices_list.length; tt += 1) {
            if (choices_list[tt][0] == NOW_x_temp && choices_list[tt][1] == NOW_y_temp) {
                //console.log("!")
                return;
            }
        }
        choices_list.push([NOW_x, NOW_y])

    }
    console.log(key_code, player_choice)
    screenUpdate();
}



/*
function screenUpdate(updateY=true) {

    var str = "Max " + maxChain;//最大連鎖表示
    ctx.fillStyle = '#000000';
    ctx.fillRect(350, 25, 250, 60);
    ctx.fillStyle = '#999999';
    ctx.fillText(str, 350, 60);

    if (phase == 1){
        for (var y = 0; y < 22; y++) {
            for (var x = 0; x < 10; x++) { //背景
                ctx.fillStyle = 'green';
                ctx.fillRect(blockw * x, blockh * y, blockw, blockh);
                ctx.fillStyle = '#000000';
                ctx.fillRect(blockw * x + 1, blockh * y + 1, blockw - 2, blockh - 2);

                if (hantei[y][x] != "E"){      //積み重なってるブロック
                    ctx.fillStyle = '#523456';
                    ctx.font = "bold 32px serif";
                    ctx.fillText(hantei[y][x], x*blockw, y*blockh);
                }
            }
        }

        if(updateY) cy = cy + 1;

        if(cy==21 || hantei[cy+1][cx] != "E" ){//下接触判定
            phase = 2;
        }
// (P →　　）(q→　ｐ)
        ctx.fillStyle = 'blue';
        ctx.fillRect(cx*blockw, (cy-1)*blockh, blockw, blockh);
        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 32px serif";
        ctx.fillText(symbolC, cx*blockw, cy*blockh);　//落下中記号表示
    }

    if (phase == 2){
        hantei[cy][cx] = symbolC;
        chain = 0;
        while(chainHantei == 1){//連鎖続いてる間繰り返す
            chainHantei = 0;
            for (var y = 0; y < 22; y++) {//消すかどうか判定
                for (var x = 0; x < 10; x++) {
                    //同じの2個
                    if ((hantei[y][x] != "E") && ( (0<y && (hantei[y][x] == hantei[y-1][x])) ||(y!=21 && (hantei[y][x] == hantei[y+1][x])) || (0<x &&(hantei[y][x] == hantei[y][x-1])) || (x!=9 &&(hantei[y][x] == hantei[y][x+1]))) ){
                        eraseHantei[y][x] = 0;
                        chainHantei = 1;
                    }
                    //論理式
                    if ((hantei[y][x] == "￢") && (x<9) && ((hantei[y][x+1] == "p") || (hantei[y][x+1] == "q"))){
                        eraseHantei[y][x] = 0;
                        eraseHantei[y][x+1] = 0;
                        chainHantei = 1;
                    }
                    if (((hantei[y][x] == "p") || (hantei[y][x] == "q")) && (x<8) && ((hantei[y][x+1] == "→") || (hantei[y][x+1] == "∧") || (hantei[y][x+1] == "∨")) && ((hantei[y][x+2] == "p") || (hantei[y][x+2] == "q"))){
                        eraseHantei[y][x] = 0;
                        eraseHantei[y][x+1] = 0;
                        eraseHantei[y][x+2] = 0;
                        chainHantei = 1;
                    }
                }
            }

            for (var y = 0; y < 22; y++) {//消す かつ elaseHantei 初期か
                for (var x = 0; x < 10; x++) {
                    if (eraseHantei[y][x] == 0){
                        hantei[y][x] = "E";
                    }
                    eraseHantei[y][x] = 1;
                }
            }

            var sukima = 1;//1スキマあり　０なし
            while(sukima == 1){//下に隙間ある間繰り返す
                sukima = 0;
                for (var y = 0; y < 22; y++) {//落とす
                    for (var x = 0; x < 10; x++) {
                        if (y<21 && hantei[y][x] != "E" && hantei[y+1][x] == "E"){
                            hantei[y+1][x] = hantei[y][x];
                            hantei[y][x] = "E";
                            sukima = 1;
                        }
                    }
                }
            }
            if(chainHantei == 1) chain = chain + 1;
            if(maxChain < chain) maxChain = chain;
        }


        cx = 4;        //初期か
        cy = 0;
        phase = 1;
        symbolC = symbols[Math.floor(Math.random()*symbols.length)];
        chainHantei = 1;

    }

}
*/
/*
function keyupfunc( event ) {

    var key_code = event.keyCode;

    if( key_code === 37 && (0 < cx) && hantei[cy][cx-1] == "E" ) cx = Math.max(0, cx - 1);
    else if( key_code === 39 && ( cx < 9) && hantei[cy][cx+1] == "E" ) cx = Math.min(9, cx + 1);
    else if( key_code === 38 ) cy = cy + 1;
    else if( key_code === 40 ) cy = cy + 1;//↓
    screenUpdate(false);
}
addEventListener( "keyup", keyupfunc );

setInterval(screenUpdate, 1000);
*/
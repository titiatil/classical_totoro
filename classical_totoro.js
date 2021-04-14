const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

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

    // 各マスを黒く塗る
    for (var y = 0; y < tate_masu; y++) {
        for (var x = 0; x < yoko_masu; x++) {
            ctx.fillStyle = 'black';
            ctx.fillRect(blank_left + blockw * x + 1, blank_top + blockh * y + 1, blockw - 2, blockh - 2);
        }
    }
}

// 盤面を初期化
// 論理式を盤面にランダムで入れる
const Board = []; //5*8の空の盤面
for (var y = 0; y < tate_masu + tate_yoyaku_masu ; y++) {
    var Board2=[]
    for (var x = 0; x < yoko_masu; x++) {
        Board2.push("");
    }
    Board.push(Board2);
}

// 各記号
const symbol_bracket = ["(", ")"];
const symbol_variable = ["p", "q"]; // とりあえず命題変数は二つにしている。いずれ三つ以上に拡張するならこの書き方は良くないが。
const symbol_connective1 =["￢"];
const symbol_connective2 = ["→", "∧", "∨"]
var symbol_choice = 0;
var board_randchoice = "p";

function Boardupdate() {
    // 盤面のemptyなマスに、上にある論理式を落としていく。
    // 一応、尺取り法
    for (var x = 0; x < yoko_masu; x++) {
        var noemp = tate_masu + tate_yoyaku_masu - 1;
        for (var y = tate_masu + tate_yoyaku_masu - 1; y >= 0; y--) {
            if (Board[y][x] == "") {
                noemp = Math.min(noemp, y);
                while (noemp >= 0 && Board[noemp][x] == "") {
                    noemp -= 1;
                }
                if (noemp >= 0) {
                    Board[y][x] = Board[noemp][x];
                    Board[noemp][x] = "";
                }
            }
        }
    }

　　// 空のマスをランダムで埋める。
    for (var y = 0; y < tate_masu + tate_yoyaku_masu; y++) {
        for (var x = 0; x < yoko_masu; x++) {
            if (Board[y][x] == "") {

                // 入れる文字種類の調整。
                // カッコ・命題変数・￢・∧∨→が1:4:1:2になるようにしているが、その比率が良いのかは謎。
                var symbol_choice = Math.floor(Math.random() * 8)

                if (symbol_choice == 0) {
                    board_randchoice = symbol_bracket[Math.floor(Math.random() * symbol_bracket.length)];
                }
                else if (symbol_choice <= 4) {
                    board_randchoice = symbol_variable[Math.floor(Math.random() * symbol_variable.length)];
                }
                else if (symbol_choice <= 5){
                    board_randchoice = symbol_connective1[Math.floor(Math.random() * symbol_connective1.length)];
                }
                else if (symbol_choice <= 7){
                    board_randchoice = symbol_connective2[Math.floor(Math.random() * symbol_connective2.length)];
                }
                Board[y][x] = board_randchoice;
            }
        }
    }
}

Boardupdate();

// マス内の文字を表示
function formulas_color_update() {
    // 予約部分の盤面を表示
    for (var y = 0; y < tate_masu; y++) {
        for (var x = 0; x < yoko_masu; x++) {
            ctx.fillStyle = '#523456';
            ctx.font = "bold 32px serif";
            ctx.fillText(Board[y + tate_yoyaku_masu][x], 30 + blank_left + x * blockw, 50 + blank_top + y * blockh);
        }
    }

    // 通常盤面を表示
    for (var y = 0; y < tate_yoyaku_masu; y++) {
        for (var x = 0; x < yoko_masu; x++) {
            ctx.fillStyle = '#523456';
            ctx.font = "bold 32px serif";
            ctx.fillText(Board[y][x], 30 + blank_left + x * blockw, 50 + blank_yoyaku_top + y * blockh);
        }
    }
}

// 自分の座標
var NOW_x = 0;
var NOW_y = 0;

// 現在選択中か、選択していないかのflag
var player_choice = 0;

// 選択中の論理式の座標を入れる
var choices_list = [];

// 選択に関して
function choice_masu_color() {
    // 現在選択していないとき、青枠をつける
    if (player_choice == 0) {
        ctx.lineJoin = 'bevel';
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(blank_left + NOW_x * blockh, blank_top + NOW_y * blockw, blockh, blockw);
    }
    // 現在選択しているとき
    else {
        // ここまで選択していたものに赤枠をつける
        for (var cheese of choices_list) {
            ctx.lineJoin = 'bevel';
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'red';
            ctx.strokeRect(blank_left + cheese[0] * blockh, blank_top + cheese[1] * blockw, blockh, blockw);
        }
        // 現在選択しているものには太い赤枠
        ctx.lineJoin = 'bevel';
        ctx.lineWidth = 25;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(blank_left + NOW_x * blockh, blank_top + NOW_y * blockw, blockh, blockw);
    }
}

// （変数がp, qのみの）論理式のトートロジー判定
// 付値を代入した後、function classical_tautology_judgeにより判定している。
function taut_judge_formula(formula){
    var tautjudge = 1;
    if (pp_judge(formula) == 0){
        tautjudge=0;
    }

    for (var p of ['0', '1']) {
        if (tautjudge==0){
            break;
        }
        for (var q of ['0', '1']) {
            var formula_p = formula.replace(/p/g, p);
            var formula_pq = formula_p.replace(/q/g, q);

            if (classical_tautology_judge(formula_pq) == 0) {
                tautjudge = 0;
                break;
            }
        }
    }
    return tautjudge;
}

function made_formula_update() { // 画面上部にSCOREを表示
    made_formula = formula_make(choices_list)
    ctx.fillStyle = 'pink';
    ctx.fillRect(100, 75, 350, 50);
    // ctx.fillStyleで色を指定
    // ctx.fillRectで長方形を描画する。 座標(x,y)から横の長さ、縦の長さ。

    ctx.fillStyle = 'black';
    ctx.font = "bold 32px serif";
    ctx.fillText(made_formula, 100, 110);
    // ctx.fillTextでtextを書く

    var tautjudge = taut_judge_formula(made_formula);

    if (made_formula.length>0){
        if (tautjudge == 1){
            ctx.fillStyle = 'black';
            ctx.font = "bold 32px serif";
            ctx.fillText("〇", 400, 110);
        }
        else{
            ctx.fillStyle = 'black';
            ctx.font = "bold 32px serif";
            ctx.fillText("×", 400, 110);
        }
    }
}

// 画面の描写
function screenUpdate() {
    background_color();
    formulas_color_update();
    choice_masu_color();
    score_update();
    made_formula_update();
}

// ∧が二つ続いたり、変数が二つ続いたりしていないかを判定
// カッコ判定はしていないので、well-formed-formulaかを判定しているわけではない
function pp_judge(formula){
    var LEN = formula.length;

    // 一文字目が")"ではダメ
    if (formula[0]==")"){
        return 0;
    }
    //　一文字目が2-ary connectiveではダメ
    if (symbol_connective2.includes(formula[0])) {
        return 0;
    }
    //　最後の文字が2-ary connectiveではダメ
    if (symbol_connective2.includes(formula[LEN-1])) {
        return 0;
    }
    // 最後の文字が"￢", "("ではダメ
    if (formula[LEN-1]=="(" || formula[LEN-1]=="￢") {
        return 0;
    }
    for (var i = 0; i < LEN - 1; i += 1) {
        // "()"と、カッコの間に何も入らないのはダメ。
        if (formula[i]=="(" && formula[i+1]=="(") {
            return 0;
        }

        // "("の直後に2-ary connectiveが来てはダメ
        if (formula[i]=="(" && symbol_connective2.includes(formula[i+1])) {
            return 0;
        }
        // ")"の直後は2-ary connectiveでないとダメ
        if (formula[i]==")" && !(symbol_connective2.includes(formula[i+1]))) {
            return 0;
        }
        // 変数が二つ連続してはダメ
        if (symbol_variable.includes(formula[i]) && symbol_variable.includes(formula[i+1])) {
            return 0;
        }
        // 変数の直後に￢が来てはダメ
        if (symbol_variable.includes(formula[i]) && formula[i+1]=="￢") {
            return 0;
        }
        // 変数の直後に"("が来てはダメ
        if (symbol_variable.includes(formula[i]) && formula[i+1]=="(") {
            return 0;
        }
        // "￢"の直後に")"が来てはダメ
        if (formula[i]=="￢" && formula[i+1]==")") {
            return 0;
        }
        // "￢"の直後に2-ary connectiveが来てはダメ
        if (formula[i]=="￢" && symbol_connective2.includes(formula[i+1])) {
            return 0;
        }
        // 2-ary connectiveの直後に")"が来てはダメ
        if (symbol_connective2.includes(formula[i]) && formula[i+1]==")") {
            return 0;
        }
        // 2-ary connectiveの直後に2-ary connectiveが来てはダメ
        if (symbol_connective2.includes(formula[i]) && symbol_connective2.includes(formula[i+1])) {
            return 0;
        }
    }
    return 1;
}

// 付値{0, 1}を代入した古典論理式のトートロジー判定
function classical_tautology_judge(formula) {
    var LEN = formula.length;

    // 一文字のときを判定
    if (LEN == 1) {
        if (formula[0] == "1") {
            return 1;
        }
        else{
            return 0;
        }
    }

    // 全体が()に挟まれているときは、その間の論理式を判定
    if (formula[0] == "(" && formula[LEN - 1] == ")") {
        return classical_tautology_judge(formula.substring(1, LEN - 1));
    }

    var br = 0; // 何個のカッコに入っているか
    var arind = -1; // →がある一番始めのindex
    var juncind = -1 // ∧や∨がある一番後ろのindex
    for (var i = 0; i < LEN; i += 1) {
        if (formula[i] == "(") {
            br += 1;
        }
        else if (formula[i] == ")") {
            br -= 1;
        }
        // 途中でbrが-1になったらダメ
        if (br < 0){
            return 0;
        }
        else if (br == 0 && formula[i] == "→") {
            if (arind == -1) {
                arind = i;
            }
        }
        else if (br == 0 && (formula[i] == "∧" || formula[i] == "∨")) {
            juncind = i;
        }
    }

    // br=0でないとダメ
    if (br != 0) {
        return 0;
    }

    // カッコに入っていない→があったなら、一番最初の→で二つに分けて、￢f∨g
    if (arind != -1) {
        var f = formula.substring(0, arind);
        var g = formula.substring(arind + 1);

        return (1 ^ classical_tautology_judge(f)) | classical_tautology_judge(g);
    }
    // 一番最後の∧か∨で二つに分けて再帰
    else if (juncind != -1) {
        var f = formula.substring(0, juncind);
        var g = formula.substring(juncind + 1);

        if (formula[juncind] == "∧") {
            return classical_tautology_judge(f) & classical_tautology_judge(g);
        }
        else {
            return classical_tautology_judge(f) | classical_tautology_judge(g);
        }
    }
    // 一文字が￢なら再帰
    else if (formula[0] == "￢") {
        return 1 ^ classical_tautology_judge(formula.substring(1, LEN));
    }
    return 0;
}

// choice_listに入っている座標から論理式を再現
function formula_make(choices_list) {
    var made_formula = "";
    for (var c of choices_list) {
        made_formula += Board[tate_yoyaku_masu + c[1]][c[0]];
    }
    return made_formula;
}

// keyを上げたときの操作
addEventListener("keyup", keyupfunc);
function keyupfunc(event) {
    var key_code = event.keyCode;
    var NOW_x_temp = NOW_x;
    var NOW_y_temp = NOW_y;

    // 上下左右について
    if (key_code === 39) {
        NOW_x_temp = Math.min(NOW_x + 1, 7);
    }
    else if (key_code === 37) {
        NOW_x_temp = Math.max(NOW_x - 1, 0);
    }
    else if (key_code === 40) {
        NOW_y_temp = Math.min(NOW_y + 1, 4);
    }
    else if (key_code === 38) {
        NOW_y_temp = Math.max(NOW_y - 1, 0);
    }

    // zを離したとき
    if (key_code === 90) {
        player_choice = 0;
        var made_formula = formula_make(choices_list);
        var tautjudge = taut_judge_formula(made_formula);

        // トートロジーならスコアを増やす
        if (tautjudge == 1) {
            SCORE += 10
            for (c of choices_list) {
                Board[tate_yoyaku_masu + c[1]][c[0]] = "";
            }
            Boardupdate();
        }
        choices_list = [];
    }
    // zを押している最中のとき、それまでに選択した座標と一致していないかを調べる。
    // 一致していたら動かさない
    if (player_choice == 1) {
        for (var tt = 0; tt < choices_list.length; tt += 1) {
            if (choices_list[tt][0] == NOW_x_temp && choices_list[tt][1] == NOW_y_temp) {
                return;
            }
        }
    }

    // そうでなければ、今何時座標を更新
    NOW_x = NOW_x_temp;
    NOW_y = NOW_y_temp;
    if (player_choice == 1) {
        choices_list.push([NOW_x, NOW_y]);
    }
    screenUpdate();

}

// keyを押したときの操作。
// zを押したときの判定。
addEventListener("keydown", keydownfunc);
function keydownfunc(event) {
    var key_code = event.keyCode;

    if (key_code === 90) {
        player_choice = 1;
        for (var tt = 0; tt < choices_list.length; tt += 1) {
            if (choices_list[tt][0] == NOW_x && choices_list[tt][1] == NOW_y) {
                return;
            }
        }
        choices_list.push([NOW_x, NOW_y]);
    }
    screenUpdate();
}

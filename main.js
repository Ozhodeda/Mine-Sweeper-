"use strict";

var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    firstClick: true
};

function onInit() {
    gGame.isOn = true;
    gBoard = buildBoard();
    setMineNegtsCount(gBoard)
    renderBoard(gBoard)
    console.log(gBoard);
};


function buildBoard() {
    const board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell;
            //console.log(cell);
        };
    };

    board[1][0].isMine = true;
    board[3][0].isMine = true;
    return board;
};

function renderBoard(board) {
    var strHTML = "";
    var cellContent = "";
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < gLevel.SIZE; j++) {
            const currCell = board[i][j];
            //To inside content to each cell
            if (currCell.isMine && currCell.isShown) cellContent = "💥";
            else if (currCell.isMarked) cellContent = "🏴";
            else if (currCell.isShown) { cellContent = currCell.minesAroundCount }
            else cellContent = "";
            // For cell of type Mine add mine class:
            var className = currCell.isMine ? "mine" : "";
            strHTML += `\t<td data-i="${i}" data-j="${j}"
                                class="cell ${className}" 
                                onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu = "onCellMarked(this,event)" >${cellContent}
                             </td>\n`;
        }
        strHTML += `</tr>\n`;
    };
    const elBoard = document.querySelector(".board");
    elBoard.innerHTML = strHTML;
};


function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j];
    if (!gGame.isOn) return
    if (cell.isShown) return
    if (cell.isMarked) return
    if (cell.isMine) {
        revelMines(gBoard, i, j);
        return;
    };
    gBoard[elCell.dataset.i][elCell.dataset.j].isShown = true;
    renderBoard(gBoard);
    return;
};

function onCellMarked(elcell, event){
    event.preventDefault();
    const currCell = gBoard[elcell.dataset.i][elcell.dataset.j];
    if(!gGame.isOn)return;
    if(currCell.isShown)return;
    if(!currCell.isMarked){
        gGame.markedCount++;
        currCell.isMarked = true;
    }else{
        gGame.markedCount--;
        currCell.isMarked = false;
    };
    if(checkGameOver()){
        gGame.isOn=false;
    };
    renderBoard(gBoard);
};

function revelMines(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j].isMine) board[i][j].isShown = true;
        }
    }
    renderBoard(board);
    gGame.isOn = false;
};

function checkGameOver() {
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES &&
        gLevel.MINES === gGame.markedCount) return
};

function expandShown(board, elCell, i, j) {

}

function setMineNegtsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            gBoard[i][j].minesAroundCount = checkNeighbors(board, i, j);
        };
    };
};

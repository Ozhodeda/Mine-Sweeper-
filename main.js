"use strict";

var gBoard;
var gInterval;

var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    firstClick: true,
    lives: 3
};
var gMineLeft = gLevel.MINES

function onInit(size = 4, mine = 2) {
    restartGame(size, mine);
    gBoard = buildBoard();
    renderBoard(gBoard);
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
    return board;
};

function renderBoard(board) {
    renderLives();
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
            strHTML += `\t<td data-i="${i}" data-j="${j}"
                                class="cell" 
                                onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu = "onCellMarked(this,event)" >${cellContent}
                             </td>\n`;
        }
        strHTML += `</tr>\n`;
    };
    const elBoard = document.querySelector(".board");
    elBoard.innerHTML = strHTML;
};

function renderMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var row = Math.floor(Math.random() * gLevel.SIZE);
        var col = Math.floor(Math.random() * gLevel.SIZE);

        while (board[row][col].isMine) {
            row = Math.floor(Math.random() * gLevel.SIZE);
            col = Math.floor(Math.random() * gLevel.SIZE);
        }
        board[row][col].isMine = true;
    };
};

function onCellClicked(elCell, i, j) {
    const cellClicked = gBoard[i][j];
    if (gGame.firstClick) {
        gGame.firstClick = false;
        startTime();
        renderMines(gBoard, i, j)
        setMinesNegsCount(gBoard)
    }
    if (!gGame.isOn) return
    if (cellClicked.isShown || cellClicked.isShown) return
    if (cellClicked.isMine) {
        --gMineLeft
        gGame.lives--
        if (gGame.lives === 0) {
            revelMines(gBoard);
            return;
        }; gBoard[i][j].isShown = true;
        renderBoard(gBoard);
        return;
    };

    if (cellClicked.minesAroundCount === 0) {
        expandShown(gBoard, i, j);
        cellClicked.isShown = true;
    };

    gBoard[elCell.dataset.i][elCell.dataset.j].isShown = true;
    renderBoard(gBoard);
    return;
};


function onCellMarked(elCell, event) {
    event.preventDefault();
    const currCell = gBoard[elCell.dataset.i][elCell.dataset.j];
    if (!gGame.isOn) return;
    if (currCell.isShown) return;
    if (!currCell.isMarked) {
        currCell.isMarked = true;
        gGame.markedCount++;
        
    } else {
        currCell.isMarked = false;
        gGame.markedCount--;
    };
    if (currCell.isMine) --gMineLeft;
    if (checkGameOver()) {
        gGame.isOn = false;
        clearInterval(gInterval)
    };
    renderBoard(gBoard);
};


function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            var currCell = board[i][j];
            if (!currCell.isShown && !currCell.isMine && !currCell.isMarked) {
                currCell.isShown = true;
                gGame.shownCount++;
                if (currCell.minesAroundCount === 0) { expandShown(board, i, j) }
            }
            if (currCell.isShown) {
                currCell.wasAlreadyShown = true;
            };
        };
    };
};

function renderLives() {
    var liveStr = "";
    var liveCount = gLevel.MINES === 2 ? gGame.lives : gGame.lives;
    for (var i = 0; i < liveCount; i++) liveStr += "❤️‍🔥";
    document.querySelector('.live').innerHTML = liveStr;
}

function revelMines(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j].isMine) board[i][j].isShown = true;
        }
    }
    gGame.isOn = false;
    document.querySelector(".smiley").innerText = "🤯"
    clearInterval(gInterval)
    renderBoard(board);
};

function checkGameOver() {
    if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES &&
        gLevel.MINES === gGame.markedCount) return
    if (gMineLeft === 0) {
    document.querySelector('.smiley').innerText = '😎';
    clearInterval(gInterval)}
};

function setMinesNegsCount(board) {
    for (var rowIdx = 0; rowIdx < board.length; rowIdx++) {
        for (var colIdx = 0; colIdx < board[rowIdx].length; colIdx++) {
            var count = 0;
            for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
                if (i < 0 || i >= board.length) continue;
                for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                    if (j < 0 || j >= board[0].length) continue;
                    if (i === rowIdx && j === colIdx) continue;
                    if (board[i][j].isMine) {
                        count++;
                    };
                };
            };
            board[rowIdx][colIdx].minesAroundCount = count;
        };
    };
};

function restartGame(boardSize, mineCount) {
    gLevel.SIZE = boardSize;
    gLevel.MINES = mineCount;
    gMineLeft = gLevel.MINES;
    gGame.lives = gLevel.MINES === 2 ? 2 : 3;
    document.querySelector('.mine').innerText = gMineLeft;
    document.querySelector('.time').innerText = '000';
    document.querySelector('.smiley').innerText = '😁';
    clearInterval(gInterval);
    gGame.firstClick = true;
    gGame.isOn = true;
};


function startTime() {
    var startTime = Date.now()
    gInterval = setInterval(function () {
        var time = Date.now() - startTime
        document.querySelector(".time").innerText = (time / 1000).toFixed(3)
    }, 37)
}
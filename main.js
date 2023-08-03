"use strict";

var gBoard;
var gInterval;
var gSafeClick;
var gHint;
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
    lives: 3,
    MineLeft: gLevel.MINES
};


function onInit(size = 4, mine = 2) {
    gSafeClick = 3;
    gHint = false;
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
                isMarked: false,
                wasAlreadyShown: false
            };
            board[i][j] = cell;

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
            strHTML += `\t<td data-i="${i}" data-j="${j}" id="cell ${i}-${j}"
                                class="cell ${i}-${j}" 
                                onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu = "onCellMarked(this,event)" >${cellContent}
                             </td>\n`;
        }
        strHTML += `</tr>\n`;
    };
    const elBoard = document.querySelector(".board");
    elBoard.innerHTML = strHTML;

};

function restartGame(boardSize, mineCount) {
    gLevel.SIZE = boardSize;
    gLevel.MINES = mineCount;
    gGame.lives = gLevel.MINES === 2 ? 2 : 3;
    gGame.MineLeft = gLevel.MINES;
    document.querySelector('.mine').innerText = gGame.MineLeft;
    document.querySelector('.time').innerText = '000';
    document.querySelector('.smiley').innerText = '😁';
    clearInterval(gInterval);
    gGame.firstClick = true;
    gGame.isOn = true;
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
        document.querySelector('.mine').innerText = --gGame.MineLeft;
        gGame.lives--
        if (gGame.lives === 0) {
            revelMines(gBoard);
            return;
        };
       if(gBoard[i][j].isShown === false){
        gBoard[i][j].isShown = true;
        renderBoard(gBoard)};
        return;
    };

    if (cellClicked.minesAroundCount === 0) {
        expandShown(gBoard, i, j);
        cellClicked.isShown = true;
    };
    if (gHint) showNeighbors(gBoard, i, j);

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
    if (currCell.isMine)
        document.querySelector('.mine').innerText = --gGame.MineLeft;
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

function SafeClick() {
    if (!gGame.isOn) return;
    if (gSafeClick === 0) return;
    var emptyCell = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (!cell.isMarked && !cell.isMine && !cell.isShown) emptyCell.push({ i, j });

        };
    };
    if (emptyCell.length === 0) {
        alert('Dont have safe cell on board '); return;
    };

    var randomIdx = getRandomInt(0, emptyCell.length);
    var safeCell = emptyCell[randomIdx];
    var elCell = document.getElementById('cell ' + safeCell.i + '-' + safeCell.j);

    elCell.classList.add('randSafeCell');
    setTimeout(() => {
        elCell.classList.remove('randSafeCell')
    }, 1500);
    gSafeClick--;
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
    if (gGame.MineLeft === 0) {
        document.querySelector('.smiley').innerText = '😎';
        clearInterval(gInterval)
    }
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


function startTime() {
    var startTime = Date.now()
    gInterval = setInterval(function () {
        var time = Date.now() - startTime
        document.querySelector(".time").innerText = (time / 1000).toFixed(3)
    }, 37)
};

function darkMode(elDark) {
    const elBody = document.querySelector('body');
    elBody.classList.toggle('darkMode');
    if (elDark.innerText === 'Dark-Mode') {
        elDark.innerText = 'Light-Mode';
        return;
    } else if (elDark.innerText === 'Light-Mode') {
        elDark.innerText = 'Dark-Mode';
        return;
    };
};

function chengHints(elHint) {
    elHint.classList.toggle('light')
    gHint = true
};

function showNeighbors(board, row, col) {
    var neighbors = [{ i: row, j: col }];
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = col - 1; j <= col; j++) {
            if (j < 0 || j >= board.length) continue;
            if (board[i][j].isShown === true) continue;
            var loc = { i, j };
            neighbors.push(loc);
        };
    };
    for (var i = 0; i < neighbors.length; i++) {
        board[neighbors[i].i][neighbors[i].j].isShown = true;
    };
    renderBoard(board);
    for (var i = 0; i < neighbors.length; i++) {
        board[neighbors[i].i][neighbors[i].j].isShown = false;
    };
    const elHint = document.querySelector('.light');
    setTimeout(() => {
        renderBoard(board)
        elHint.style.display = 'none'
    }, 1500);
    gHint = false;
};

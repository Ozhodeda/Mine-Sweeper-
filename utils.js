"use strict";
//create board
function createBoard() {
    const board = [];
    for (var i = 0; i < 10; i++) {
      board[i] = [];
      for (var j = 0; j < 10; j++) {
        board[i][j] = {
          type: FLOOR,
          gameElement: null,
        };
        if (i === 0 || i === 10 || j === 0 || j === 10) {
          board[i][j].type = WALL;
        }
      }
    }
  }

///////////////////////////////////////////////
// create mat
  function createMat(rowIdx, colIdx) {
    const mat = [];
    for (var i = 0; i < rowIdx; i++) {
      const row = [];
      for (var j = 0; j < colIdx; j++) {
        row.push("♻️");
      }
      mat.push(row);
    }
    return mat;
}
  
///////////////////////////////////////////////
// neighbored loop
function checkNeighbors(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
      if (i < 0 || i >= board.length) continue;
      for (var j = colIdx - 1; j <= colIdx + 1; j++) {
        if (i === rowIdx && j === colIdx) continue;
        if (j < 0 || j >= board[0].length) continue;
        console.log("board[i][j]", board[i][j]);
        var currCell = board[i][j];
        if (currCell.isSeat && !currCell.isBooked) {
          count++;
        }
      }
    }
    return count;
}

///////////////////////////////////////////////
//empty cell
function getEmptyCells(board) {
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[0].length; j++) {
        const currCell = board[i][j];
        if (currCell.type === FLOOR && currCell.gameElement === null)
          emptyCells.push({ i, j });
      }
    }
    if (!emptyCells.length) return null;
    return emptyCells;
  }

///////////////////////////////////////////////////
// render to already board
function renderCinema() {
    var strHTML = "";
    for (var i = 0; i < gCinema.length; i++) {
      strHTML += `<tr class="cinema-row" >\n`;
      for (var j = 0; j < gCinema[0].length; j++) {
        const cell = gCinema[i][j];
        // For cell of type SEAT add seat class:
        var className = cell.isSeat ? "seat" : "";
        if (cell.isBooked) {
          className += " booked";
        }
        // Add a seat title:
        const title = `Seat: ${i + 1}, ${j + 1}`;
        strHTML += `\t<td data-i="${i}" data-j="${j}"
                                title="${title}" class="cell ${className}" 
                                onclick="onCellClicked(this, ${i}, ${j})" >
                             </td>\n`;
      }
      strHTML += `</tr>\n`;
    }
    const elSeats = document.querySelector(".cinema-seats");
    elSeats.innerHTML = strHTML;
  }

/////////////////////////////////////////////////////////////
// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }

/////////////////////////////////////////////////////////////

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
    // The maximum is exclusive and the minimum is inclusive
  }
  
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
//////////////////////////////////////////////////////////
// play sound
function playSound() {
    const audio = new Audio("filename.type");
    audio.play();
  }

////////////////////////////////////////////////////////


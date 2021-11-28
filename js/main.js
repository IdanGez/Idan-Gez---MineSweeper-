'use strict'
// GAME IMAGES
var MINE_IMG = `<img width="50px" height="50px" src="img/mine1.png"></img>`;
var FLAG_IMG = `<img width="35px" height="35px" src="img/flag5.png"></img>`;
var LIVE_IMG = `<img width="45px" height="45px" src="img/lives.png"></img>`;

// GLOBAL VARIABLES
var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2,
}
var gGame = {
    isOn: true,
    markedCount: 0,
    secsPassed: 0,
}
var gseconds = 0;
var gInterval;
var gFirstClick = 0;
var gVictoryCounter;
var gLivesCount = 3;
var gHintCounter = 3;

function initGame() {
    gVariableRestarter()
    gBoard = buildBoard();
    renderBoard(gBoard);
    document.querySelector('h4 span').innerHTML = LIVE_IMG + ' ' + LIVE_IMG + ' ' + LIVE_IMG;
    document.querySelector("#seconds").innerHTML = '00';
}

function gVariableRestarter() {
    gLivesCount = 3;
    gseconds = 0;
    gFirstClick = 0;
    gGame.isOn = true;
    gHintCounter = 3;

}

function setMinesNegsCount(gBoard) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            for (var k = currCell.cellI - 1; k <= currCell.cellI + 1; k++) {
                if (k < 0 || k > gBoard.length - 1) continue;
                for (var l = currCell.cellJ - 1; l <= currCell.cellJ + 1; l++) {
                    if (l < 0 || l > gBoard[0].length - 1) continue;
                    if (k === currCell.cellI && l === currCell.cellJ) continue;
                    if (gBoard[k][l].isMine) currCell.minesAroundCount++;
                }
            }
        }
    }
    return gBoard;
}

function addMines(gBoard, firstclick) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var emptyCell = getEmptyCell(gBoard, firstclick);
        gBoard[emptyCell.cellI][emptyCell.cellJ].isMine = true;
    }
}

function renderBoard(board) {
    var strHTML = ``;
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var cellCont;
            var className = (currCell.isMine) ? 'mine' : '';
            if (currCell.isMarked) {
                cellCont = FLAG_IMG;
                currCell.isShown = false;
            }
            else if (currCell.isShown) {
                cellCont = (currCell.isMine) ? MINE_IMG : currCell.minesAroundCount;
                if (currCell.minesAroundCount === 0 && !currCell.isMine) cellCont = '';
            }
            else cellCont = '';
            strHTML += `<td oncontextmenu="cellMarked(this,${i},${j}); return false;" class="cell ${className} ${currCell.isShown ? "isshown" : ''}
            "data-i="${i}" data-j="${j}"
            onclick="cellClicked(this,${i},${j})">
            ${cellCont}`;
            strHTML += '</td>';
        }
        strHTML += '</tr>'
        var elBoard = document.querySelector('tbody');
        elBoard.innerHTML = strHTML

    }
    console.log(gBoard)
}

function cellClicked(elCell, i, j) {
    if (gFirstClick === 0) { firstClick(i, j) };
    if (gBoard[i][j].isShown) return;
    if (gGame.isOn === false) return;
    if (gBoard[i][j].isMarked) return;
    if (gBoard[i][j].minesAroundCount === 0 && gGame.isOn) {
        console.log('hi')
        expandShown(i, j);
    }
    gFirstClick++
    if (gFirstClick === 1) {
        gInterval = setInterval(startTimer, 1000)
    }
    gBoard[i][j].isShown = true;
    renderBoard(gBoard);
    CheckGameOver(i, j)
}

function cellMarked(elCell, i, j) {
    if (gGame.isOn === false) {
        return;
    }
    if (gBoard[i][j].isShown) {
        return;
    }
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
    renderBoard(gBoard)
    CheckGameOver(i, j)
}

function CheckGameOver(i, j) {
    if (gBoard[i][j].isShown && gBoard[i][j].isMine) {
        remainingLives()
    }
    gVictoryCounter = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine || gBoard[i][j].isShown)
                gVictoryCounter++
        }
    }
    if (gVictoryCounter === gLevel.SIZE ** 2) {
        document.querySelector('.restart').innerText = '😎'
        gGame.isOn = false;
        clearInterval(gInterval)
    }
}

function expandShown(i, j) {
    if (gBoard[i][j].isMine) return;
    var currCell = gBoard[i][j]
    for (var k = currCell.cellI - 1; k <= currCell.cellI + 1; k++) {
        if (k < 0 || k > gBoard.length - 1) continue;
        for (var l = currCell.cellJ - 1; l <= currCell.cellJ + 1; l++) {
            if (l < 0 || l > gBoard[0].length - 1) continue;
            if (k === currCell.cellI && l === currCell.cellJ) continue;
            gBoard[k][l].isShown = true;
            renderBoard(gBoard)
        }
    }
}

function difficulty(elBtn) {
    clearInterval(gInterval);
    if (elBtn.innerText === 'Easy') {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        document.querySelector('.restart').innerText = '😅';
    }
    else if (elBtn.innerText === 'Hard') {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
        document.querySelector('.restart').innerText = '😅';
    }
    else if (elBtn.innerText === 'Extreme') {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        document.querySelector('.restart').innerText = '😅';

    }
    initGame()
}

function restart(elBtn) {
    document.querySelector('.restart').innerText = '😅'
    document.querySelector('.hints').innerText = 'Hints: 💡💡💡'
    initGame()
}

function firstClick(i, j) {
    var firstclick = {
        cellI: i,
        cellJ: j,
    };
    addMines(gBoard, firstclick)
    setMinesNegsCount(gBoard)
}

function remainingLives() {
    if (gLivesCount === 3) {
        gLivesCount--;
        document.querySelector('h4 span').innerHTML = LIVE_IMG + ' ' + LIVE_IMG;
        return;
    }
    else if (gLivesCount === 2) {
        gLivesCount--;
        document.querySelector('h4 span').innerHTML = LIVE_IMG
        return;
    }
    else if (gLivesCount === 1) {
        gLivesCount--;
        document.querySelector('h4 span').innerHTML = '';
        return;
    }
    else {
        gGame.isOn = false;
        document.querySelector('.restart').innerText = '🤯'
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
            }
        }
        renderBoard(gBoard)
        clearInterval(gInterval)
    }

}

function safeClick(elBtn) {
    if (gHintCounter > 0) {
        if (gFirstClick === 0) {
            alert('First click is always safe, go for it ! :)')

        } else
            var safeClicks = [];
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine === false && gBoard[i][j].isShown === false) {
                    safeClicks.push(gBoard[i][j])
                }
            }
        }
        var safeClick = safeClicks[getRandomIntInclusive(0, safeClicks.length - 1)];
        var elSafeClick = document.querySelector(`[data-i="${safeClick.cellI}"][data-j="${safeClick.cellJ}"]`);
        elSafeClick.classList.add("safe");
        setTimeout(function () {
            removeSafe(elSafeClick);
        }, 2000);
        gHintCounter--
        if (gHintCounter === 2) {
            document.querySelector('.hints').innerText = 'Hints: 💡💡';
        }
        else if (gHintCounter === 1) {
            document.querySelector('.hints').innerText = 'Hints: 💡';
        }
        else
            document.querySelector('.hints').innerText = 'Hints: ';
    }

}

function removeSafe(elSafeClick) {
    elSafeClick.classList.remove("safe");
}

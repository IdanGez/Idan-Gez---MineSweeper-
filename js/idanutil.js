
function startTimer() {
    var elSeconds = document.getElementById("seconds")
    gseconds++;
    elSeconds.innerHTML = "0" + gseconds;
    if (gseconds > 9) {
        elSeconds.innerHTML = gseconds;
    }
}

function clearTimer() {
    clearInterval(gInterval);
    //update model
    gtens = 0;
    gseconds = 0;
    //update dom
    var elTens = document.getElementById("tens")
    var elSeconds = document.getElementById("seconds")
    elTens.innerHTML = "00";
    elSeconds.innerHTML = "00";

}

function getEmptyCell(gBoard,firstclick) {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if(firstclick.cellI === gBoard[i][j].cellI && firstclick.cellJ === gBoard[i][j].cellJ) continue;
            var currLocation = { cellI: i, cellJ: j }
            emptyCells.push(currLocation)
        }
    }
    var emptyCell = emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)];
    return emptyCell;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
function buildBoard() {
    var mat = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        mat[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            mat[i][j] = {
                cellI: i,
                cellJ: j,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    return mat;
}

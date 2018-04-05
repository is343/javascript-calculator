"use strict";

function addListeners() {
    $("#AC").on("click", function() {
        $('#main').text('');
        $('#sub').text('');
    });
    $("#CE").on("click", function() {
        // if removing operator
        if (isNaN($('#main').text())) {
            minusLast(); // remove
            $('#main').text($('#sub').text()); // then replace numbers with old numbers
        } else {
            // otherwise just remove numbers
            minusLast();
        }
        blankEquals();
    });
    // listeners for numbers
    $(".number").on("click", function() {
        numberControl($(this).text());
    });
    $("#point").on("click", function() {
        warningTest();
        // no multiple points
        if (($('#main').text()).indexOf('.') < 1) {
            // if after a equals has been pressed
            blankEquals();
            // if empty string, or if operator exists
            if ($('#main').text() === '' || isNaN($('#main').text())) {
                // put 0 in front of decimal point
                $('#main').text('0.');
                $('#sub').text($('#sub').text() + '0.');
            } else {
                $('#main').text($('#main').text() + '.');
                $('#sub').text($('#sub').text() + '.');
            }
        }
        sizeLimit();
    });
    // listeners for operators
    $(".operator").on("click", function() {
        operatorControl($(this).text());
    });
    $("#equal").on("click", function() {
        equals();
    });
}


function blankEquals() {
    if ($('#sub').text().indexOf('=') > 1) {
        // blank out the fields after equals has been pressed
        $('#main').text('');
        $('#sub').text('');
    }
}

// removing the last input characters from both fields
function minusLast() {
    //get length of main
    var mainLength = $('#main').text().length;
    //remove the length of input from the end of sub if not 0
    if (mainLength !== 0) {
        $('#sub').text($('#sub').text().slice(0, -mainLength));
        // clear main text
        $('#main').text('');
    }
}

function numberControl(numText) {
    warningTest();
    if ($('#sub').text().indexOf('=') > 1) { // clear the field after equal has been pressed
        $('#main').text('');
        $('#sub').text('');
    }
    if ($('#main').text() === '0') {
        minusLast();
    }
    if (isNaN($('#main').text())) {
        $('#main').text(numText);
    } else {
        $('#main').text($('#main').text() + numText);
    }
    $('#sub').text($('#sub').text() + numText);
    sizeLimit();
}

function operatorControl(operator) {
    warningTest();
    if ($('#main').text() === '') { // main field blank
        if (isNaN($('#sub').text().slice(-2))) { // if operator remains because of CE button
            $('#sub').text($('#sub').text().slice(0, -1)); // remove the trailing operator
        } else { // or do nothing
            return;
        }
    }
    decimalSlice();
    if ($('#sub').text().indexOf('=') > 1) {
        // changing the subtext to equal the answer
        $('#sub').text($('#main').text() + operator);
        $('#main').text(operator);
        return;
    }
    if (isNaN($('#main').text())) {
        minusLast();
    }
    var answer = doMath($('#sub').text());
    if (divideByZero(answer)) {
        return; // break out if there's an error
    }
    $('#main').text(operator);
    $('#sub').text(answer + operator);
    sizeLimit();
}

function equals() {
    warningTest();
    if ($('#main').text() !== $('#sub').text()){ 
      // check if you're pressing equals after only a number with a decimal point
        decimalSlice();
    }
    if ($('#main').text() === '' || isNaN($('#main').text()) || $('#sub').text().indexOf('=') > 1) {
        return;
    }
    if (isEquation($('#sub').text()) !== $('#sub').text()) { // only solve for valid equations
        var answer = doMath(($('#sub').text()));
        if (divideByZero(answer)) {
            return; // break out if there's an error
        }
        $('#sub').text($('#sub').text() + '=' + answer);
        $('#main').text(answer);
        sizeLimit();
    }
}

function decimalSlice() {
    if ($('#sub').text().slice(-1) === '.') {
        $('#sub').text($('#sub').text().slice(0, -1)); // get rid of any trailing decimal points
    }
}

// test for divide by zero errors
function divideByZero(answer) {
    if (answer === Infinity || isNaN(answer)) {
        $('#main').text('');
        $('#sub').text('Divide by zero');
        return true;
    }
    return false;
}

// test if it is a valid equation before we solve
function isEquation(mainText) {
    var index;
    for (var i = 0; i < mainText.length; i++) {
        if (mainText[i] === '+' || mainText[i] === '−' || mainText[i] === '×' || mainText[i] === '÷') {
            index = i;
        }
    }
    if (isNaN(index)) {
        return mainText;
    }
    return index;
}

function doMath(mainText) {
    // str => str or num
    var index = isEquation(mainText);
    if (index === mainText) { // for the math that is done without pressing equals
        return mainText;
    }
    var temp;
    switch (mainText[index]) {
        case '+':
            temp = (Number(mainText.slice(0, index)) + Number(mainText.slice(index + 1))).toFixed(4);
            break;
        case '−':
            temp = (Number(mainText.slice(0, index)) - Number(mainText.slice(index + 1))).toFixed(4);
            break;
        case '×':
            temp = (Number(mainText.slice(0, index)) * Number(mainText.slice(index + 1))).toFixed(4);
            break;
        case '÷':
            temp = (Number(mainText.slice(0, index)) / Number(mainText.slice(index + 1))).toFixed(4);
            break;
    }
    return Number(temp); // get rid of trailing zeros
}

function sizeLimit() {
    var main = $('#main').text();
    var sub = $('#sub').text();
    if (main.length > 12 || sub.length > 33) {
        $('#main').text('');
        $('#sub').text('Limit exceeded');
    }
}

function warningTest() {
    if ($('#sub').text() === 'Limit exceeded' || $('#sub').text() === 'Divide by zero') { // if char limit warning is shown
        $('#sub').text('');
    }
}

$(document).ready(function() {
    addListeners();
});
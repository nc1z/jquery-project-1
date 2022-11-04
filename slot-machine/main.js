import $ from "jquery";

// STATE
let balance = localStorage.getItem("bal");
if (!balance) {
  balance = 1000;
}
let position = 0;

const results = {
  digits: [1, 2, 3],
};

// GETTING ELEMENTS
const input = $("#positionSize");
const playButton = $("#play");
const balanceDisplay = $("#balance");
const positionDisplay = $("#position");

// WINDOW ONLOAD

$(() => {
  balanceDisplay.text(`Account balance: $${balance}`);
});

// EVENT LISTENERS

input.change((e) => {
  position = Number(e.target.value);
});

playButton.click(() => {
  if (balance == 0) {
    alert("You are bankrupt. Game will be reset");
    balance = 1000;
    localStorage.setItem("bal", balance);
    return render();
  }
  if (balance - position < 0) {
    alert("Insufficient balance");
  } else {
    balance -= position;
    localStorage.setItem("bal", balance);
    roll();
  }
  checkWin();
  return render();
});

// FUNCTIONS

const render = () => {
  balanceDisplay.text(`Account balance: $${balance}`);
};

const roll = () => {
  // Generate random numbers and update state array
  results.digits = results.digits.map((n) => {
    return Math.floor(Math.random() * 9);
  });

  // Reset results
  $("#display").children().remove();

  // Map out new results
  results.digits.map((n) => {
    const res = $("<span>").addClass("res");
    res.text(n);
    $("#display").append(res);
    return;
  });
};

const checkWin = () => {
  if (results.digits.every((n) => n === 7)) {
    balance += position * 10;
  } else if (results.digits.some((n) => n === 7)) {
    balance += position * 2;
  }
  input.attr("value", 0);
};

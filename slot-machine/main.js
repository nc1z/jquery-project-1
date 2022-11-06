import $ from "jquery";
import moment from "moment";

// STATE ---------------------->
let balance = localStorage.getItem("bal");
if (!balance) {
  balance = 1000;
}
let position = 0;

const results = {
  digits: [1, 2, 3],
  history: [],
};

// GETTING ELEMENTS ---------------------->
const input = $("#positionSize");
const playButton = $("#play");
const balanceDisplay = $("#balance");

// WINDOW ONLOAD ---------------------->

$(() => {
  balanceDisplay.text(`Account balance: $${balance}`);
});

// EVENT LISTENERS ---------------------->

input.on("change", (e) => {
  position = Number(e.target.value);
});

playButton.on("click", () => {
  if (position == 0) {
    return alert("Please enter a valid amount");
  }
  if (balance == 0) {
    return reset();
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

// FUNCTIONS ---------------------->

const render = () => {
  balanceDisplay.text(`Account balance: $${balance}`);

  $("#history").children().remove();

  if (results.history.length > 0) {
    results.history.map((n) => {
      const historyRow = $("<tr>").addClass("tablerow");
      $("#history").append(historyRow);
      const history = $("<td>").addClass("tablehistory");
      const pnl = $("<td>").addClass("tablehistory");
      historyRow.append(history, pnl);
      history.text(`${n[1]}`);
      pnl.text(`${n[0]}`);
      if (n[0] > 0) {
        pnl.addClass("gain");
      } else if (n[0] < 0) {
        pnl.addClass("loss");
      }
      return;
    });
  }

  while (results.history.length > 10) {
    results.history.pop();
  }
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

const reset = () => {
  alert("You are bankrupt. Game will be reset");
  results.history = [];
  balance = 1000;
  localStorage.setItem("bal", balance);
  return render();
};

// WIN CONDITIONS ---------------------->
const checkWin = () => {
  if (results.digits.every((n) => n === 7)) {
    results.history.unshift([
      position * 9,
      moment().format("MMM Do YY, h:mm:ss a"),
    ]);
    balance += position * 10;
  } else if (results.digits.some((n) => n === 7)) {
    results.history.unshift([
      position,
      moment().format("MMM Do YY, h:mm:ss a"),
    ]);
    balance += position * 2;
  } else {
    results.history.unshift([
      -position,
      moment().format("MMM Do YY, h:mm:ss a"),
    ]);
  }
  input.attr("value", 0);
};

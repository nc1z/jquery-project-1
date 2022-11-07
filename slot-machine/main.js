import $ from "jquery";
import moment from "moment";

// STATE ---------------------->
let balance = localStorage.getItem("bal");
if (!balance) {
  balance = 1000;
}
let position = 0;

const results = {
  digits: [1, 2, 3, 4, 5],
  history: [],
};

// GETTING ELEMENTS ---------------------->
const input = $("#positionSize");
const playButton = $("#play");
const balanceDisplay = $("#balance");
const percentButtons = $(".percent");
const resetButton = $("#reset");

// WINDOW ONLOAD ---------------------->

$(() => {
  balanceDisplay.text(`Account balance: $${balance}`);
});

// EVENT LISTENERS ---------------------->

input.on("change", (e) => {
  position = Number(e.target.value);
});

playButton.on("click", async () => {
  if (balance >= 10000) {
    alert("Casino is bankrupt. You won!");
    return reset();
  }
  if (balance == 0) {
    return reset();
  }
  if (position == 0) {
    return alert("Please enter a valid amount");
  }
  if (balance - position < 0) {
    return alert("Insufficient balance");
  } else {
    balance -= position;
    localStorage.setItem("bal", balance);
    roll();
  }
  checkWin();
  return render();
});

percentButtons.on("click", (e) => {
  const amt = Math.floor(Number(e.target.value) * balance);
  input.val(amt);
  position = amt;
});

resetButton.on("click", () => {
  return reset();
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
      const combo = $("<td>").addClass("tablehistory");
      const pnl = $("<td>").addClass("tablehistory");
      const streak = $("<td>").addClass("tablehistory");
      historyRow.append(history, combo, pnl, streak);
      streak.text(`${n[3]}`);
      combo.text(`${n[2]}`);
      history.text(`${n[1]}`);
      pnl.text(`${n[0]}`);
      if (n[0] > 0) {
        pnl.addClass("gain");
      } else if (n[0] < 0) {
        pnl.addClass("loss");
      }
      return;
    });
  } else {
    $("#history").append(`<span class="placeholder">P/L History</span>`);
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

  // TEST CONDITIONS: UNCOMMENT TO HACK CASINO -->
  // results.digits = [7, 7, 7, 7, 7];
  // results.digits = [6, 6, 6, 6, 6];
  // results.digits = [1, 2, 3, 4, 5];
  // results.digits = [1, 2, 3, 3, 5];
  // results.digits = [5, 4, 3, 2, 1];

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
  alert("Game will be reset");
  results.history = [];
  balance = 1000;
  localStorage.setItem("bal", balance);
  return render();
};

const isStraight = (arr) => {
  let res = true;
  if (arr[0] < arr[1]) {
    for (let i = 1; i < arr.length; i++) {
      if (res) {
        res = arr[i] - arr[i - 1] == 1;
      }
    }
  } else {
    for (let i = 1; i < arr.length; i++) {
      if (res) {
        res = arr[i] - arr[i - 1] == -1;
      }
    }
  }
  return res;
};

// WIN CONDITIONS ---------------------->
const checkWin = () => {
  // Storing and mapping out count of each result
  const counter = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  results.digits.forEach((n) => {
    counter[n] += 1;
  });

  const keys = Object.keys(counter);
  const values = keys.map((key) => {
    return counter[key];
  });
  const maxVal = Math.max.apply(null, values);

  // Check Gains & Losses
  if (isStraight(results.digits)) {
    // COMBO [12X]
    results.history.unshift([
      position * 11,
      moment().format("h:mm:ss a"),
      results.digits,
      "STRAIGHT[12X]",
    ]);
    balance += position * 12;
    alert("STRAIGHT COMBO!");
  } else if (counter[7] == 5) {
    // JACKPOT 777 [20X]
    results.history.unshift([
      position * 19,
      moment().format("h:mm:ss a"),
      results.digits,
      "JACKPOT[20X]",
    ]);
    balance += position * 10;
    alert("JACKPOT!");
  } else if (counter[7] >= 3) {
    // NUMBER 7 STREAK [8X]
    results.history.unshift([
      position * 7,
      moment().format("h:mm:ss a"),
      results.digits,
      "7PAIR[8X]",
    ]);
    balance += position * 8;
  } else if (counter[7] == 2 && maxVal > 2) {
    // PAIR 7 + OTHER STREAK [8X]
    results.history.unshift([
      position * 7,
      moment().format("h:mm:ss a"),
      results.digits,
      "PAIR7&STREAK[8X]",
    ]);
    balance += position * 8;
  } else if (counter[7] == 2) {
    // NUMBER 7 TWICE [4X]
    results.history.unshift([
      position * 3,
      moment().format("h:mm:ss a"),
      results.digits,
      "7TWICE[4X]",
    ]);
    balance += position * 4;
  } else if (maxVal == 5) {
    // ANY NUMBER FULL STREAK [15X]
    results.history.unshift([
      position * 14,
      moment().format("h:mm:ss a"),
      results.digits,
      "FULLSTREAK[15X]",
    ]);
    balance += position * 15;
    alert("FULL STREAK!!");
  } else if (maxVal >= 3) {
    // ANY NUMBER STREAK [8X]
    results.history.unshift([
      position * 7,
      moment().format("h:mm:ss a"),
      results.digits,
      "STREAK[8X]",
    ]);
    balance += position * 8;
  } else {
    // LOSS
    results.history.unshift([
      -position,
      moment().format("h:mm:ss a"),
      results.digits,
      "LOSS[-1X]",
    ]);
  }
};

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

playButton.on("click", () => {
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
  alert("Game will be reset");
  results.history = [];
  balance = 1000;
  localStorage.setItem("bal", balance);
  return render();
};

const isStraight = (arr) => {
  let res = true;
  if (Math.min(arr) >= 0) {
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
    // COMBO [6X]
    results.history.unshift([
      position * 5,
      moment().format("h:mm:ss a"),
      results.digits,
      "COMBO[6X]",
    ]);
    balance += position * 6;
    alert("Combo!");
  } else if (counter[7] == 3) {
    // JACKPOT 777 [20X]
    results.history.unshift([
      position * 19,
      moment().format("h:mm:ss a"),
      results.digits,
      "JACKPOT[20X]",
    ]);
    balance += position * 10;
    alert("JACKPOT!");
  } else if (counter[7] > 0) {
    if (counter[7] == 2) {
      // NUMBER 7 PAIR [6X]
      results.history.unshift([
        position * 5,
        moment().format("h:mm:ss a"),
        results.digits,
        "7PAIR[6X]",
      ]);
      balance += position * 6;
    } else if (counter[7] == 1 && maxVal > 1) {
      // NUMBER 7 + OTHER PAIR [4X]
      results.history.unshift([
        position * 3,
        moment().format("h:mm:ss a"),
        results.digits,
        "PAIRWITH7[4X]",
      ]);
      balance += position * 4;
    } else {
      // NUMBER 7 ONCE [3X]
      results.history.unshift([
        position * 2,
        moment().format("h:mm:ss a"),
        results.digits,
        "7ONCE[3X]",
      ]);
      balance += position * 3;
    }
  } else if (maxVal == 3) {
    // ANY NUMBER THRICE [8X]
    results.history.unshift([
      position * 7,
      moment().format("h:mm:ss a"),
      results.digits,
      "TRIPLE[8X]",
    ]);
    balance += position * 8;
  } else if (maxVal > 1) {
    // ANY NUMBER TWICE [3X]
    results.history.unshift([
      position * 2,
      moment().format("h:mm:ss a"),
      results.digits,
      "DOUBLE[3X]",
    ]);
    balance += position * 3;
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

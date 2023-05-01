'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = acc => {
  containerMovements.innerHTML = '';
  acc.movements.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${movement}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(movements);

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, val) => acc + val, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// calcDisplaySummary(account1.movements);

// Short way of doing it
let createUsernames = accs => {
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
  return accs;
};

console.log(createUsernames(accounts));

const updateUI = acc => {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// Event Handler
let currentAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username == inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

// Transfer money
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    receiverAcc.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

// Loan button using "some"
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // returns true
    console.log('yes');

    // Add loan to account movements of current account
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

// Find Index -> Close account
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    console.log('test2');
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/////////////////////////////////////////////////
// Map
/////////////////////////////////////////////////
// const euroToUSD = 1.1;
// const b = movements.map(mov => {
//   mov * euroToUSD;
// });
// console.log(b);

// const b = movements.map(
//   (movement, i) =>
//     `Movement ${i + 1}: You ${movement > 0 ? 'deposited' : 'withdrew'} ${
//       movement < 0 ? Math.abs(movement) : movement
//     }`
// );
// console.log(b);

/////////////////////////////////////////////////
// Filter
/////////////////////////////////////////////////

// Long way of doing it
// const deposits = movements.filter(isAboveZero);
// function isAboveZero(movement) {
//   if (movement > 0) {
//     return true;
//   }
// }

// Short way of doing it
// const deposits = movements.filter(mov => mov > 0);
// const withdrawals = movements.filter(mov => mov < 0);

// console.log(deposits);
// console.log(withdrawals);

// Different way of doing it with for of statement
// let depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

/////////////////////////////////////////////////
// Reduce
/////////////////////////////////////////////////

// const array1 = [5, 6, 7, 10, 20];

// // Accumulator is like a snowball
// const sum = array1.reduce((accum, currVal) => accum + currVal, 0); // the 0 changes the starting value; 0 = 48, 10 = 58
// console.log(sum);

// Different way of doing a reduce:
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// Maximum value using functions which can call on objects
// const maxVal = movement => {
//   const ab = movement.reduce((accum, val) => {
//     return accum > val ? accum : val;
//   }, movement[0]);
//   return ab;
// };
// console.log(maxVal(account1.movements));
// const calcDisplayBalance = movements => {
//   const balance = movements.reduce((acc, mov) => acc + mov, 0);
//   labelBalance.textContent = `${balance} EUR`;
// };

// Non-function reduce with manually typing account
// const ab4 = account1.movements.reduce((accum, val) => {
//   return accum > val ? accum : val;
// }, account1.movements[0]);
// console.log(ab4);

/////////////////////////////////////////////////
// Chaining Array Methods
/////////////////////////////////////////////////

// const eurToUsd = 1.1;

// // PIPELINE
// let totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((accum, val) => accum + val, 0);
// console.log(totalDepositsUSD);

/////////////////////////////////////////////////
// Find method
/////////////////////////////////////////////////

// const z = movements.find(mov => mov < 0);
// console.log(z);

// const account = accounts.find(acc => acc.username == 'js');
// console.log(account);

// Some and Every !IMPORTANT

// console.log(movements);

// // ONLY CHECKS FOR EQUALITY
// console.log(movements.includes(-130));

// // CHECKS FOR A CONDITION

// console.log(movements.some(mov => mov === -130)); // Checks for equality but doesn't make sense, use "includes" instead

// const anyDeposits = movements.some(mov => mov > 1600);
// console.log(anyDeposits);

const gd = [100, -50, 0, -100, 50];
console.log(gd);

// Sort algorithm
const c = gd.sort(function (a, b) {
  if (a > b) return 1;
  if (b > a) return -1;
});

console.log(c);

function test(a, b) {
  return a + b;
}

const add1 = (a, b) => {
  return a + b;
};

console.log(test(1, 4) + ' regular ES6 function');

console.log(add1(1, 4) + ' arrow expression function');

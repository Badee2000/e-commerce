let sum = {};
let x = 0;
for (let i = 0; i < 10; i++) {
  if (!sum[x]) {
    sum[x] = 0;
  }
  if (i > 5) x = 1;
  sum[x]++;
}

console.log(sum);

function merge(left, right) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSort(list) {
  if (list.length <= 1) return list;

  const mid = Math.floor(list.length / 2);
  const left = mergeSort(list.slice(0, mid));
  const right = mergeSort(list.slice(mid));

  return merge(left, right);
}

console.log(mergeSort([3, 9]));
console.log(mergeSort([2, 6]));
console.log(mergeSort([3, 1]));
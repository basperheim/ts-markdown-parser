/**
 * Counts the occurrences of a target, trimmed string in an array using functional methods.
 *
 * @param {string[]} arr - The array of strings to be processed.
 * @param {string} target - The target string to count.
 * @returns {number} - The count of occurrences of the target string.
 */
export const countOccurrences = (arr: string[], target: string): number => {
  // Trim each string in the array
  const trimmedArray = arr.map((str) => str.trim());

  // Filter the array to get only the strings that match the target
  const matchingItems = trimmedArray.filter((str) => str === target);

  // Return the length of the filtered array as the count of occurrences
  return matchingItems.length;
};

/**
 * Counts the occurrences of a target, trimmed string in an array.
 *
 * @param {string[]} arr
 * @param {string} target
 * @returns {number}
 */
export const countOccurrencesBoomer = (arr: string[], target: string): number => {
  if (!arr || !arr.length) {
    return 0;
  }

  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    const str = arr[i].trim();
    if (target === str) {
      total++;
    }
  }

  return total;
};

// Generate a large array for testing
const generateLargeArray = (size: number, target: string): string[] => {
  const result: string[] = [];
  for (let i = 0; i < size; i++) {
    // Randomly choose to add either the target string or some other string
    if (Math.random() < 0.1) {
      result.push(`  ${target}  `);
    } else {
      result.push(`  non-target ${i}  `);
    }
  }
  return result;
};

// Define the size of the large array and target string
const arraySize = 1000000; // 1 million strings
const targetString = "target";

// Generate the large array
const largeArray = generateLargeArray(arraySize, targetString);

// Time the functional method
console.time("Functional Method");
const functionalResult = countOccurrences(largeArray, targetString);
console.timeEnd("Functional Method");
console.log("Functional Method Result:", functionalResult);

// Time the traditional loop method
console.time("Traditional Loop Method");
const loopResult = countOccurrencesBoomer(largeArray, targetString);
console.timeEnd("Traditional Loop Method");
console.log("Traditional Loop Method Result:", loopResult);

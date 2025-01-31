export default function isUnique(arr) {
    const seen = new Set();
    return arr.filter(item => {
      if (!seen.has(item)) {
        seen.add(item);
        return true;
      }
      return false;
    })}
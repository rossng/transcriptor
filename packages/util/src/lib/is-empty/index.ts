// https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

export default isEmpty;

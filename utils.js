function createStatusCodeError(statusCode, message = null) {
  return Object.assign(new Error(), {
    statusCode,
    message,
  });
}

function getSetsIntersection(setA, setB) {
  const intersection = new Set([...setA].filter(code => setB.has(code)));
  // const ret = intersection.size === 1 ? intersection : new Set();
  // return ret;
  return intersection;
}

module.exports = {
  createStatusCodeError,
  getSetsIntersection
}

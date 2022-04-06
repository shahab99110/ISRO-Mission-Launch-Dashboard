const DEFAULT_FLIGHT_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_FLIGHT_NUMBER;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;

  const skip = (page - 1) * limit;

  return {
    limit,
    skip,
  };
}

module.exports = {
  getPagination,
};

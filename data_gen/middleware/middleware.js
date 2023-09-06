const sendResponse = (res, statusCode, msg, data) => {
  res.status(statusCode).json({status: statusCode, message: msg, data: data ? data : null});
}

module.exports = {
  sendResponse
}

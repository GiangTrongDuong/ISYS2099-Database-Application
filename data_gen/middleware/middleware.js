
const sendResponse = (res, statusCode, msg, data) => {
  res.status(!!statusCode ? statusCode : 200).json({message: !!msg ? msg : 'ok', data: data});
}

module.exports = {
  sendResponse
}

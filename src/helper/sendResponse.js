class SendResponse {
  capitalizeWord(word) {
    const capWrd = word.split("")[0].toUpperCase() + word.slice(1);
    return capWrd;
  }

  error(res, message, statusCode, data) {
    const response = {
      message: message ?? this.capitalizeWord("error-message"),
      statusCode: statusCode ?? 400,
      data,
    };
    return res.status(statusCode).json(response);
  }

  success(res, message, statusCode, data) {
    const response = {
      message: message ?? this.capitalizeWord("success-message"),
      statusCode: statusCode ?? 200,
      data: data ?? null,
    };
    return res.status(statusCode).json(response);
  }
}
module.exports = SendResponse;

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode
        this.operational = true
    }
}

module.exports = AppError
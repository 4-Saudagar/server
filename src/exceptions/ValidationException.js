class ValidationException extends Error {
    constructor(code, message, type = "BAD_REQUEST") {
      super(message);
      this.code = code;
      this.type = type;
    } 
  }



module.exports = ValidationException;
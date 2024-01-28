class ApiError extends Error {
    constructor(status, message, details = null) {
      super(message);
      this.status = status;
      this.details = details;
    }
  }
  
  export default ApiError;
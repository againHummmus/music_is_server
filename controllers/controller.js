
class Controller {

  getErrors(...errors) {
    const filteredErrors = errors.filter((error) => error != null);
    return filteredErrors.length > 0 ? filteredErrors : null;
  }

  formResponse(data, ...errors) {
    return ({data: data, errors: this.getErrors(...errors)})
  }
}

module.exports = Controller;

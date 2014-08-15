+function (window) {

  var Formable = function (json, output) {
    if (!json) {
      throw new Error('Formable needs a valid JSON source to work with. [code 1].');
    }

    this.output = json;
    this.json = json;

    this.htmlFormFragment = document.createDocumentFragment();
    this.htmlForm = this.generateForm();

    return this.htmlForm;
  };

  Formable.prototype.builder = function () {

  };

  Formable.prototype.generateForm = function () {
    if (this.json.form === undefined) {
      throw new Error('Missing property "Form". [code 3].');
    }

    return this.builder(this.json.form).content;
  };

  Formable.prototype.appendFormTo = function (output) {
    var output ||= this.output;

    if (!output) {
      throw new Error('No output to append form. [code 2].');
    }

    document.querySelector(output).appendChild(this.htmlForm);
  };

}(window);

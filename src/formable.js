+function () {
  'use strict';

  var Formable = function (json, output) {
    if (!json) {
      throw new Error('Formable needs a valid JSON source to work with. [code 1].');
    }

    this.output = output;
    this.json = json;

    this.htmlFormFragment = document.createDocumentFragment();
    this.htmlForm = this.generateForm();

    if (this.output !== undefined) {
      this.appendFormTo();
    }

    return this.htmlForm;
  };

  Formable.prototype.generateForm = function () {
    var form = undefined,
        fieldset = undefined,
        jsonForm = this.json.form,
        jsonFieldset = jsonForm.fieldset;

    if (this.json.form === undefined) {
      throw new Error('Missing property "Form". [code 3].');
    }

    form = document.createElement('form');

    if (jsonForm.title) { form.setAttribute('title', jsonForm.title); }
    if (jsonForm.url) { form.setAttribute('action', jsonForm.url); }
    if (jsonForm.method) { form.setAttribute('method', jsonForm.method); }
    if (jsonForm.id) { form.setAttribute('id', jsonForm.id); }
    if (jsonForm.class) { form.setAttribute('class', jsonForm.class); }

    if (jsonForm.fieldset === undefined) {
      throw new Error('Missing property "Fieldset". [code 4]');
    }

    if (jsonForm.length === 0) {
      throw new Error('Fieldset has no input elements. [code 5]');
    }

    fieldset = document.createElement('fieldset');

    for (var idx = 0, numberOfFields = jsonFieldset.length; idx < numberOfFields; idx++) {
      var jsonInput = jsonFieldset[idx],
          inputs = document.createDocumentFragment(),
          container = document.createElement('div'),
          label,
          input;

      if (jsonInput.type === undefined) {
        throw new Error('Missing property "type". [code 6]');
      }

      // text
      if (jsonInput.type === 'text') {
        label = this.createBaseLabel(jsonInput.label, jsonInput.name);
        input = this.createBaseInput(jsonInput);
      }

      // textarea
      if (jsonInput.type === 'textarea') {
        label = this.createBaseLabel(jsonInput.label, jsonInput.name);
        input = this.createBaseTextarea(jsonInput);

        if (jsonInput.value !== undefined) {
          input.innerText = jsonInput.value;
        }

        if (jsonInput.rows === undefined) {
          input.setAttribute('rows', 5);
        }else{
          input.setAttribute('rows', jsonInput.rows);
        }
      }

      // range field
      if (jsonInput.type === 'range') {
        label = this.createBaseLabel(jsonInput.label, jsonInput.name);
        input = this.createBaseInput(jsonInput);

        if (jsonInput.min !== undefined) {input.setAttribute('min', jsonInput.min);}
        if (jsonInput.max !== undefined) {input.setAttribute('max', jsonInput.max);}
        if (jsonInput.step !== undefined) {input.setAttribute('step', jsonInput.step);}
      }

      // radio buttons or checkboxes
      if (jsonInput.type === 'radio' || jsonInput.type === 'checkbox') {
        var options = document.createDocumentFragment(),
            label;

        if (jsonInput.values === undefined) {
          throw new Error(' [Missing property "values". code 7]');
        }

        if (jsonInput.values.length < 1) {
          throw new Error('Values has no options. [code 8]');
        }

        label = this.createBaseLabel(jsonInput.label, jsonInput.name);

        for (var j = 0, numberOfOptions = jsonInput.values.length; j < numberOfOptions; j++) {
          var currentOption = jsonInput.values[j],
              inputContainer = document.createElement('div'),
              checked = false,
              optionLabel,
              optionInput;

          if (currentOption.length >= 3) {
            checked = true;
          }

          optionLabel = this.createBaseLabel(currentOption[0], jsonInput.name);
          optionInput = this.createBaseInput({
            type: jsonInput.type,
            name: jsonInput.name,
            class: jsonInput.class,
            value: currentOption[1]
          });

          optionInput.checked = checked;

          inputContainer.appendChild(optionInput);
          inputContainer.appendChild(optionLabel);
          options.appendChild(inputContainer);
        }

        input = options;
      }

      container.appendChild(label);
      container.appendChild(input);
      fieldset.appendChild(container);
    }

    form.appendChild(fieldset);
    this.htmlFormFragment.appendChild(form);

    return this.htmlFormFragment;
  };

  Formable.prototype.createBaseInput = function (inputAttributes) {
    var input = document.createElement('input');

    if (inputAttributes.type !== undefined) { input.setAttribute('type', inputAttributes.type); }
    if (inputAttributes.id !== undefined) { input.setAttribute('id', inputAttributes.id); }
    if (inputAttributes.class !== undefined) { input.setAttribute('class', inputAttributes.class); }
    if (inputAttributes.name !== undefined) { input.setAttribute('name', inputAttributes.name); }
    if (inputAttributes.value !== undefined) { input.value = inputAttributes.value; }

    return input;
  };

  Formable.prototype.createBaseTextarea = function (inputAttributes) {
    var input = document.createElement('textarea');

    if (inputAttributes.id !== undefined) {input.setAttribute('id', inputAttributes.id);}
    if (inputAttributes.class !== undefined) {input.setAttribute('class', inputAttributes.class);}
    if (inputAttributes.name !== undefined) {input.setAttribute('name', inputAttributes.name);}

    return input;
  };

  Formable.prototype.createBaseLabel = function (text, forAttr, formAttr) {
    var label = document.createElement('label');

    if (forAttr !== undefined) {
      label.setAttribute('for', forAttr);
    }

    if (formAttr !== undefined) {
      label.setAttribute('formAttr', formAttr);
    }

    label.innerText = text;

    return label;
  };

  Formable.prototype.appendFormTo = function (output) {
    var output = output || this.output;

    if (!output) {
      throw new Error('No output to append form. [code 2].');
    }

    if (document.querySelectorAll(output).length > 0) {
      document.querySelector(output).appendChild(this.htmlForm);
    }
  };

  window.Formable = Formable;

}();

const Handlebars = require("handlebars");

const handleBar = {
  generateFieldCode: async (field) => {
    try {
      const template = Handlebars.compile(field.SNIPPET_CONTENT);
      const data = {
        fieldName: field.FIELD_NAME,
        placeholder: field.PLACEHOLDER,
        sizeClass: field.FIELD_SIZE || "form-control",
        validations: field.VALIDATIONS_JSON
          ? JSON.stringify(field.VALIDATIONS_JSON)
          : null,
      };
      const result = template(data);
      return result;
    } catch (error) {
      console.error("Error generating field code: ", error.message);
      return null;
    }
  },
};

module.exports = handleBar;

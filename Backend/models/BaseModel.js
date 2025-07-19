const { model } = require("mongoose");

const { BaseSchema } = require("../schema/BaseSchema");

const BaseModel = new model("Base", BaseSchema);

module.exports = BaseModel;

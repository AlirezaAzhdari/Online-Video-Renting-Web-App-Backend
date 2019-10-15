const { User } = require("../../../Models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("users.generateAuthToken", () => {
  it("should return a valid jwt", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});

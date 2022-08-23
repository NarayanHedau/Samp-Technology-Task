const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");

let auth = require("../auth");
let encryptToken = require("../Controller/token_controller");
const userController = require("../Controller/user_controller");
require("../model/Tasks/tasks.model");
require("../model/User/user.model");
require("../Database/db");
const User = mongoose.model("User");
const Task = mongoose.model("Task");

const app = express();
app.use(express.json());

// User Registeration API
app.post("/userRegister", async (req, res) => {
  try {
    console.log(req.body);

    if (req.body.role !== "Admin") {
      let registerData = await userController.register(req.body);
      if (registerData) {
        res.status(200).json({
          status: "SUCCESS",
          code: 200,
          message: "User registeed successfully",
          data: registerData,
        });
      } else {
        res.status(301).json({
          status: "ERROR",
          code: 301,
          message: "User cannot be Registered",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(301).json({
      status: "ERROR",
      code: 301,
      message: "User already Registered",
    });
  }
});

// Admin Registration API
app.post("/adminRegister", async (req, res) => {
  try {
    if (req.body.role == "Admin") {
      let registerData = await userController.register(req.body);
      if (registerData) {
        res.status(200).json({
          status: "SUCCESS",
          code: 200,
          message: "Admin registeed successfully",
          data: registerData,
        });
      } else {
        res.status(301).json({
          status: "ERROR",
          code: 301,
          message: "Admin cannot be Registered",
          data: {},
        });
      }
    }
  } catch (error) {
    res.status(301).json({
      status: "ERROR",
      code: 301,
      message: "Admin already Registered",
      data: {},
    });
  }
});

// Login API
app.post("/login", (req, res) => {
  userController
    .login(req.body)
    .then((resData) => {
      var userValidData = _.pick(resData, [
        "_id",
        "name",
        "email",
        "profile_pic",
        "role",
      ]);
      encryptToken
        .encrypt(req, userValidData)
        .then((resToken) => {
          userValidData["token"] = resToken.token;
          var responseobj = {
            id: resData._id,
            name: resData.name,
            email: resData.email,
            profile_pic: resData.profile_pic,
            role: resData.role,
            accessToken: userValidData.token,
          };
          res.status(200).json({
            status: "SUCCESS",
            code: 200,
            message: "Login successful",
            data: responseobj,
          });
        })
        .catch((error) => {
          console.error("error", error);
          res.status(301).json({
            status: "ERROR",
            code: 301,
            message: "Something went wrong",
            data: {},
          });
        });
    })
    .catch((error) => {
      console.error("error", error);
      res.status(505).json({
        status: "ERROR",
        code: 301,
        message: "Unable to login",
        data: {},
      });
    });
});

// Create Task API
app.post("/createTask", auth, async (req, res) => {
  try {
    if (req.role == "Developer") {
      res.status(401).json({
        status: "ERROR",
        code: 401,
        message: "Developer don't have access to create tasks",
        data: {},
      });
    } else {
      const createTask = await Task(req.body).save();
      res.status(200).json({
        status: "SUCCESS",
        code: 200,
        message: "Task Created successfully",
        data: createTask,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(301).json({
      status: "ERROR",
      code: 301,
      message: "Something went wrong",
      data: {},
    });
  }
});

app.put("/updateTask", auth, async (req, res) => {
  try {
    let updateObj = {};
    if (req.body.title) updateObj.title = req.body.title;
    if (req.body.description) updateObj.description = req.body.description;
    if (req.body.status) updateObj.status = req.body.status;
    if (req.body.created_date) updateObj.created_date = req.body.created_date;
    if (req.body.created_by) updateObj.created_by = req.body.created_by;
    if (req.body.tags) updateObj.tags = req.body.tags;
    updateObj.updated_date = new Date();
    const updateTask = await Task.findOneAndUpdate(
      { _id: req.body._id },
      updateObj
    );
    if (updateTask) {
      const result = await Task.findById({ _id: updateTask._id });
      res.status(200).json({
        status: "SUCCESS",
        code: 200,
        message: "Task Created successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(301).json({
      status: "ERROR",
      code: 301,
      message: "Something went wrong",
      data: {},
    });
  }
});

app.delete("/deleteTask", auth, async (req, res) => {
  try {
    if (req.role == "Admin") {
      const deleteTask = await Task.findOneAndDelete({ _id: req.body._id });
      res.status(200).json({
        status: "SUCCESS",
        code: 200,
        message: "Task deleted successfully",
        data: {},
      });
    } else {
      res.status(401).json({
        status: "ERROR",
        code: 401,
        message: "You don't have access to delete the task",
        data: {},
      });
    }
  } catch (error) {
    console.log(error);
    res.status(301).json({
      status: "ERROR",
      code: 301,
      message: "Something went wrong",
      data: {},
    });
  }
});

// Get All Task API with Pagination
app.get("/getAll/task", async (req, res) => {
  try {
    let page = req.query.page - 1;
    const getAllTask = await Task.find({})
      .skip(page * req.query.limit)
      .limit(req.query.limit);
    console.log(getAllTask);
    res.status(200).json({
      status: "SUCCESS",
      code: 200,
      data: getAllTask,
    });
  } catch (error) {
    console.log(error);
    res.status(301).json({
      status: "ERROR",
      code: 301,
      message: "Something went wrong",
      data: {},
    });
  }
});

// get task by created date
app.get("/getby/date", async (req, res) => {
  try {
    let { date } = req.query;
    const result = await Task.find({ created_date: date });
    res.status(200).json({
      status: "SUCCESS",
      code: 200,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(301).json({
      status: "ERROR",
      code: 301,
      message: "Something went wrong",
      data: {},
    });
  }
});

// get task by updated date
app.get("/getby/updated_date", async (req, res) => {
  try {
    let { date } = req.query;
    const result = await Task.find({ updated_date: date });
    res.status(200).json({
      status: "SUCCESS",
      code: 200,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(301).json({
      status: "ERROR",
      code: 301,
      message: "Something went wrong",
      data: {},
    });
  }
});

// get task by status
app.get("/getBy/status", async (req, res) => {
  try {
    let { status } = req.query;
    const result = await Task.find({ status: status });
    res.status(200).json({
      status: "SUCCESS",
      code: 200,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(301).json({
      status: "ERROR",
      code: 301,
      message: "Something went wrong",
      data: {},
    });
  }
});

app.get("/getBy/:tags", async (req, res) => {
  try {
    let result = await Task.find({ tags: req.params.tags });
    res.status(200).json({
      status: "SUCCESS",
      code: 200,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(301).json({
      status: "ERROR",
      code: 301,
      message: "Something went wrong",
      data: {},
    });
  }
});
app.listen(3000, () => {
  console.log("Connected");
});

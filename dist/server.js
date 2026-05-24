

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";

// src/modules/user/user.route.ts
import { Router } from "express";

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  connectionString: process.env.CONNECTIONSTRING,
  port: process.env.PORT,
  seckey: process.env.SECRETKEY,
  refreshkey: process.env.REFRESHKEY
};
var config_default = config;

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.connectionString
});
var initDB = async () => {
  try {
    await pool.query(`
               CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(50), -- Name er length barano hoyeche
                    email VARCHAR(100) UNIQUE NOT NULL, -- Email er length barano hoyeche
                    password TEXT NOT NULL, -- Password er length oboshshoi besi hote hobe
                    is_active BOOLEAN DEFAULT true,
                    age INT,
                    role VARCHAR(10) DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT NOW(), -- Typo thik kora hoyeche (creat_at -> created_at)
                    updated_at TIMESTAMP DEFAULT NOW()  -- Typo thik kora hoyeche (update_at -> updated_at)
               )
          `);
    await pool.query(`
               CREATE TABLE IF NOT EXISTS prolife(
               id SERIAL PRIMARY KEY,
               user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,   
               bio TEXT,
               address TEXT,
               phone VARCHAR(12),
               gender VARCHAR(10),
               created_at TIMESTAMP DEFAULT NOW(),
               updated_at TIMESTAMP DEFAULT NOW()
               )
               `);
    console.log("Database table successfully checked/created");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
};

// src/modules/user/user.service.ts
import bcrypt from "bcrypt";
var insetUserIntoDB = async (payload) => {
  const { name, email, age, password, role } = payload;
  const hashingPassword = await bcrypt.hash(password, 10);
  console.log(hashingPassword);
  const result = await pool.query(`
               INSERT INTO users (name, email, age, password,role)
               VALUES ($1, $2, $3, $4,COALESCE($5,'user'))
               RETURNING *
          `, [name, email, age, hashingPassword, role]);
  delete result.rows[0].password;
  return result;
};
var getAlluserFromDB = async () => {
  const result = await pool.query(`
          SELECT * FROM users 
          `);
  return result;
};
var getSingleUserFromDB = async (id) => {
  const result = await pool.query(`
          SELECT * FROM users  WHERE id=$1
          `, [id]);
  return result;
};
var updateUserFromDB = async (id, payload) => {
  const { name, is_active, age, password } = payload;
  const result = await pool.query(`
          UPDATE users SET name=COALESCE($1,name), is_active=COALESCE($2,is_active), age=COALESCE($3,age), password=COALESCE($4,password) WHERE id=$5 RETURNING *
          `, [name, is_active, age, password, id]);
  return result;
};
var deleteUserFormDB = async (id) => {
  const result = await pool.query(`
          DELETE FROM users  WHERE id=$1 
          `, [id]);
  return result;
};
var userService = {
  insetUserIntoDB,
  getAlluserFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFormDB
};

// src/utility/serverResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error
  });
};
var serverResponse_default = sendResponse;

// src/modules/user/user.controller.ts
var createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: " Name, email, and password are required!"
      });
    }
    const result = await userService.insetUserIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "User Created successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var getAllUser = async (req, res) => {
  try {
    const result = await userService.getAlluserFromDB();
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not found!",
        data: {}
      });
    }
    return res.status(200).json({
      success: true,
      message: "successfully data retrive",
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is must be required!"
      });
    }
    const result = await userService.getSingleUserFromDB(id);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not found!",
        data: {}
      });
    }
    serverResponse_default(
      res,
      {
        statusCode: 200,
        success: true,
        message: "Users fetched successfully!",
        data: result.rows[0]
      }
    );
  } catch (error) {
    serverResponse_default(
      res,
      {
        statusCode: 500,
        success: false,
        message: error.message,
        error
      }
    );
  }
};
var updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is must be required!"
      });
    }
    const result = await userService.updateUserFromDB(id, req.body);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not found!",
        data: {}
      });
    }
    return res.status(200).json({
      success: true,
      message: "successfully data retrive",
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is must be required!"
      });
    }
    const result = await userService.deleteUserFormDB(id);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "user not founds"
      });
    }
    return res.status(200).json({
      success: true,
      message: "successfully data deleted",
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser
};

// src/middleware/auth.ts
import jwt from "jsonwebtoken";
var auth = (...role) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.accesstoken;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access!!"
        });
      }
      const decoded = jwt.verify(token, config_default.seckey);
      const user = await pool.query(`
               
               SELECT * FROM users WHERE email=$1  
                    `, [decoded.email]);
      if (user.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found!"
        });
      }
      const userRole = user.rows[0].role;
      if (role.length && !role.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "forbidden access"
        });
      }
      if (!user.rows[0]?.is_active) {
        return res.status(403).json({
          success: false,
          message: "forbidden access"
        });
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/type/index.ts
var USER_ROLES = {
  admin: "admin",
  user: "user",
  manager: "manager"
};

// src/modules/user/user.route.ts
var router = Router();
router.post("/", userController.createUser);
router.get("/", auth_default(USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user), userController.getAllUser);
router.get("/:id", userController.getSingleUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
var userRoute = router;

// src/modules/profile/profile.route.ts
import { Router as Router2 } from "express";

// src/modules/profile/profile.service.ts
var profileDataInserIntoDB = async (payload) => {
  const { user_id, bio, address, phone, gender } = payload;
  const user = await pool.query(
    `
    SELECT * FROM users WHERE id=$1
    `,
    [user_id]
  );
  if (user.rows.length === 0) {
    throw new Error("This user not exits");
  }
  const result = await pool.query(`

          INSERT INTO prolife (user_id, bio, address, phone, gender)
          VALUES($1,$2,$3,$4,$5) RETURNING *

          `, [user_id, bio, address, phone, gender]);
  return result;
};
var profileGetFromDB = async (id) => {
  const result = await pool.query(`
          
          SELECT * FROM prolife WHERE  user_id=$1
          `, [id]);
  if (result.rows.length === 0) {
    throw new Error("This user not exits");
  }
  return result;
};
var profileUpdateFromDB = async (id, payload) => {
  const { bio, address, phone, gender } = payload;
  const result = await pool.query(`
          
          UPDATE prolife SET  bio=COALESCE($1,bio), address=COALESCE($2,address) ,phone=COALESCE($3,phone), gender=COALESCE($4,gender)  WHERE  user_id=$5 RETURNING *
          `, [bio, address, phone, gender, id]);
  if (result.rows.length === 0) {
    throw new Error("This user not exits");
  }
  return result;
};
var profileDeleteFromDB = async (id) => {
  const result = await pool.query(`
          
          DELETE FROM prolife WHERE user_id=$1
          `, [id]);
  if (result.rowCount === 0) {
    throw new Error("This user not exits");
  }
  return result;
};
var profileService = {
  profileDataInserIntoDB,
  profileGetFromDB,
  profileUpdateFromDB,
  profileDeleteFromDB
};

// src/modules/profile/profile.controller.ts
var createProfile = async (req, res) => {
  try {
    const result = await profileService.profileDataInserIntoDB(req.body);
    console.log(result);
    return res.status(201).json({
      success: true,
      message: "Profile created successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      succes: false,
      message: error.message,
      error
    });
  }
};
var getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await profileService.profileGetFromDB(id);
    serverResponse_default(
      res,
      {
        statusCode: 200,
        success: true,
        message: "Users fetched successfully!",
        data: result.rows[0]
      }
    );
  } catch (error) {
    serverResponse_default(
      res,
      {
        statusCode: 500,
        success: false,
        message: error.message,
        error
      }
    );
  }
};
var updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "ID must be required",
        data: {}
      });
    }
    const result = await profileService.profileUpdateFromDB(id, req.body);
    return res.status(201).json({
      success: true,
      message: "Profile update successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      succes: false,
      message: error.message,
      error
    });
  }
};
var deleteProfile = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({
      success: false,
      message: "ID must be required",
      data: {}
    });
  }
  try {
    const result = await profileService.profileDeleteFromDB(id);
    return res.status(201).json({
      success: true,
      message: "Profile delete successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      succes: false,
      message: error.message,
      error
    });
  }
};
var profileController = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile
};

// src/modules/profile/profile.route.ts
var router2 = Router2();
router2.post("/", profileController.createProfile);
router2.get("/:id", profileController.getProfile);
router2.patch("/:id", profileController.updateProfile);
router2.delete("/:id", profileController.deleteProfile);
var profileRouter = router2;

// src/modules/auth/auth.route.ts
import { Router as Router3 } from "express";

// src/modules/auth/auth.service.ts
import bcrypt2 from "bcrypt";
import jwt2 from "jsonwebtoken";
var loginUserIntoDB = async (payload) => {
  const { email, password } = payload;
  const users = await pool.query(`
          SELECT * FROM users WHERE email=$1
          `, [email]);
  if (users.rows.length === 0) {
    throw new Error("user not exists");
  }
  const userPassword = users.rows[0].password;
  const matchedPassword = await bcrypt2.compare(password, userPassword);
  if (!matchedPassword) {
    throw new Error("Password is invalid");
  }
  const user = users.rows[0];
  const jwtpayload = {
    id: user.id,
    name: user.name,
    is_active: user.is_active,
    email: user.email,
    role: user.role
  };
  const accessToken = jwt2.sign(jwtpayload, config_default.seckey, { expiresIn: "1d" });
  const refreshToken2 = jwt2.sign(jwtpayload, config_default.refreshkey, { expiresIn: "30d" });
  return { accessToken, refreshToken: refreshToken2 };
};
var generateFreshToken = async (token) => {
  if (!token) {
    throw new Error("Unauthorized");
  }
  const decoded = jwt2.verify(
    token,
    config_default.refreshkey
  );
  const users = await pool.query(`
          SELECT * FROM users WHERE email=$1
          `, [decoded.email]);
  if (users.rows.length === 0) {
    throw new Error("user not exists");
  }
  const user = users.rows[0];
  if (!user?.is_active) {
    throw new Error("Forbidden!!");
  }
  const jwtpayload = {
    id: user.id,
    name: user.name,
    is_active: user.is_active,
    email: user.email,
    role: user.role
  };
  const accessToken = jwt2.sign(jwtpayload, config_default.seckey, { expiresIn: "1d" });
  return { accessToken };
};
var authService = {
  loginUserIntoDB,
  generateFreshToken
};

// src/modules/auth/auth.controller.ts
var loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Password and Email must be required",
        data: {}
      });
    }
    const result = await authService.loginUserIntoDB(req.body);
    const { refreshToken: refreshToken2 } = result;
    res.cookie("refreshToken", refreshToken2, {
      secure: false,
      httpOnly: true,
      sameSite: "lax"
    });
  } catch (error) {
    serverResponse_default(
      res,
      {
        statusCode: 500,
        success: false,
        message: error.message,
        error
      }
    );
  }
};
var refreshToken = async (req, res) => {
  try {
    const result = await authService.generateFreshToken(req.cookies.refreshToken);
    serverResponse_default(
      res,
      {
        statusCode: 200,
        success: true,
        message: "Users fetched successfully!",
        data: result
      }
    );
  } catch (error) {
    serverResponse_default(
      res,
      {
        statusCode: 500,
        success: false,
        message: error.message,
        error
      }
    );
  }
};
var authController = {
  loginUser,
  refreshToken
};

// src/modules/auth/auth.route.ts
var router3 = Router3();
router3.post("/login", authController.loginUser);
router3.post("/refresh-token", authController.refreshToken);
var authRoute = router3;

// src/middleware/logger.ts
import fs from "fs";
var logger = (req, res, next) => {
  const log = `
 Method -> ${req.method} - Time -> ${Date.now()} - URL-> ${req.url} 
`;
  fs.appendFile("logger.txt", log, (err) => {
    console.log(err);
  });
  next();
};
var logger_default = logger;

// src/app.ts
import CookieParser from "cookie-parser";
import cors from "cors";

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/app.ts
var app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello developers",
    "authentication": "NextLeveldeveloper"
  });
});
app.use(
  cors({
    origin: "http://localhost:5000"
  })
);
app.use(logger_default);
app.use("/api/users", userRoute);
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRoute);
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
var main = () => {
  initDB();
  app_default.listen(config_default.port, () => {
    console.log(`Example app listening on port ${config_default.port}`);
  });
};
main();
//# sourceMappingURL=server.js.map
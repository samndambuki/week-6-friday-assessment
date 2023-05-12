import  { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import mssql from 'mssql';
import {sqlConfig} from "../config";
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const jwtSecret = 'mysecretkey';

interface ExtendedRequest extends Request{
    body:{
        name:string
        email:string
        password:string
    }
}

interface ResetPasswordRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const registerUser = async (req:ExtendedRequest,res:Response) => {
  try {
    const { name, email, password } = req.body;

    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const id = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await mssql.connect(sqlConfig);

     const existingUser = await pool
     .request()
     .input('email', mssql.VarChar, email)
     .execute('GetUsers');

   if (existingUser.recordset.length > 0) {
     return res.status(409).json({ error: 'Email already exists' });
   }

    await pool
      .request()
      .input('id', mssql.VarChar, id)
      .input('name', mssql.VarChar, name)
      .input('email', mssql.VarChar, email)
      .input('password', mssql.VarChar, hashedPassword)
      .execute('RegisterUser');

      const token = jwt.sign({ id, email }, jwtSecret);

    return res.status(201).json({ message: 'User registered successfully',token});
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

export const resetPassword = async (req: ResetPasswordRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate request body using Joi
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const pool = await mssql.connect(sqlConfig);

    // Check if the user exists in the database
    const existingUser = await pool
      .request()
      .input('email', mssql.VarChar, email)
      .execute('GetUserByEmail');

    if (existingUser.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Encrypt the new password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await pool
      .request()
      .input('email', mssql.VarChar, email)
      .input('password', mssql.VarChar, hashedPassword)
      .execute('UpdateUserPassword');

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}

export const searchUsersByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    // Validate the name query parameter

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid name parameter' });
    }

    const pool = await mssql.connect(sqlConfig);

    const result = await pool.request().execute('SearchUsersByName');

    return res.status(200).json(result.recordset);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
};

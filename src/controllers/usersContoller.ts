import  { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import mssql from 'mssql';
import {sqlConfig} from "../config";
import Joi from 'joi';
import bcrypt from 'bcrypt';


interface ExtendedRequest extends Request{
    body:{
        name:string
        email:string
        password:string
    }
}

export const registerUser = async (req:ExtendedRequest,res:Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate request body using Joi
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

    // Encrypt the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await mssql.connect(sqlConfig);

     // Check if the email already exists in the database
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

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}


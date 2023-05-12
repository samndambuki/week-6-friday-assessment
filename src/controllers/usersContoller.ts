import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import mssql from 'mssql';
import {sqlConfig} from "../config";


// const app = express();
// app.use(express.json());

// Endpoint for registering a new user
// app.post('/register', async (req: Request, res: Response)

interface ExtendedRequest extends Request{
    body:{
        name:String
        email:String
        password:String
    }
}

export const registerUser = async (req:ExtendedRequest,res:Response) => {
  try {
    const { name, email, password } = req.body;

    // Generate a unique ID for the user
    const id = uuidv4();

    // Connect to the database
    const pool = await mssql.connect(sqlConfig);

    // Execute the database query to insert the user
    await pool
      .request()
      .input('id', mssql.VarChar, id)
      .input('name', mssql.VarChar, name)
      .input('email', mssql.VarChar, email)
      .input('password', mssql.VarChar, password)
      .execute('RegisterUser');

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
}


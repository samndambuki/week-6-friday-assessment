CREATE OR ALTER PROCEDURE RegisterUser
  @Id VARCHAR(255),
  @Name VARCHAR(255),
  @Email VARCHAR(255),
  @Password VARCHAR(255)
AS
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = @Id)
  BEGIN
    INSERT INTO users (id, name, email, password)
    VALUES (@Id, @Name, @Email,@Password);
    PRINT 'User registered successfully.';
  END
  ELSE
  BEGIN
    PRINT 'User with the same ID already exists.';
  END
END
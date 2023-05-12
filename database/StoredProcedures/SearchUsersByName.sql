CREATE OR ALTER PROCEDURE SearchUsersByName
    @Name VARCHAR(255)
AS
BEGIN
    DECLARE @SearchName VARCHAR(255)
    SET @SearchName = '%' + @Name + '%'

    SELECT * FROM users WHERE name LIKE @SearchName;
END
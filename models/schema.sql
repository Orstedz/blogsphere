-- Create Roles table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Roles' AND xtype='U')
BEGIN
    CREATE TABLE Roles (
        id NVARCHAR(36) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL UNIQUE,
        description NVARCHAR(500),
        created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
    PRINT 'Created Roles table';
END;

-- Create Users table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        id NVARCHAR(36) PRIMARY KEY,
        username NVARCHAR(100) NOT NULL UNIQUE,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        role_id NVARCHAR(36),
        created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        deleted_at DATETIME2 NULL,
        FOREIGN KEY (role_id) REFERENCES Roles(id)
    );
    CREATE INDEX idx_users_deleted ON Users(deleted_at);
    PRINT 'Created Users table';
END;

-- Create Categories table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
BEGIN
    CREATE TABLE Categories (
        id NVARCHAR(36) PRIMARY KEY,
        name NVARCHAR(200) NOT NULL,
        description NVARCHAR(1000),
        is_deleted BIT NOT NULL DEFAULT 0,
        created_by NVARCHAR(36),
        created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY (created_by) REFERENCES Users(id)
    );
    CREATE INDEX idx_categories_deleted ON Categories(is_deleted);
    PRINT 'Created Categories table';
END;

-- Create Series table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Series' AND xtype='U')
BEGIN
    CREATE TABLE Series (
        id NVARCHAR(36) PRIMARY KEY,
        name NVARCHAR(200) NOT NULL,
        description NVARCHAR(1000),
        status NVARCHAR(50) NOT NULL DEFAULT 'Active',
        created_by NVARCHAR(36),
        created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY (created_by) REFERENCES Users(id)
    );
    PRINT 'Created Series table';
END;

-- Create Posts table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Posts' AND xtype='U')
BEGIN
    CREATE TABLE Posts (
        id NVARCHAR(36) PRIMARY KEY,
        title NVARCHAR(300) NOT NULL,
        content NVARCHAR(MAX),
        category_id NVARCHAR(36),
        series_id NVARCHAR(36),
        author_id NVARCHAR(36) NOT NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'Draft',
        created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        deleted_at DATETIME2 NULL,
        FOREIGN KEY (category_id) REFERENCES Categories(id),
        FOREIGN KEY (series_id) REFERENCES Series(id),
        FOREIGN KEY (author_id) REFERENCES Users(id)
    );
    CREATE INDEX idx_posts_deleted ON Posts(deleted_at);
    CREATE INDEX idx_posts_category ON Posts(category_id);
    CREATE INDEX idx_posts_author ON Posts(author_id);
    PRINT 'Created Posts table';
END;

-- Seed default roles if not exists
IF NOT EXISTS (SELECT * FROM Roles WHERE name = 'Admin')
BEGIN
    INSERT INTO Roles (id, name, description) VALUES 
    (NEWID(), 'Admin', 'Administrator with full access'),
    (NEWID(), 'Editor', 'Can create and edit posts'),
    (NEWID(), 'Author', 'Can create own posts'),
    (NEWID(), 'Viewer', 'Read-only access');
    PRINT 'Seeded default roles';
END;

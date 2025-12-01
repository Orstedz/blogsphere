-- Drop existing tables if they exist
IF EXISTS (SELECT * FROM sysobjects WHERE name='Posts' AND xtype='U')
BEGIN
    DROP TABLE Posts;
    PRINT 'Dropped existing Posts table';
END;

IF EXISTS (SELECT * FROM sysobjects WHERE name='Series' AND xtype='U')
BEGIN
    DROP TABLE Series;
    PRINT 'Dropped existing Series table';
END;

IF EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
BEGIN
    DROP TABLE Categories;
    PRINT 'Dropped existing Categories table';
END;

IF EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    DROP TABLE Users;
    PRINT 'Dropped existing Users table';
END;

IF EXISTS (SELECT * FROM sysobjects WHERE name='Roles' AND xtype='U')
BEGIN
    DROP TABLE Roles;
    PRINT 'Dropped existing Roles table';
END;
GO

-- Create Roles table
CREATE TABLE Roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(500),
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
PRINT 'Created Roles table';
GO

-- Create Users table
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(100) NOT NULL UNIQUE,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role_id INT,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);
PRINT 'Created Users table';
GO

-- Create Categories table
CREATE TABLE Categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(1000),
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
PRINT 'Created Categories table';
GO

-- Create Series table
CREATE TABLE Series (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(1000),
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
PRINT 'Created Series table';
GO

-- Create Posts table
CREATE TABLE Posts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(300) NOT NULL,
    content NVARCHAR(MAX),
    category_id INT,
    series_id INT,
    author_id INT NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'Draft',
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (category_id) REFERENCES Categories(id),
    FOREIGN KEY (series_id) REFERENCES Series(id),
    FOREIGN KEY (author_id) REFERENCES Users(id)
);
CREATE INDEX idx_posts_category ON Posts(category_id);
CREATE INDEX idx_posts_series ON Posts(series_id);
CREATE INDEX idx_posts_author ON Posts(author_id);
PRINT 'Created Posts table';
GO

-- Seed default roles
INSERT INTO Roles (name, description) VALUES 
('Admin', 'Administrator with full access'),
('Editor', 'Can create and edit posts'),
('Author', 'Can create own posts'),
('Viewer', 'Read-only access');
PRINT 'Seeded default roles';
GO

-- Seed default users
DECLARE @adminRoleId INT = (SELECT id FROM Roles WHERE name = 'Admin');
DECLARE @editorRoleId INT = (SELECT id FROM Roles WHERE name = 'Editor');
DECLARE @authorRoleId INT = (SELECT id FROM Roles WHERE name = 'Author');

INSERT INTO Users (username, email, password, role_id) VALUES 
('admin', 'admin@blogsphere.com', 'admin123', @adminRoleId),
('editor1', 'editor@blogsphere.com', 'editor123', @editorRoleId),
('author1', 'author@blogsphere.com', 'author123', @authorRoleId);
PRINT 'Seeded default users';
GO

-- Seed default categories
INSERT INTO Categories (name, description) VALUES 
('Technology', 'Posts about technology and programming'),
('Lifestyle', 'Posts about lifestyle and personal development'),
('Business', 'Posts about business and entrepreneurship'),
('Travel', 'Posts about travel and adventures'),
('Food', 'Posts about cooking and food'),
('Health', 'Posts about health and fitness');
PRINT 'Seeded default categories';
GO

-- Seed default series
INSERT INTO Series (name, description) VALUES 
('Getting Started with Web Development', 'A comprehensive series for beginners learning web development'),
('Advanced JavaScript Techniques', 'Deep dive into advanced JavaScript concepts'),
('Travel Diaries 2025', 'My journey through different countries'),
('Healthy Living Guide', 'Tips and tricks for a healthier lifestyle');
PRINT 'Seeded default series';
GO

-- Seed default posts
DECLARE @techCategoryId INT = (SELECT id FROM Categories WHERE name = 'Technology');
DECLARE @travelCategoryId INT = (SELECT id FROM Categories WHERE name = 'Travel');
DECLARE @webDevSeriesId INT = (SELECT id FROM Series WHERE name = 'Getting Started with Web Development');
DECLARE @travelSeriesId INT = (SELECT id FROM Series WHERE name = 'Travel Diaries 2025');
DECLARE @adminUserId INT = (SELECT id FROM Users WHERE username = 'admin');
DECLARE @editorUserId INT = (SELECT id FROM Users WHERE username = 'editor1');
DECLARE @authorUserId INT = (SELECT id FROM Users WHERE username = 'author1');

INSERT INTO Posts (title, content, category_id, series_id, author_id, status) VALUES 
('Welcome to BlogSphere', 'This is your first post! BlogSphere is a powerful blog management system that helps you organize and publish your content.', @techCategoryId, NULL, @adminUserId, 'Published'),
('Introduction to Web Development', 'Web development is an exciting field that combines creativity with technical skills. In this series, we will explore the fundamentals.', @techCategoryId, @webDevSeriesId, @editorUserId, 'Published'),
('My Journey to Japan', 'Japan has always been on my bucket list. This post marks the beginning of my travel diary series.', @travelCategoryId, @travelSeriesId, @authorUserId, 'Published');
PRINT 'Seeded default posts';
GO

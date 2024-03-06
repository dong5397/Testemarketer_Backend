CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	username CHAR(100) NOT NULL,
	email CHAR(100) NOT NULL,
	password CHAR(100) NOT NULL
);

CREATE TABLE restaurants (
	restaurants_id SERIAL PRIMARY KEY,
	restaurants_name CHAR(100) NOT NULL,
	address CHAR(100) NOT NULL,
	phone CHAR(100) NOT NULL,
	opening_hours CHAR(100) NOT NULL,
	rating FLOAT NOT NULL,
	taste_level INT NOT NULL,
	image VARCHAR(255) NOT NULL
);

CREATE TABLE reviews (
	id SERIAL PRIMARY KEY,
	restaurant_id INT NOT NULL REFERENCES restaurants(restaurants_id),
	review_text CHAR(200) NOT NULL,
	review_date CHAR(100) NOT NULL,
	user_id INT NOT NULL REFERENCES users(user_id)
);

CREATE TABLE posts (
	post_id SERIAL PRIMARY KEY,
	title CHAR(100) NOT NULL,
	content CHAR(100) NOT NULL,
	post_date CHAR(100) NOT NULL,
	user_id INT NOT NULL REFERENCES users(user_id),
	restaurants_id INT NOT NULL REFERENCES restaurants(restaurants_id)
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	comment_text CHAR(100) NOT NULL,
	comment_date CHAR(100) NOT NULL,
	user_id INT NOT NULL REFERENCES users(user_id),
	post_id INT NOT NULL REFERENCES posts(post_id)
);
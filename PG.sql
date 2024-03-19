-- users 테이블 생성
CREATE TABLE users (
   user_id SERIAL PRIMARY KEY,
   username CHAR(100) NOT NULL,
   email CHAR(100) NOT NULL,
   password CHAR(100) NOT NULL
);

-- restaurants 테이블 생성
CREATE TABLE restaurants (
   restaurants_id SERIAL PRIMARY KEY,
   restaurants_name CHAR(100) NOT NULL,
   address CHAR(100) NOT NULL,
   phone CHAR(100) NOT NULL,
   opening_hours CHAR(100) NOT NULL,
   rating FLOAT NOT NULL,
   taste_level INT NOT NULL,
   image VARCHAR(255) NOT NULL,
   latitude DECIMAL(10, 8) NOT NULL,
   longitude DECIMAL(11, 8) NOT NULL
);

-- reviews 테이블 생성
CREATE TABLE reviews (
   id SERIAL PRIMARY KEY,
   restaurants_id INT NOT NULL REFERENCES restaurants(restaurants_id),
   review_text VARCHAR(200) NOT NULL,
   review_date DATE NOT NULL,
   user_id INT NOT NULL REFERENCES users(user_id)
);

-- posts 테이블 생성
CREATE TABLE posts (
   post_id SERIAL PRIMARY KEY,
   title CHAR(100) NOT NULL,
   content CHAR(100) NOT NULL,
   post_date CHAR(100) NOT NULL,
   user_id INT NOT NULL REFERENCES users(user_id),
   restaurants_id INT NOT NULL REFERENCES restaurants(restaurants_id)
);

-- comments 테이블 생성
CREATE TABLE comments (
   id SERIAL PRIMARY KEY,
   comment_text CHAR(100) NOT NULL,
   comment_date CHAR(100) NOT NULL,
   user_id INT NOT NULL REFERENCES users(user_id),
   post_id INT NOT NULL REFERENCES posts(post_id)
);

-- restaurants 테이블에 데이터 삽입
INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, taste_level, image, latitude, longitude)
VALUES ('대전 성심당', '대전광역시 중구', '042-1234-5678', '07:00 - 22:00', 4.8, 5, 'https://blog.lgchem.com/wp-content/uploads/2014/10/ssd_1030-1.jpg', 36.350412, 127.384548);

-- restaurants 테이블에서 특정 데이터 삭제
DELETE FROM restaurants
WHERE restaurants_name = '대전 성심당';

-- restaurants 테이블의 모든 데이터 조회
SELECT * FROM restaurants;

-- 테이블 삭제 (CASCADE 옵션을 사용하여 연관된 외래키를 가진 테이블도 함께 삭제)
DROP TABLE comments CASCADE;
DROP TABLE posts CASCADE;
DROP TABLE reviews CASCADE;
DROP TABLE restaurants CASCADE;

-- users 테이블 삭제 (IF EXISTS 옵션 사용하여 테이블이 존재하는 경우에만 삭제)
DROP TABLE IF EXISTS users CASCADE;


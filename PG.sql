-- users 테이블 생성
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";



CREATE TABLE users(
   user_id uuid PRIMARY KEY DEFAULT
   uuid_generate_v4(),
   user_name VARCHAR(255) NOT NULL,
   user_email VARCHAR(255) NOT NULL,
   user_password VARCHAR(255) NOT NULL
);

-- 가짜 유저 삽입 
insert into users (user_name, user_email,user_password) values ('김헨리','henry123@naver.com', '1234')

-- 유저 조회
select * from users;

-- restaurants 테이블 생성


CREATE TABLE restaurants (
   restaurants_id SERIAL PRIMARY KEY,
   restaurants_name CHAR(100) NOT NULL,
   address CHAR(100) NOT NULL,
   phone CHAR(100) NOT NULL,
   opening_hours CHAR(100) NOT NULL,
   rating FLOAT NOT NULL,
   Spicy INT NOT NULL,
   Sweet INT NOT NULL,
   Sour INT NOT NULL,
   Salty INT NOT NULL,
   food_type CHAR(20) NOT NULL,
   image VARCHAR(255) NOT NULL,
   latitude DECIMAL(10, 8) NOT NULL,
   longitude DECIMAL(11, 8) NOT NULL
);


-- reviews 테이블 생성
CREATE TABLE reviews (
   id SERIAL PRIMARY KEY,
   username VARCHAR(100) NOT NULL,
   contents text NOT NULL,
   date DATE NOT NULL,
   rating numeric not null,
   restaurant_id INT NOT NULL REFERENCES restaurants(restaurants_id)
);


-- hashtags(해시태그) 테이블 생성
create table hashtags (
  id SERIAL PRIMARY KEY,
  contents VARCHAR(32) NOT NULL
)

-- 리뷰-해시태그 매핑 테이블 생성
create table reviews_hashtags (
	reviews_id SERIAL not null,
	hashtags_id SERIAL not null,
	foreign key (reviews_id) references reviews(id) on delete cascade,
	FOREIGN KEY (hashtags_id) REFERENCES hashtags(id) ON DELETE CASCADE
)


-- posts 테이블 생성
CREATE TABLE posts (
   post_id SERIAL PRIMARY KEY,
   title CHAR(100) NOT NULL,
   content CHAR(100) NOT NULL,
   post_date CHAR(100) NOT NULL,
   user_id uuid NOT NULL REFERENCES users(user_id),
   restaurants_id INT NOT NULL REFERENCES restaurants(restaurants_id)
);

-- comments 테이블 생성
CREATE TABLE comments (
   id SERIAL PRIMARY KEY,
   comment_text CHAR(100) NOT NULL,
   comment_date CHAR(100) NOT NULL,
   user_id uuid NOT NULL REFERENCES users(user_id),
   post_id INT NOT NULL REFERENCES posts(post_id)
);

-- restaurants 테이블에 데이터 삽입
INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('대전 성심당', '대전광역시 중구', '042-1234-5678', '07:00 - 22:00', 4.8, 5, 5, 4, 4, 'Korean', 'https://blog.lgchem.com/wp-content/uploads/2014/10/ssd_1030-1.jpg', 36.350412, 127.384548);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('이태리국시 본점', '대전 서구 둔산로31번길 31 2층', '042-485-0950', '11:30 - 22:00', 4.8, 5, 5, 4, 5, 'Western', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230616_205%2F1686845894665KQdXt_JPEG%2FKakaoTalk_Photo_2023-06-16-01-17-32_007.jpeg', 36.353304, 127.377901);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('신사우물갈비 대전점', '대전 서구 가장로87-1 1층', '042-522-3215', '12:00 - 23:00', 4.7, 5, 5, 4, 4, 'Korean', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDAzMzBfMjQ2%2FMDAxNzExNzcxNDQ2NTU5.-INp7BzOoFPEI3tWcty53yYvAKRvzIP5PNjbqznJYi4g.cBcCir2e9kIBJQ7SEPBZWkNMtlnkUWBxcHl9QZo7iiQg.JPEG%2F20240330_125938.jpg.jpg', 36.376282, 127.508940);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('근돈', '대전 서구 도산로369번길 92 1층 근돈 본점', '0507-1392-5234', '16:00 - 23:30', 4.5, 4, 5, 5, 4, 'Korean', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230815_270%2F1692109919279qU5kP_JPEG%2FKakaoTalk_20230815_233011659_01.jpg', 36.340565, 127.389010);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('대전 조개구이 무한리필', '대전 서구 계백로 1145 2층', '010-2022-6156', '12:00 - 24:00', 4.5, 4, 4, 5, 5, 'Korean', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20211102_119%2F1635825585194a7Ces_JPEG%2FlJp2-NP49hNlKp9aEn3jzrYs.jpg', 36.304876, 127.350764);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('온유', '대전 서구 괴정로 116번길44', '0507-1423-5658', '11:00 - 21:00', 4.7, 5, 5, 4, 4, 'Korean', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDAzMDJfMTY5%2FMDAxNzA5Mzg2OTc5NTEw.nJNkNi5Y5A88jNiqBs9eu3KoL2dSTfIGohCj0gsl7fQg.TyQDOQv4jP2OsFo_wZ_IIBkzLCD7xQ9yBN8YxcNmNg4g.JPEG%2F1000024695.jpg', 36.336191, 127.383620);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('소나무풍경', '대전 서구 괴정로116번길 42 소나무풍경', '042-525-9925', '10:30 - 20:30', 4.6, 4, 4, 5, 5, 'Korean', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230706_157%2F168861524446585z6s_JPEG%2FDSC00159-min_%25281%2529.jpg', 33.336243, 127.383670);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('심미함박', '대전 서구 도솔로 302번길 25-2', '042-535-2891', '11:00 - 21:00', 4.6, 4, 4, 5, 5, 'Korean', 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDAzMjZfMTgg%2FMDAxNzExNDE3NDUyNDk3.y9KoHd7la1xopWtqzfe1K6uU1C-Hei_iQvoZ0mFM6Wcg.H3LG07ZI0DuV1m1vDdujBnDKLTO6Itl_X_2ZGr0qhFcg.PNG%2FAsset_1064x-8.png', 36.334167, 127.383844);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('박쉐프참치', '대전 서구 도솔로 302번길 23-2 1층', '0507-1357-7436', '12:00 - 23:30', 4.8, 5, 5, 4, 4, 'Japanese', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240122_2%2F1705896586318MPmyw_JPEG%2FKakaoTalk_20240122_130319968.jpg', 33.334266, 127.383203);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('미나리솥뚜껑', '대전 서구 용문로 35-7 1층', '042-523-2352', '16:00 - 01:00', 4.4, 4, 4, 5, 5, 'Korean', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221025_107%2F1666678468019v31QK_JPEG%2F285C2E80-515A-4DDD-A257-DD269985A1CF.jpeg', 36.339762, 127.387863);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('금복집', '대전 서구  도산로370번길 46', '???', '17:00 - 24:00', 4.3, 3, 4, 4, 4, 'Korean', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200424_59%2F1587723787286umBH0_JPEG%2FKgIjZ-QqDw4_f-ooaRiW-GpG.jpg', 36.335789, 127.393761);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('모정득구미옛날고기집', '대전 서구 계룡로 620번길 23 1층 ', '0507-1454-0092', '17:00 - 23:30', 4.7, 5, 4, 4, 5, 'Korean', 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDAzMjVfMjAw%2FMDAxNzExMzAzNjg5OTEz.v80WqhSnwzc7wy3dlAYUoZIMwhdUolrlDSDnpxO9W7Mg.CyC2glKQkEgGCBbfFWUCGMiLlCIzCbZ1eL7rTmrcqxIg.JPEG%2FIMG_9003.jpg',36.338909, 127.390471);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('동방커피', '대전 서구 용문로41-26', '0507-1351-0633', '12:00 - 01:00', 4.7, 3, 4, 5, 4, 'Western', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20201119_252%2F1605766399761ktNIb_JPEG%2FvsKRf0qwOqzt0MYF6Rxul1DA.jpg', 36.338943, 127.388916);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('오늘대패', '대전 서구 도솔로 377 1층', '0507-1389-9936', '11:00 - 07:00', 4.5, 5, 5, 5, 5, 'Chinese', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20231216_155%2F1702689329457kRi9x_JPEG%2FGettyImages-a11229268.jpg', 36.340430, 127.387505);

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('바로그집', '대전 서구 도산로369번길 94', '042-534-6844', '09:30 - 22:30', 4.7, 3, 4, 5, 4, 'Korean', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200703_159%2F15937729429067aLbW_JPEG%2Fc1xKh8mg1nj5FfeIwR6acY9_.JPG.jpg',36.340777,127.388611 );

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('미도인', '대전 서구 둔산로 31번길 51 ', '042-472-9992', '11:00 - 20:20', 4.5, 3, 4, 5, 4, 'Japanese', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210127_159%2F16117442764984Rgrh_JPEG%2FnpEwYcJWG0HRQ26uP46K5veg.jpg', 36.354021,127.377347 );

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('열혈충주갈비', '대전 서구 둔산중로40번길 31 102호', '0507-1439-8952', '11:00 - 23:00', 4.6, 5, 5, 4, 4, 'Korean', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240218_107%2F1708252309562qMVId_JPEG%2FKakaoTalk_20240218_192230194_02.jpg', 36.988920,127.929476 );

INSERT INTO restaurants (restaurants_name, address, phone, opening_hours, rating, Spicy, Sweet, Sour, Salty, food_type, image, latitude, longitude)
VALUES ('애프터글로우', '대전 서구 계룡로 391 201호', '0507-1460-0884', '11:30 - 21:00', 4.8, 5, 5, 4, 4, 'Western', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230518_227%2F1684375622932f2qIx_JPEG%2F304BD82B-EA35-4487-A0E7-14C7640581D5.jpeg', 36.351607,127.371710  );

-- restaurants 테이블에서 특정 데이터 삭제
DELETE FROM restaurants
WHERE restaurants_name = '대전 성심당';

-- restaurants 테이블의 모든 데이터 조회
SELECT * FROM restaurants;

SELECT * FROM users where email = 'alsrl6678@naver.com';

-- 테이블 삭제 (CASCADE 옵션을 사용하여 연관된 외래키를 가진 테이블도 함께 삭제)
DROP TABLE comments CASCADE;
DROP TABLE posts CASCADE;
DROP TABLE reviews CASCADE;
DROP TABLE restaurants CASCADE;

-- users 테이블 삭제 (IF EXISTS 옵션 사용하여 테이블이 존재하는 경우에만 삭제)
DROP TABLE IF EXISTS users CASCADE;

UPDATE restaurants
SET phone = '042-539-8148'
WHERE restaurants_name = '금복집';


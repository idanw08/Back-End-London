
--DELETE FROM dbo.Users WHERE username='undefined'

-- BIT { 0 - false ; 1 - true }
--CREATE TABLE Categories (
--	FK_Username varchar(50) FOREIGN KEY REFERENCES dbo.Users(username),
--	cat1 BIT,
--	cat2 BIT,
--	cat3 BIT,
--	cat4 BIT
--)

--SELECT * FROM dbo.Categories

--ALTER TABLE dbo.Users DROP COLUMN category

--DELETE FROM dbo.Users WHERE password='asdfghjk'
--DELETE FROM dbo.Users WHERE username='edanbi'

--INSERT INTO Users (username, password, firstName, lastName, city, country, email, recoveryQuestions, recoveryAnswers)
--VALUES ('edanbi', '123456', 'Edan', 'Ben Ivri', 'Or Yehuda', 'Israel', 'idan.ivri@gmail.com', 'mom last name?', 'Lev');

--INSERT INTO Categories (FK_Username, Food, Culture, Shopping, Night_Life)
--VALUES ('edanbi',1, 0, 0, 1)

--DELETE FROM Categories WHERE FK_Username='edanbi'

--ALTER TABLE dbo.PointsOfInterest DROP COLUMN category
--ALTER TABLE dbo.PointsOfInterest ADD category VARCHAR(20)

--CREATE TABLE UsersFavouritesPOI (
--	FK_username varchar(50) FOREIGN KEY REFERENCES dbo.Users(username),
--	FK_poi_name varchar(50) FOREIGN KEY REFERENCES dbo.PointsOfInterest(name),
--	_time_date DATETIME,
--	_priority INT
--)

--CREATE TABLE POIreviews(
--	FK_poi_name varchar(50) FOREIGN KEY REFERENCES dbo.PointsOfInterest(name),
--	review_content text,
--	rankVal int CHECK (rankVal >= 0 AND rankVal <= 5)
--)


--SELECT * FROM dbo.UsersCategories
--WHERE Food IN (SELECT Food FROM dbo.UsersCategories WHERE FK_Username='m5' AND Food=1)
--AND Culture IN (SELECT Culture FROM dbo.UsersCategories WHERE FK_Username='m5' AND Culture=1)
--AND Shopping IN (SELECT Shopping FROM dbo.UsersCategories WHERE FK_Username='m5' AND Shopping=1)
--AND Night_Life IN (SELECT Night_Life FROM dbo.UsersCategories WHERE FK_Username='m5' AND Night_Life=1);

--INSERT INTO dbo.UsersFavouritesPOI (FK_username, FK_poi_name, _time_date)
--VALUES ('edanbi', 'LittleIndia', GETDATE())
--INSERT INTO dbo.UsersFavouritesPOI (FK_username, FK_poi_name, _time_date)
--VALUES ('edanbi', 'BooleBoole', GETDATE())
--INSERT INTO dbo.UsersFavouritesPOI (FK_username, FK_poi_name, _time_date)
--VALUES ('m5', 'LittleIndia', GETDATE())

--SELECT Food FROM dbo.UsersCategories WHERE FK_Username='m5' AND Food=1

--DELETE FROM Users WHERE username='Edan';

--INSERT INTO dbo.PointsOfInterest (name, picture, numViews, poiDescription, poiRank, category)
--VALUES ('Oxford Street', '', 102, 'best shopping street', '56.00', 'Shopping'); 

--DELETE FROM dbo.UsersFavouritesPOI
--WHERE _priority>84;

--SELECT TOP 2 * FROM dbo.UsersFavouritesPOI 
--WHERE FK_username='m5'
--ORDER BY _time_date DESC;

--SELECT name, picture, poiDescription, poiRank, category, FK_username
--FROM dbo.PointsOfInterest LEFT JOIN dbo.UsersFavouritesPOI 
--ON dbo.PointsOfInterest.name=dbo.UsersFavouritesPOI.FK_poi_name
--WHERE FK_username='m5';

--INSERT INTO dbo.UsersFavouritesPOI (FK_username, FK_poi_name, _time_date, _priority)
--VALUES ('edanbi', 'BigBen', GETDATE(), 6);
--SELECT @@ROWCOUNT;


--INSERT INTO dbo.POIreviews (FK_poi_name, review_content, rankVal)
--VALUES ('BigBen', 'very nice place', 8);

--CREATE TRIGGER calc_POI_rank ON dbo.POIreviews
--AFTER INSERT 
--AS
--BEGIN
--	DECLARE @_poi_name VARCHAR(50) = (SELECT inserted.FK_poi_name FROM inserted)
--	DECLARE @_avg FLOAT = (SELECT AVG(Cast(rankVal AS decimal(5,2))) FROM dbo.POIreviews WHERE FK_poi_name = @_poi_name)
--	SET @_avg = (@_avg / 5) * 100
--	UPDATE dbo.PointsOfInterest SET poiRank = @_avg WHERE name=@_poi_name
--END

--ALTER TABLE dbo.PointsOfInterest
--ALTER COLUMN poiRank DECIMAL(5,2)

--SELECT AVG(Cast(rankVal AS decimal(5,2) )) AS _AVG FROM dbo.POIreviews

--ALTER TABLE dbo.UserUsersFavouritesPOI 
--ALTER COLUMN _priority int IDENTITY(1,1) NOT NULL 

--DROP TABLE dbo.UsersFavouritesPOI

--UPDATE dbo.UsersFavouritesPOI SET _priority=1 WHERE FK_username='edanbi' AND FK_poi_name='BooleBoole';
--UPDATE dbo.UsersFavouritesPOI SET _priority=5 WHERE FK_username='m5' AND FK_poi_name='BigBen';

--INSERT INTO dbo.UsersFavouritesPOI (FK_username, FK_poi_name, _time_date)
--VALUES ('edanbi', 'LittleIndia', GETDATE())

--DELETE FROM dbo.UsersFavouritesPOI 
--WHERE FK_username='edanbi' OR FK_username='m5'

--CREATE TABLE UsersRecoveryQA (
--	FK_Username varchar(50) FOREIGN KEY REFERENCES dbo.Users(username),
--	Q1 TEXT,
--	A1 TEXT,
--	Q2 TEXT,
--	A2 TEXT
--)

--ALTER TABLE dbo.Users DROP COLUMN recoveryQuestions;
--ALTER TABLE dbo.Users DROP COLUMN recoveryAnswers;



--DELETE FROM  WHERE 
--DELETE FROM POIreviews WHERE FK_poi_name='BigBen' OR FK_poi_name='LittleIndia' OR FK_poi_name='Westfield' OR FK_poi_name='BooleBoole'
--DELETE FROM Users WHERE username='guysha'
--DELETE FROM UsersCategories WHERE FK_Username='guysha'
--DELETE FROM UsersFavouritesPOI WHERE FK_poi_name='BigBen' OR FK_poi_name='LittleIndia' OR FK_poi_name='Westfield' OR FK_poi_name='BooleBoole'
--DELETE FROM PointsOfInterest WHERE name='BigBen' OR name='LittleIndia' OR name='Westfield' OR name='BooleBoole'

--UPDATE PointsOfInterest
--SET numViews = numViews + 1
--WHERE name = 'BigBen';
--SELECT @@ROWCOUNT as addedView;

--UPDATE Users SET momOriginLastName='lev' WHERE username='edanbi'
--UPDATE Users SET elementarySchoolName ='shizaf' WHERE username='edanbi'
--UPDATE Users SET favouriteColor='' WHERE username='aduli'
--UPDATE Users SET childhoodBFF='' WHERE username='aduli'

--ALTER TABLE Users ADD momOriginLastName TEXT
--ALTER TABLE Users ADD elementarySchoolName TEXT
--ALTER TABLE Users ADD favouriteColor TEXT
--ALTER TABLE Users ADD childhoodBFF TEXT
--momOriginLastName, elementarySchoolName, favouriteColor, childhoodBFF

--DELETE FROM POIreviews WHERE FK_poi_name= 'LittleIndia'
--DELETE FROM POIreviews WHERE FK_poi_name= 'Mall of London'

--UPDATE PointsOfInterest SET poiRank=0 where name= 'Mall of London'

--DROP TABLE UsersRecoveryQA

--ALTER TABLE UsersFavouritesPOI ADD CONSTRAINT unique_username_poi UNIQUE(FK_username, FK_poi_name);

--delete from UsersCategories where FK_Username='babyRoni'
--insert into UsersCategories (FK_Username, Food, Culture, Shopping, Night_Life) values ('babyRoni',0,0,1,1)

--select getdate()

--SELECT * FROM dbo.PointsOfInterest WHERE name='BigBen';
--SELECT review_content, rankVal FROM dbo.POIreviews WHERE FK_poi_name='BigBen';

--INSERT INTO UsersFavouritesPOI (FK_username, FK_poi_name, _time_date, _priority) VALUES ('edanbi', 'Oxford street', '2019-05-28 15:17:35.754', 3)


--SELECT FK_poi_name FROM dbo.UsersFavouritesPOI
--WHERE FK_username='edanbi'
--ORDER BY _priority ASC;


--SELECT TOP 2 FK_poi_name FROM dbo.UsersFavouritesPOI
--WHERE FK_username='edanbi'
--ORDER BY _time_date DESC;

---- ******* CULTURE ********
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Buckingham Palace', 'https://media.timeout.com/images/103938223/630/472/image.jpg', 0, 'Buckingham Palace is the official residence and administrative headquarters of the British monarch and has been so since the accession to the throne of Queen Victoria in 1837', 0, 'Culture')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Tower of London', 'https://www.planetware.com/photos-large/ENG/england-london-tower-of-london-from-water.jpg', 0, 'The Tower of London is an internationally famous monument and one of England''s most iconic structures. William the Conqueror built the White Tower in 1066 as a demonstration of Norman power, siting it strategically on the River Thames to act as both fortress and gateway to the capital.', 0, 'Culture')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Big Ben', 'https://images2.minutemediacdn.com/image/upload/c_crop,h_1165,w_2078,x_0,y_123/f_auto,q_auto,w_1100/v1559320068/shape/mentalfloss/70705-istock-957174246.jpg', 0, 'The Houses of Parliament and Elizabeth Tower, commonly called Big Ben, are among London''s most iconic landmarks and must-see London attractions. Technically, Big Ben is the name given to the massive bell inside the clock tower, which weighs more than 13 tons', 0, 'Culture')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Tate Modern', 'https://www.tate.org.uk/sites/default/files/styles/width-720/public/images/newtatemodernsouthview.jpg', 0, 'Tate Modern is London''s new modern art gallery displaying modern and contemporary art from 1900 to the current day. It occupies the converted brick clad Bankside power station on the south bank of the River Thames and opposite St Pauls''s cathedral.', 0, 'Culture')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('The Emirates Stadium', 'https://www.adventuretoursintl.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/e/m/emirates_10.jpg', 0, 'The Emirates Stadium (known as Ashburton Grove prior to sponsorship, and as Arsenal Stadium for UEFA competitions) is a football stadium in Holloway, London, England, and the home of Arsenal.', 0, 'Culture')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('St. Paul''s', 'https://ak9.picdn.net/shutterstock/videos/5721719/thumb/1.jpg', 0, 'St. Paul''s Cathedral is an iconic part of London''s skyline. After being destroyed four times throughout history, the current cathedral – designed by Christopher Wren – has lived through three centuries, and its dome is the second largest in the world at 366 feet high.', 0, 'Culture')

---- ******* Food ********
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Duck & Waffle', 'https://pimediaonline.co.uk/wp-content/uploads/2016/02/4-1024x1024.jpg', 0, 'Since this is the signature dish, it’s a damn good thing they nailed it. Taking the humble sweet & savory mash up to new heights, it’s made even better with a side of the best view in town, and is accessible 24 hours a day.', 0, 'Food')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('St. John Bar & Restaurant', 'https://cdn.vox-cdn.com/uploads/chorus_image/image/62567073/Eater_day2_St.John_Bread_Wine_0116.0.0.jpg', 0, 'For years people have journeyed down to the St. John Bakery on Saturday mornings with the flicker of hope they won''t be sold out, and frequently met with disappointment and thoughts of “well maybe next time.” Yeah, these guys are that good. Luckily, now they’re available in other locations, but of course they’re gone pretty quick.', 0, 'Food')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Chiltern Firehouse', 'https://stnd-firehouse-prod.s3.amazonaws.com/photos/images/000/000/038/large.JPG?1420823988', 0, 'Actually more like a mini brioche bun stuffed with crab, they are the palm-sized balls that people keep clamoring over, when they can peel their eyes away from the celebs trying to hide in the dining room.', 0, 'Food')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Poppies', 'https://i.pinimg.com/originals/e4/e5/f1/e4e5f1929d9429b4a2869838576d41a4.jpg', 0, 'Having been in the F&C game since the mid 1940s, it’s safe to say they know what they’re doing. Fresh, flaky, and perfectly golden, this is the real deal.', 0, 'Food')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Hawksmoor', 'https://assets.londonist.com/uploads/2018/04/i875/sf_interior-9255-2.jpg', 0, 'Whether or not Hawksmoor has the best steaks in town (and it probably does), the experience here is so much more than just the amazing beef. Just ask the cocktail you’re going to wash this down with.', 0, 'Food')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Patty & Bun', 'https://assets.londonist.com/uploads/2018/05/i875/080518_77_preview.jpg', 0, 'This is how burgers are supposed to be: simple, cooked to perfection, smothered in cheese (and of course you added bacon), and so juicy it’s dripping.', 0, 'Food')

---- ******* Shopping ********
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Oxford Street', 'https://upload.wikimedia.org/wikipedia/commons/9/9f/London_Christmas_2016_%2832909695696%29.jpg', 0, 'The heart of London shopping, bustling Oxford Street has more than 300 shops, designer outlets and landmark stores: here you can find some of the best shopping in London.', 0, 'Shopping')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Regent Street and Jermyn Street', 'https://cdn.londonandpartners.com/visit/london-organisations/regent-street/94814-640x360-regent-street-twilight-640.jpg', 0, 'An impressively elegant shopping street, Regent Street offers a good range of mid-priced fashion stores alongside some of the city''s oldest and most famous shops, including Hamleys, Liberty andThe Apple Store. Nearby, historic Jermyn Street is renowned for men''s clothing shops and is so typically British it''s enough to bring out the old-fashioned gent in anyone! Jermyn Street is particularly well known for its bespoke shirt makers such as Benson & Clegg and shoe shops including John Lobb.', 0, 'Shopping')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Bond Street and Mayfair', 'https://cdn.londonandpartners.com/asset/a8470577bb79a7460c342bf9a290b604.jpg', 0, 'Whether you want to splash out on the very best in designer clothes or just love luxury window shopping, Bond Street and Mayfair are the ideal places to go for some extravagant retail therapy. Popular with celebrities on a spree, this is probably London''s most exclusive shopping area, home to big names, including Burberry, Louis Vuitton and Tiffany & Co. Neighbouring South Molton Street boasts iconic fashion store Browns. ', 0, 'Shopping')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Westfield', 'https://cdn.images.express.co.uk/img/dynamic/22/590x/Westfield-891551.jpg', 0, 'Westfield has two major shopping centres in London at White City and Stratford. Westfield London is home to high street favourites including Debenhams, Next, Marks & Spencer and House of Fraser, along with luxury brands, such as Louis Vuitton, Jimmy Choo, All Saints and Ted Baker. There''s also a cinema, gym, several bars and restaurants, all under one roof! If you''re a fan of shopping centres, don''t miss Westfield Stratford City in East London, which boasts 250 shops plus 70 places to dine, making it one of the largest shopping malls in Europe', 0, 'Shopping')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Covent Garden', 'https://res.cloudinary.com/adagio/image/upload/s--cIeimLbs--/c_thumb%2Cf_auto%2Ch_628%2Cq_auto%2Cw_1280/v1/2019-04/AdobeStock_151452333.jpeg?itok=E3ktNIJ0', 0, 'Whether you want hip fashion, unique gifts, rare sweets or one-off handmade jewellery, Covent Garden is a great place to explore. Stock up on the latest urban streetwear, funky cosmetics and shoes on Neal Street, check out imaginative arts and crafts at Covent Garden Market or just window shop around the stores. Don''t miss Floral Street, Monmouth Street, St Martin''s Courtyard, Shorts Gardens, Seven Dials and picture-pretty Neal''s Yard for a true taste of London''s most distinctive shopping area.', 0, 'Shopping')

---- ******* Night Life********
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Printworks London', 'https://static.standard.co.uk/s3fs-public/thumbnails/image/2018/06/19/10/printworks.jpg?width=1000&height=614&fit=bounds&format=pjpg&auto=webp&quality=70&crop=16:9,offset-y0.5', 0, 'Party among the industrial decor at this 5,000-capacity venue in Canada Water that was once Western Europe''s largest printing press complex. Let your hair down with drum''n''bass, hip hop and dance beats in Printworks London''s cavernous printing hall, and look out for headline shows from world greats, such as Pendulum and The Chemical Brothers.', 0, 'Night_Life')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Studio 338', 'https://static.standard.co.uk/s3fs-public/thumbnails/image/2018/11/08/10/studio-338.jpg?w968', 0, 'Continue until dawn at Studio 338, where you''ll find sets from world-class DJs, a state-of-the-art sound system and top club nights, including the venue''s much-loved Sankeys. The huge club, which has terrace that''s open all night (and heated in winter), is a short walk from The O2 in North Greenwich.', 0, 'Night_Life')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('XOYO', 'https://static.standard.co.uk/s3fs-public/thumbnails/image/2018/10/25/14/xoyo-2510-e.jpg', 0, 'Show off your moves at this two-room nightclub close to the Old Street roundabout in Shoreditch.  Renowned for attracting cutting-edge house, techno and dance acts, XOYO has hosted the likes of Friendly Fires, Mark Ronson, Mylo, Alex Metric, and Ms Dynamite at its headline shows and regular London club nights.', 0, 'Night_Life')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Fabric', 'https://static.standard.co.uk/s3fs-public/thumbnails/image/2018/09/12/17/fabric-a.jpg?width=1000&height=614&fit=bounds&format=pjpg&auto=webp&quality=70&crop=16:9,offset-y0.5', 0, 'Experience one of the capital''s most famous clubbing spots with a visit to Fabric in Farringdon. The legendary London club features three rooms, including one with a “bodysonic” dancefloor, and has hosted some of the world''s biggest DJs. You''ll find electro, techno and disco music, as well as drum’n’bass and grime, pumping from the speakers.', 0, 'Night_Life')
--insert into dbo.PointsOfInterest (name, picture, numViews, poiDescription,	poiRank, category)
--values('Ministry of Sound', 'https://www.ministryofsound.com/media/3940/club-opengraph.jpg', 0, 'Join the revellers at Ministry of Sound, which has been entertaining Londoners for more than 25 years and spawned a record label in the process. One of the most popular clubs in London, it boasts four bars, four dancefloors and five distinctive rooms, and still draws big names such as Paul Oakenfold. Book tickets in advance, and arrive early to avoid long queues.', 0, 'Night_Life')


--delete from PointsOfInterest where numViews=0

--ALTER TABLE PointsOfInterest ALTER COLUMN picture varchar(4096);

--SELECT * FROM dbo.UsersFavouritesPOI;
--SELECT * FROM dbo.UsersCategories
--SELECT * FROM dbo.POIreviews
--SELECT * FROM dbo.Users
SELECT * FROM dbo.PointsOfInterest 
--SELECT * FROM dbo.PointsOfInterest LEFT JOIN POIreviews ON PointsOfInterest.name=POIreviews.FK_poi_name
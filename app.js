var express = require('express');
var bodyParser = require('body-parser');
var DButilsAzure = require('./DButils');
var jwt = require('jsonwebtoken');
let config = require('./config');
var xml2js = require('xml2js');
var cors = require('cors')
var xmlParser = new xml2js.Parser();
var fs = require('fs');

var port = 3000;
var countries = [];

var app = express();
app.use(cors());

fs.readFile(__dirname + '/countries.xml', (err, data) => {
    xmlParser.parseString(data, (err, result) => {
        for (let i = 0; i < result.Countries.Country.length; i++) {
            countries.push(result.Countries.Country[i].Name[0]);
        }
    });
})
setTimeout(() => {
    if (countries.length > 0) {
        console.log('Countries loaded!')
    }
}, 1000);

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['x-access-token'] || req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        // forbidden
        res.sendStatus(403);
    }
}

// parses JSON and encode URL post requests. it parses the body so we could use it in req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, () => console.log(`_____Express app running on Localhost:${port}_____`));

// 1
app.post('/auth/login', (req, res) => {
    if (req.body.username === "" || req.body.password === "") {
        return res.sendStatus(403);
    }
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    DButilsAzure.execQuery(`SELECT * FROM dbo.Users WHERE username='${user.username}' AND password='${user.password}';`)
        .then(result => {
            if (result.length === 1) {
                jwt.sign({ user }, config.secret, { expiresIn: '24h' }, (err, token) => {
                    res.json({ token })
                })
            }
            else {
                res.status(403).send({ message: 'username or password incorrect!' });
            }
        })
        .catch(error => res.send(error))
});

// 2
app.post('/auth/register', (req, res) => {
    if (Object.keys(req.body).length < 12) {
        console.log('missing user details.', 400)
        return res.sendStatus(400);
    }
    console.log(req.body.categories)
    var newUser = {
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        country: req.body.country,
        email: req.body.email,
        categories: [0, 0, 0, 0],
        momOriginLastName: req.body.momOriginLastName.toLowerCase(),
        elementarySchoolName: req.body.elementarySchoolName.toLowerCase(),
        favouriteColor: req.body.favouriteColor.toLowerCase(),
        childhoodBFF: req.body.childhoodBFF.toLowerCase(),
        setUserCategories(cats) {
            if (cats.includes('Food')) {
                this.categories[0] = 1;
            }
            if (cats.includes('Culture')) {
                this.categories[1] = 1;
            }
            if (cats.includes('Shopping')) {
                this.categories[2] = 1;
            }
            if (cats.includes('Night_Life')) {
                this.categories[3] = 1;
            }
        },
        checkMissingValues() {
            var ans = "", notAnswered = 0;
            Object.keys(this).forEach(_prop => {
                if (_prop === 'momOriginLastName' || _prop === 'elementarySchoolName' || _prop === 'favouriteColor' || _prop === 'childhoodBFF') {
                    if (this[_prop] === "") {
                        notAnswered++;
                    }
                }
                else if (this[_prop] === "" || this[_prop] === undefined)
                    ans = _prop;
            })
            if (notAnswered > 2) {
                ans = 'Recovery Questions (min of 2 should be answered)';
            }
            return ans;
        }
    }
    newUser.setUserCategories(req.body.categories);

    var missing = newUser.checkMissingValues();
    if (missing !== "") {
        return res.send(`Missing '${missing}' value.`)
    }
    if (newUser.username.length < 3 || newUser.username.length > 8 || !/^[a-z]+$/i.test(newUser.username)) {
        return res.send('Username length should be 3-8 characters and only alphabetic values.')
    }
    if (newUser.password.length < 5 || newUser.password.length > 10 || !/^[a-z0-9]+$/i.test(newUser.password)) {
        return res.send('Password length should be between 5-10 characters and contain only alphanumeric values.')
    }
    if (!countries.includes(newUser.country)) {
        return res.send(`'${newUser.country}' is not a valid country.`)
    }
    var catgrsCount = 0;
    newUser.categories.forEach(c => {
        if (c === 1) {
            catgrsCount++;
        }
    })
    if (catgrsCount < 2) {
        return res.send('Select minimum of 2 favourite categories.')
    }
    DButilsAzure.execQuery(`
        INSERT INTO dbo.Users (username, password, firstName, lastName, city, country, email, momOriginLastName, elementarySchoolName, favouriteColor, childhoodBFF)
        VALUES 
            ('${newUser.username}', '${newUser.password}', '${newUser.firstName}', '${newUser.lastName}', 
            '${newUser.city}', '${newUser.country}', '${newUser.email}', '${newUser.momOriginLastName}', 
            '${newUser.elementarySchoolName}', '${newUser.favouriteColor}', '${newUser.childhoodBFF}');

        INSERT INTO dbo.UsersCategories (FK_Username, Food, Culture, Shopping, Night_Life)
        VALUES ('${newUser.username}', '${newUser.categories[0]}', '${newUser.categories[1]}', 
            '${newUser.categories[2]}', '${newUser.categories[3]}');
    `)
        .then(result => {
            console.log('result', result)
            res.json({ ans: true })
        })
        .catch(error => {
            console.log(error)
            res.json({ ans: false })
        })
});

// 3.1
app.post('/auth/recoveryQuestions', (req, res) => {
    console.log(req.body.username)
    if (!req.body.username || req.body.username === "") {
        res.json({ 'message': 'Enter Username' })
        return
    }
    DButilsAzure.execQuery(`SELECT * FROM dbo.Users WHERE username='${req.body.username}';`)
        .then((result) => {
            if (result.length === 0) {
                json({ 'message': 'User does not exist. Please register.' })
                return
            }
            let q = []
            if (result[0].momOriginLastName !== '') q.push({
                question: 'momOriginLastName',
                answer: result[0].momOriginLastName
            })
            if (result[0].elementarySchoolName !== '') q.push({
                question: 'elementarySchoolName',
                answer: result[0].elementarySchoolName
            })
            if (result[0].favouriteColor !== '') q.push({
                question: 'favouriteColor',
                answer: result[0].favouriteColor
            })
            if (result[0].childhoodBFF !== '') q.push({
                question: 'childhoodBFF',
                answer: result[0].childhoodBFF
            })

            let rndIdx = Math.floor(Math.random() * Math.floor(q.length))
            res.json(q[rndIdx])
        })
        .catch((error) => {
            res.json({ 'message': 'username not found' })
        })
})

// 3.2
app.post('/auth/passwordRecovery', (req, res) => {
    if (!req.body.username || !req.body.question || !req.body.answer) {
        return res.sendStatus(400)
    }
    if (req.body.username === '' || req.body.question === '' || req.body.answer === '') {
        return res.sendStatus(400)
    }
    
    var ques = req.body.question;
    var ans = req.body.answer.toLowerCase();

    var questions = ['momOriginLastName', 'elementarySchoolName', 'favouriteColor', 'childhoodBFF'];
    if (ques === "" || ans === "" || !questions.includes(ques)) {
        return res.sendStatus(400);
    }
    console.log(ques + ' --> ' + ans);
    DButilsAzure.execQuery(`SELECT password,${ques} FROM dbo.Users WHERE username='${req.body.username}';`)
        .then(result => {
            var correctAns = false;
            switch (ques) {
                case 'momOriginLastName':
                    correctAns = result[0].momOriginLastName === ans ? true : false;
                    break;
                case 'elementarySchoolName':
                    correctAns = result[0].elementarySchoolName === ans ? true : false;
                    break;
                case 'favouriteColor':
                    correctAns = result[0].favouriteColor === ans ? true : false;
                    break;
                case 'childhoodBFF':
                    correctAns = result[0].childhoodBFF === ans ? true : false;
                    break;
            }
            if (correctAns) {
                res.status(200).json({ password: result[0].password })
            } else { res.sendStatus(401); }
        })
        .catch(error => res.send(error));
});

// 4
// return three random POI object with rating above arg value in an array  
app.get('/guest/randExplorePOIs/:minRating', (req, res) => {
    if (req.params.minRating < 0 || req.params.minRating > 100) {
        return res.sendStatus(400);
    }
    const minRating = parseInt(req.params.minRating);
    if (isNaN(minRating)) {
        console.log(req.params.minRating + ' --> NaN');
        return res.sendStatus(400);
    }
    DButilsAzure.execQuery(`
        SELECT * FROM dbo.PointsOfInterest LEFT JOIN dbo.POIreviews
        ON PointsOfInterest.name=POIreviews.FK_poi_name
        WHERE PointsOfInterest.poiRank >= ${minRating}
        `)
        .then(result => {
            if (result.length < 3) {
                res.json({ message: 'No relevant POI\'s found' });
            } else {
                var poi_name = [];
                var poi = [];
                var tmp;
                result.forEach(row => {
                    if (!poi_name.includes(row.name)) {
                        tmp = {
                            name: row.name,
                            picture: row.picture,
                            numViews: row.numViews,
                            poiDescription: row.poiDescription,
                            poiRank: row.poiRank,
                            category: row.category,
                            reviews: [{
                                review_content: row.review_content,
                                rankVal: row.rankVal
                            }]
                        }
                        poi.push(tmp);
                        poi_name.push(row.name);
                    } else {
                        poi[poi_name.indexOf(row.name)].reviews.push({
                            review_content: row.review_content,
                            rankVal: row.rankVal
                        });
                    }
                })
                //decodeBase64toBinary(poi[0].picture, poi[0].name);
                if (poi.length === 3) {
                    res.status(200).json(poi);
                } else {
                    var i;
                    var randAns = [null, null, null];
                    while (randAns.includes(null)) {
                        i = Math.floor(Math.random() * Math.floor(poi.length));
                        if (!randAns.includes(poi[i])) {
                            randAns[0] = poi[i];
                        }
                        i = Math.floor(Math.random() * Math.floor(poi.length));
                        if (!randAns.includes(poi[i])) {
                            randAns[1] = poi[i];
                        }
                        i = Math.floor(Math.random() * Math.floor(poi.length));
                        if (!randAns.includes(poi[i])) {
                            randAns[2] = poi[i];
                        }
                    }
                    //console.log(randAns);
                    res.status(200).json(randAns);
                }
            }
        })
});

// 5
// get the user's favs categories
// take 2 of them and find a relevant POI foreach category
app.get('/guest/userRecommended_POIs/:username', verifyToken, (req, res) => {
    jwt.verify(req.token, config.secret, (err, authData) => {
        if (err || req.params.username !== authData.user.username) {
            console.log(req.params.username)
            console.log(authData.user.username)
            res.status(403).json({ message: "illegal token." });
        } else {
            let categories = [];
            DButilsAzure.execQuery(`
                SELECT Food, Culture, Shopping, Night_Life FROM dbo.UsersCategories
                WHERE FK_Username='${authData.user.username}';
            `)
                .then(result => {
                    if (result[0].Food === true) {
                        categories.push('Food');
                    }
                    if (result[0].Culture === true) {
                        categories.push('Culture');
                    }
                    if (result[0].Shopping === true) {
                        categories.push('Shopping');
                    }
                    if (result[0].Night_Life === true) {
                        categories.push('Night_Life');
                    }
                    return categories;
                })
                // now we have the user's favs in categories array --> select first two's and find one matching POI for each catgry
                .then(categories => {
                    DButilsAzure.execQuery(`
                    SELECT * FROM dbo.PointsOfInterest WHERE category='${categories[0]}' OR category='${categories[1]}';`)
                        .then(result => {
                            var max_1 = -1, max_2 = -1;
                            var poi_1, poi_2;
                            var pois = [];
                            result.forEach(row => {
                                if (row.category === categories[0] && row.poiRank > max_1) {
                                    max_1 = row.poiRank;
                                    //poi_1 = row;
                                    pois[0] = row;
                                }
                                if (row.category === categories[1] && row.poiRank > max_2) {
                                    max_2 = row.poiRank;
                                    //poi_2 = row;
                                    pois[1] = row;
                                }
                            })

                            var ans = [];
                            for (let i = 0; i < 2; i++) {
                                ans[i] = {
                                    name: pois[i].name,
                                    picture: pois[i].picture,
                                    numViews: pois[i].numViews,
                                    poiDescription: pois[i].poiDescription,
                                    poiRank: pois[i].poiRank,
                                    category: pois[i].category,
                                    reviews: []
                                }
                            }
                            return ans;
                        })
                        .then(pois => {
                            DButilsAzure.execQuery(`
                            SELECT * FROM dbo.POIreviews 
                            WHERE FK_poi_name='${pois[0].name}' OR FK_poi_name='${pois[1].name}';
                            `).then(result => {
                                if (result.length === 0) {
                                    return res.json(pois);
                                }
                                result.forEach(row => {
                                    if (row.FK_poi_name === pois[0].name) {
                                        pois[0].reviews.push({
                                            review_content: row.review_content,
                                            rankVal: row.rankVal
                                        })
                                    } else {
                                        pois[1].reviews.push({
                                            review_content: row.review_content,
                                            rankVal: row.rankVal
                                        })
                                    }
                                })
                                res.json(pois);
                            })
                        })
                })
        }
    })
});

// 6
app.get('/guest/userRecentSaves/:username', verifyToken, (req, res) => {
    jwt.verify(req.token, config.secret, (err, authData) => {
        if (err || req.params.username !== authData.user.username) {
            res.status(403).json({ message: "illegal token." });
        } else {
            DButilsAzure.execQuery(`
                SELECT TOP 2 FK_poi_name FROM dbo.UsersFavouritesPOI
                WHERE FK_username='${authData.user.username}'
                ORDER BY _time_date DESC;
            `)
                .then(result => {
                    if (result.length === 0) {
                        res.json([]);
                    }
                    else {
                        var ans = [];
                        var k = 0, len = result.length;
                        result.forEach(row => {
                            DButilsAzure.execQuery(`
                                SELECT * FROM dbo.PointsOfInterest WHERE name='${row.FK_poi_name}';
                                SELECT review_content, rankVal FROM dbo.POIreviews WHERE FK_poi_name='${row.FK_poi_name}';
                            `).then(result => {
                                var poi = {
                                    name: result[0].name,
                                    picture: result[0].picture,
                                    numViews: result[0].numViews,
                                    poiDescription: result[0].poiDescription,
                                    poiRank: result[0].poiRank,
                                    category: result[0].category,
                                    reviews: []
                                };
                                for (var i = 1; i < result.length; i++) {
                                    poi.reviews.push({
                                        review_content: result[i].name,
                                        rankVal: result[i].picture
                                    });
                                }
                                ans.push(poi);
                                k++;
                                if (k === len) {
                                    res.status(200).json(ans);
                                }
                            })
                        })
                    }
                })
        }
    })
});

// 7
app.get('/user/poi/getAll_POI', (req, res) => {
    DButilsAzure.execQuery(`
        SELECT * FROM dbo.PointsOfInterest LEFT JOIN POIreviews
        ON PointsOfInterest.name=POIreviews.FK_poi_name`)
        .then(result => {
            var names = [], pois = [];
            result.forEach(row => {
                if (!names.includes(row.name)) {
                    names.push(row.name);
                    pois.push({
                        name: row.name,
                        picture: row.picture,
                        numViews: row.numViews,
                        poiDescription: row.poiDescription,
                        poiRank: row.poiRank,
                        category: row.category,
                        reviews: []
                    });
                }
                if (row.review_content !== null) {
                    pois[names.indexOf(row.name)].reviews.push({
                        review_content: row.review_content,
                        rankVal: row.rankVal
                    })
                }
            });
            res.json(pois);
        })
});

// 8
app.delete('/user/poi/removeFavouritePOI', verifyToken, (req, res) => {
    if (req.body.username === undefined || req.body.poi_name === undefined) {
        return res.sendStatus(400);
    }
    jwt.verify(req.token, config.secret, (err, authData) => {
        if (err || req.body.username !== authData.user.username) {
            res.status(403).json({ message: "illegal token." });
        } else {
            DButilsAzure.execQuery(`
                DELETE FROM dbo.UsersFavouritesPOI
                WHERE FK_username='${req.body.username}' AND FK_poi_name='${req.body.poi_name}'
                SELECT @@ROWCOUNT AS changed;
            `).then(result => {
                var ans = !(result[0].changed === 0);
                res.status(200).json({ ans: ans });
            })
        }
    })
});

// 9
app.get('/user/getFavouritesNum/:username', verifyToken, (req, res) => {
    jwt.verify(req.token, config.secret, (err, authData) => {
        if (err || req.params.username !== authData.user.username) {
            res.status(403).json({ message: "illegal token." });
        } else {
            DButilsAzure.execQuery(`SELECT * FROM dbo.UsersFavouritesPOI WHERE FK_username='${req.params.username}';`)
                .then(result => { res.status(200).json({ ans: result.length }) })
                .catch(err => res.json(err));
        }
    })
});

// 10
app.get('/user/poi/getUserFavourites/:username', verifyToken, (req, res) => {
    jwt.verify(req.token, config.secret, (err, authData) => {
        if (err || req.params.username !== authData.user.username) {
            res.status(403).json({ message: "illegal token." });
        } else {
            DButilsAzure.execQuery(`
                SELECT FK_poi_name FROM dbo.UsersFavouritesPOI
                WHERE FK_username='${req.params.username}'
                ORDER BY _priority ASC;
            `)
                .then(result => {
                    if (result.length === 0) {
                        res.json({ message: `Username '${req.params.username}' does not exist` })
                    } else {
                        var poiNames = [];
                        result.forEach(row => {
                            poiNames.push(row.FK_poi_name);
                        })
                        return poiNames;
                    }
                })
                .then(names => {
                    var ans = [];
                    var i = 0, len = names.length;
                    names.forEach(name => {
                        DButilsAzure.execQuery(`
                            SELECT * FROM dbo.PointsOfInterest WHERE name='${name}';
                            SELECT review_content, rankVal FROM dbo.POIreviews WHERE FK_poi_name='${name}';
                            `)
                            .then(result => {
                                console.log(result);
                                var poi = {
                                    name: result[0].name,
                                    picture: result[0].picture,
                                    numViews: result[0].numViews,
                                    poiDescription: result[0].poiDescription,
                                    poiRank: result[0].poiRank,
                                    category: result[0].category,
                                    reviews: []
                                };
                                for (let i = 1; i < result.length; i++) {
                                    poi.reviews.push({
                                        review_content: result[i].name,
                                        rankVal: result[i].picture
                                    });
                                }
                                ans.push(poi);
                                i++;
                                if (i === len) {
                                    res.json(ans);
                                }
                            })
                    })
                })
        }
    })
});

// 11
app.post('/user/poi/savePOI_server', verifyToken, (req, res) => {
    jwt.verify(req.token, config.secret, (err, authData) => {
        if (err || req.body.username !== authData.user.username) {
            res.status(403).json({ message: "illegal token." });
        } else {
            DButilsAzure.execQuery(`
            DELETE FROM dbo.UsersFavouritesPOI WHERE FK_username='${req.body.username}'
            `).then(() => {
                var names = req.body.favourites;
                var count = 1, _priority = 0;
                names.forEach(elem => {
                    _priority++;
                    DButilsAzure.execQuery(`
                        INSERT INTO dbo.UsersFavouritesPOI (FK_username, FK_poi_name, _time_date, _priority)
                        VALUES ('${req.body.username}', '${elem.poi}', '${elem.timeDate}', '${_priority}');
                    `).then(() => {
                        if (count === names.length) {
                            res.sendStatus(200);
                        } else {
                            count++;
                        }
                    }).catch(err => {
                        console.log(err)
                        reject(`Check values '${req.body.username}' and '${elem}'`)
                    });
                })
            })
        }
    })
});

// 12
app.post('/guest/poi/addPOIreview', (req, res) => {
    if (Object.keys(req.body).length !== 3 || req.body.poi_name === undefined ||
        req.body.review_content === undefined || req.body.rankVal === undefined || isNaN(req.body.rankVal)) {
        return res.sendStatus(400);
    }
    if (req.body.rankVal < 1 || req.body.rankVal > 5) {
        console.log(`Illegal ranking value --> ${req.body.rankVal}`);
        return res.sendStatus(400);
    }
    DButilsAzure.execQuery(`
        INSERT INTO dbo.POIreviews (FK_poi_name, review_content, rankVal)
        VALUES ('${req.body.poi_name}', '${req.body.review_content}', ${req.body.rankVal})
        SELECT @@ROWCOUNT AS added;
    `)
        .then(() => res.sendStatus(200))
        .catch(err => {
            if (err.code === 'EREQUEST') {
                res.status(400).json({ message: `Point Of Interest - '${req.body.poi_name}' does not exist.` })
            } else {
                res.send('Unable to add your review, try again.');
            }
        })
});

//13
app.post('/guest/poi/addPOIview', (req, res) => {
    DButilsAzure.execQuery(`
        UPDATE PointsOfInterest
        SET numViews = numViews + 1
        WHERE name = '${req.body.poi_name}';
        SELECT @@ROWCOUNT AS addedView;
    `).then(result => {
        if (result[0].addedView === 1) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    })
});


// app.get('/test', (req, res) => {
//     var name = 'BigBen';
//     DButilsAzure.execQuery(`
//     SELECT * FROM dbo.PointsOfInterest WHERE name='${name}'
//     SELECT @@ROWCOUNT AS poi;
//     SELECT review_content, rankVal FROM dbo.POIreviews WHERE FK_poi_name='${name}'
//     SELECT @@ROWCOUNT AS reviews;
//     `).then(result => {
//         result.forEach()
//         console.log(result);
//         // console.log(result.poi);
//         // console.log(result.reviews);
//         res.sendStatus(402);
//     })
// })

// // __________________________________________________________
// app.get('/validateToken', (req, res) => {
//     const token = req.header("x-auth-token");
//     // no token
//     if (!token) res.status(401).send("Access denied. No token provided.");
//     // verify token
//     try {
//         const decoded = jwt.verify(token, config.secret);
//         req.decoded = decoded;

//         if (req.decoded.admin)
//             res.status(200).send({ result: "Hello admin." });
//         else
//             res.status(200).send({ result: "Hello user." });
//     } catch (exception) {
//         res.status(400).send("Invalid token.");
//     }
// });
// __________________________________________________________

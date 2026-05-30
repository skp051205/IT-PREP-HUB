const express = require('express');
const router = express.Router();
const db = require('../database/db');

// sab topics lao
router.get('/topics', (req, res) => {

    let q = 'SELECT * FROM topics';

    db.query(q, function(err, data){
        if(err){
            console.log(err);
            res.json({success: false, msg: 'topics nahi aaye'});
            return;
        }
        res.json({success: true, topics: data});
    });
});

// topic ke questions lao
// user customize kar sakta hai limit aur difficulty
router.get('/:topicId', (req, res) => {

    let tid = req.params.topicId;
    let limit = req.query.limit || 10;
    let diff = req.query.difficulty;

    let q = `SELECT q.*, t.name as topic_name 
             FROM questions q 
             JOIN topics t ON q.topic_id = t.id 
             WHERE q.topic_id = ?`;

    let params = [tid];

    if(diff && diff !== 'mixed'){
        q += ' AND q.difficulty = ?';
        params.push(diff);
    }

    q += ' ORDER BY RAND() LIMIT ?';
    params.push(parseInt(limit));

    db.query(q, params, function(err, questions){
        if(err){
            console.log(err);
            res.json({success: false, msg: 'questions nahi aaye'});
            return;
        }

        if(questions.length === 0){
            res.json({success: true, questions: []});
            return;
        }

        // ab options bhi lao
        let qids = questions.map(q => q.id);

        let optQ = 'SELECT * FROM options WHERE question_id IN (?)';

        db.query(optQ, [qids], function(err, options){
            if(err){
                console.log(err);
                res.json({success: false, msg: 'options nahi aaye'});
                return;
            }

            // har question me uske options daalo
            let final = questions.map(function(ques){
                return {
                    ...ques,
                    options: options.filter(o => o.question_id === ques.id)
                };
            });

            res.json({success: true, questions: final, total: final.length});
        });
    });
});

// naya question add karo
router.post('/add', (req, res) => {

    let tid = req.body.topic_id;
    let qtxt = req.body.question_text;
    let exp = req.body.explanation;
    let diff = req.body.difficulty;
    let lang = req.body.language;
    let opts = req.body.options;

    if(!tid || !qtxt || !opts){
        res.json({success: false, msg: 'zaruri data missing hai'});
        return;
    }

    let q = `INSERT INTO questions 
             (topic_id, question_text, explanation, difficulty, language) 
             VALUES (?,?,?,?,?)`;

    db.query(q, [tid, qtxt, exp, diff, lang], function(err, data){
        if(err){
            console.log(err);
            res.json({success: false, msg: 'question add nahi hua'});
            return;
        }

        let qid = data.insertId;

        // options save karo
        let optVals = opts.map(o => [qid, o.option_text, o.is_correct]);

        let optQ = 'INSERT INTO options (question_id, option_text, is_correct) VALUES ?';

        db.query(optQ, [optVals], function(err){
            if(err){
                console.log(err);
                res.json({success: false, msg: 'options add nahi hue'});
                return;
            }
            res.json({success: true, msg: 'question add ho gaya!', qid: qid});
        });
    });
});

module.exports = router;
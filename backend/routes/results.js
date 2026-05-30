const express = require('express');
const router = express.Router();
const db = require('../database/db');

// points calculate karna
function calcPoints(score, total, timeTaken) {
    let points = 0;
    
    // har sahi jawab ke 10 points
    points += score * 10;
    
    // quiz complete karne ke 20 points
    points += 20;
    
    // 100% accuracy bonus
    if(score === total) points += 50;
    
    // speed bonus - agar average time 10s se kam
    let avgTime = timeTaken / total;
    if(avgTime < 10) points += score * 5;
    
    return points;
}

// badge decide karna
function getBadge(level) {
    let badges = {
        1: 'Beginner',
        2: 'Explorer', 
        3: 'Challenger',
        4: 'Expert',
        5: 'Master',
        6: 'Elite',
        7: 'Legend'
    };
    return badges[level] || 'Legend';
}

// result save karo + points update karo
router.post('/save', (req, res) => {

    let uid = req.body.user_id;
    let tid = req.body.topic_id;
    let sc = req.body.score;
    let total = req.body.total_questions;
    let ttime = req.body.time_taken;

    if(!uid || !tid || !sc || !total) {
        res.json({success: false, msg: 'data missing hai'});
        return;
    }

    // result save karo
    let q = "INSERT INTO results (user_id, topic_id, score, total_questions, time_taken) VALUES (?,?,?,?,?)";

    db.query(q, [uid, tid, sc, total, ttime], function(err, data) {
        if(err) {
            console.log(err);
            res.json({success: false, msg: 'result save nahi hua'});
            return;
        }

        let per = Math.round((sc/total) * 100);
        let earnedPoints = calcPoints(sc, total, ttime);

        // user ke points update karo
        let updateQ = `UPDATE users SET 
            points = points + ?,
            weekly_points = weekly_points + ?
            WHERE id = ?`;

        db.query(updateQ, [earnedPoints, earnedPoints, uid], function(err) {
            if(err) console.log(err);
        });

        let grade = '';
        if(per >= 90) grade = 'Excellent!';
        else if(per >= 70) grade = 'Good Job!';
        else if(per >= 50) grade = 'Average';
        else grade = 'Keep Practicing!';

        res.json({
            success: true,
            percentage: per,
            grade: grade,
            points_earned: earnedPoints
        });
    });
});

// weekly leaderboard
router.get('/leaderboard', (req, res) => {

    let q = `SELECT 
            u.id,
            u.name,
            u.level,
            u.badge,
            u.points,
            u.weekly_points,
            t.name as topic_name,
            r.score,
            r.total_questions,
            ROUND((r.score/r.total_questions)*100) as percentage,
            r.time_taken
        FROM results r
        JOIN users u ON r.user_id = u.id
        JOIN topics t ON r.topic_id = t.id
        ORDER BY u.weekly_points DESC, percentage DESC
        LIMIT 10`;

    db.query(q, function(err, data) {
        if(err) {
            console.log(err);
            res.json({success: false, msg: 'leaderboard nahi aaya'});
            return;
        }
        res.json({success: true, leaderboard: data});
    });
});

// top 5 weekly users level up karo
router.post('/levelup', (req, res) => {

    // top 5 users fetch karo
    let q = `SELECT id, name, level, weekly_points, badge 
             FROM users 
             ORDER BY weekly_points DESC 
             LIMIT 5`;

    db.query(q, function(err, users) {
        if(err) {
            res.json({success: false, msg: 'error'});
            return;
        }

        users.forEach(function(user) {
            let newLevel = Math.min(user.level + 1, 7);
            let newBadge = getBadge(newLevel);

            // level up karo
            db.query(
                'UPDATE users SET level = ?, badge = ? WHERE id = ?',
                [newLevel, newBadge, user.id]
            );

            // reward save karo
            let rewards = {
                2: 'Explorer Badge + 100 Bonus Points',
                3: 'Challenger Badge + 200 Bonus Points',
                4: 'Expert Badge + Special Topics Unlocked',
                5: 'Master Badge + Mock Interview Questions',
                6: 'Elite Badge + Resume Tips',
                7: 'Legend Badge + Certificate!'
            };

            let rewardDesc = rewards[newLevel] || 'Special Reward!';

            db.query(
                'INSERT INTO rewards (user_id, reward_type, reward_description) VALUES (?,?,?)',
                [user.id, newBadge, rewardDesc]
            );
        });

        // weekly points reset karo
        db.query('UPDATE users SET weekly_points = 0');

        res.json({success: true, msg: 'Level up done! Weekly points reset!'});
    });
});

// user ki profile + rewards
router.get('/profile/:uid', (req, res) => {

    let uid = req.params.uid;

    let userQ = 'SELECT id, name, email, points, level, badge, weekly_points FROM users WHERE id = ?';

    db.query(userQ, [uid], function(err, users) {
        if(err || users.length === 0) {
            res.json({success: false, msg: 'user nahi mila'});
            return;
        }

        let user = users[0];

        // rewards fetch karo
        let rewardQ = 'SELECT * FROM rewards WHERE user_id = ? ORDER BY achieved_at DESC';

        db.query(rewardQ, [uid], function(err, rewards) {
            if(err) rewards = [];

            // history fetch karo
            let histQ = `SELECT r.*, t.name as topic_name,
                        ROUND((r.score/r.total_questions)*100) as percentage
                        FROM results r
                        JOIN topics t ON r.topic_id = t.id
                        WHERE r.user_id = ?
                        ORDER BY r.played_at DESC LIMIT 10`;

            db.query(histQ, [uid], function(err, history) {
                if(err) history = [];

                res.json({
                    success: true,
                    user: user,
                    rewards: rewards,
                    history: history
                });
            });
        });
    });
});

// user history
router.get('/history/:uid', (req, res) => {

    let uid = req.params.uid;

    let q = `SELECT r.*, t.name as topic_name,
            ROUND((r.score/r.total_questions)*100) as percentage
            FROM results r
            JOIN topics t ON r.topic_id = t.id
            WHERE r.user_id = ?
            ORDER BY r.played_at DESC`;

    db.query(q, [uid], function(err, data) {
        if(err) {
            res.json({success: false, msg: 'history nahi aayi'});
            return;
        }
        res.json({success: true, history: data});
    });
});

module.exports = router;
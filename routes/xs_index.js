/**
 * Created by ziyu.zzy on 14-3-30.
 */
//require here

var User = require('../models/user.js'),
    Topic = require('../models/topic.js');

module.exports = function(app){

    app.get(
        '/topic',
        function (req, res) {
            Topic.getAll(function (err, result) {
                if (err) {
                    req.flash('error', err);
                }
                res.render(
                    'topic',
                    {
                        'title': 'topic',
                        'result': result
                    }
                );
            });
        }
    );

    app.post(
        '/addTopic',
        function (req, res) {
            if (!req.session.user) {
                 res.redirect('/start');
            }
            var user = {};
            user.name = req.session.user.name;
            user.topicId = req.body.id;
            User.addTopic(
                user,
                function (err, result) {
                    if (err) {
                        req.flash('error', err);
                    }
                    res.send({"status": "ok"});
                }
            );
        }
    );

    app.post(
        '/newTopic', 
        function (req, res) {
            var topic = {};
            topic.title = req.body.title;
            topic.content = req.body.content;
            Topic.add(
                topic,
                function(err, result){
                    if (err) {
                        req.flash('error', err);
                    }
                    res.redirect("/topic");
                }
            );
        }
    );

    app.post(
        '/allTopic',
        function (req, res) {
            Topic.getAll(function (err, result) {
                if (err) {
                    req.flash('error', err);
                }
                res.send({result: result});
            });
        }
    );

    /**
     * 我的话题接口
     * 
     * @param  {string} user 当前用户名     
     * @return {Array} result [话题1, 话题2]这种数组
     * @return {Object} result[i] 话题i对象
     * @return {string} result[i].title 话题i标题
     * @return {string} result[i].content 话题i内容
     */
    app.get(
        '/getMyTopic',
        function (req, res) {
            if (!req.session.user) {
                 res.redirect('/start');
            }
            var user = req.session.user.name;
            Topic.getMyTopic(
                user, 
                function (err, result) {
                    if (err) {
                        req.flash('error', err);
                    }
                    res.send({result: result});
                }
            );
        }
    );

    /**
     * 获取话题下的问题接口
     * 
     * @param  {string} topicName 话题名字
     * @return {Array} questions 问题组成的数组
     * @return {Object} questions[i] 问题i
     * @return {string} questions[i].title 问题i的标题
     * 
     * questions[i]包含名为question的collection下的所有字段，不一一枚举
     */
    app.get(
        '/questionForTopic',
        function (req, res) {
            /**
             * 话题名字
             * @type {string}
             */
            var topicName = req.query.topicName;
            Topic.getQuestionForTopic(
                topicName,
                function (err, result) {
                    if (err) {
                        req.flash('error', err);
                    }
                    res.send({result: result});
                }
            );
        }
    );

    /**
     * 探索和发现接口，按照评论多少排序
     * 
     * @return {Array} questions 问题组成的数组
     */
    app.get(
        '/getHot',
        function (req, res) {
            Topic.getHot(function (err, result) {
                if (err) {
                    req.flash('error', err);
                }
                res.send({questions: result});
            });
        } 
    );

    app.post(
        '/search',
        function (req, res) {
            var keyword = new RegExp(req.body.keyword);
            User.search(
                keyword,
                function (err, result) {
                    if (err) {
                        req.flash('error', err);
                    }
                    res.render(
                        'search',
                        {
                            list: result,
                            title: "search"
                        }
                    );
                }
            );
        }
    );
}
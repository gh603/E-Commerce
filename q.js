q.all([messages.showmessages(req, config.mysql, q)]).then(function (results) {

        $arr['messages'] = results[0][0];
        if ($arr['messages'].length == 0) {
            res.writeHead(302, {
                'Location': '/admincp/messages'
            });
            res.end();
            return false;

        }
        if ($arr['messages'][0]['from_id'] != req.session.userid && $arr['messages'][0]['to_id'] != req.session.userid) 
        {
            res.writeHead(302, {
                'Location': '/admincp/messages'
            });
            res.end();
            return false;
        }
        // console.log($arr['pagination']);
        if ($arr['messages'].length > 0) {
            req.body.r_id = $arr['messages'][0]['r_id'];
            messages.readmessages(req, config.mysql, q);
        }
        common.tplFile('admincp/message-view.tpl');
        common.headerSet(1);
        common.loadTemplateHeader(req, res, $arr);
    });


exports.showmessages = function (req, mysql, q) {
    $mysqli = {where: 'and p.r_id = "' + req.body.r_id + '"'};
    strQuery = mysqli.mysqli($mysqli, 154);
    var escape_data = [req.session.userid, req.session.userid];
    var defered = q.defer();
    query = mysql.query(strQuery, escape_data, defered.makeNodeResolver());
    return defered.promise;
};

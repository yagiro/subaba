const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const path = require('path');

const os = require('./open-subtitles');

app.use((req, res, next) => {
    console.log(`received request: ${req.url}`);
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/subs', (req, res) => {
    const osQuery = createOsQuery(req.query);
    os.findSubs(osQuery)
        .then(subs => res.json(subs))
        .catch(err => {
            console.log('[OSAC:ERROR]',err);
            return res.json(err);
        });
});

function createOsQuery(data) {
    const {
        hash,
        lang,
        filename,
        filesize,
        query,
    } = data;
    /*
        ---------------------
            sublangageid
        ---------------------
        sublangageid is a 3 letters langcode (ISO 639-2 based).
        Full list: http://www.loc.gov/standards/iso639-2/php/code_list.php
    */
        const osQuery = {};
        if (lang) { osQuery.sublanguageid = lang; };
        if (hash) { osQuery.hash = hash; };
        if (filename) { osQuery.filename = filename; };
        if (filesize) { osQuery.filesize = filesize; };
        if (query) { osQuery.query = query; };
        return osQuery;
    }

exports.start = () => {
    app.listen(port, () =>
        console.log(`open-subtitles api listening on port ${port}...`))
};
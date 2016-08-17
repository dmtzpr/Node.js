const argv = require('minimist')(process.argv.slice(2)),
    request = require('request'),
    cheerio = require('cheerio'),
    readline = require('readline');

const SITE_URL = 'https://en.wikipedia.org/wiki/List_of_Volkswagen_Group_diesel_engines',
    ENGINE_CODE_SELECTOR = 'dl dd b';

function inputEngineCode() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Please input engine code: ', function (code) {
        if (code) {
            findEngineDescription(code);
        }
        rl.close();
        inputEngineCode();
    });
}

function findEngineDescription(code) {
    request(SITE_URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body),
                description = null;

            $(ENGINE_CODE_SELECTOR).each(function (index, item) {
                if ($(item).text().toLowerCase().indexOf(code.toLowerCase()) > -1) {
                    description = '\n' + $(item).parent().text() + '\n';

                    return false;
                }
            });
            console.log(description ? description : '\n Information about ' + code + ' is not found');
        }
    })
}
if (argv.code) {
    findEngineDescription(argv.code);
}
inputEngineCode();
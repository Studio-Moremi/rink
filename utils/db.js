const sqlite3 = require('better-sqlite3');
const path = require('path');
const _ = require('lodash');
const debug = require('debug')('app:db');

const dbPath = path.join(__dirname, '../data/warnings.db');
const db = sqlite3(dbPath);
debug(`데이터베이스 연결 성공: ${dbPath}`);

db.exec(`
    CREATE TABLE IF NOT EXISTS warnings (
        userId TEXT PRIMARY KEY,
        warningCount INTEGER DEFAULT 0
    )
`);
debug('경고 테이블 초기화 완료');

const getWarningQuery = db.prepare('SELECT warningCount FROM warnings WHERE userId = ?');
const insertOrUpdateWarningQuery = db.prepare(`
    INSERT INTO warnings (userId, warningCount)
    VALUES (@userId, @warningCount)
    ON CONFLICT(userId) DO UPDATE SET warningCount = warningCount + @warningCount
`);

function getWarnings(userId) {
    debug(`경고 조회 요청: userId=${userId}`);
    const result = getWarningQuery.get(userId);
    return _.get(result, 'warningCount', 0); // lodash로 기본값 처리
}

function updateWarnings(userId, count) {
    debug(`경고 업데이트 요청: userId=${userId}, count=${count}`);
    const data = { userId, warningCount: count };
    insertOrUpdateWarningQuery.run(data);
}

function resetWarnings() {
    debug('경고 테이블 초기화 요청');
    db.exec('DELETE FROM warnings');
}

module.exports = {
    getWarnings,
    updateWarnings,
    resetWarnings,
};

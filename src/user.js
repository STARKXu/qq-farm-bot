/**
 * 用户相关接口
 */

const { types } = require('./proto');
const { sendMsgAsync } = require('./network');
const { log } = require('./utils');

const CERT_TYPE_ALIAS = {
    china: 0,
    id: 0,
    cn: 0,
    passport: 414,
    overseas: 414,
    hk: 516,
    mo: 516,
    tw: 516,
    hkmotw: 516,
    foreign_permanent: 553,
    permanent: 553,
    other: 555,
};

function parseCertType(input) {
    if (input === undefined || input === null || input === '') return 0;

    const raw = String(input).trim().toLowerCase();
    if (raw in CERT_TYPE_ALIAS) return CERT_TYPE_ALIAS[raw];

    const num = Number(raw);
    if (Number.isFinite(num) && Number.isInteger(num) && num >= 0) return num;

    throw new Error(`无效证件类型: ${input}`);
}

async function deleteAccount(name, certId, certType) {
    const body = types.DeleteAccountRequest.encode(types.DeleteAccountRequest.create({
        name: name || '',
        cert_id: certId || '',
        cert_type: certType,
    })).finish();

    const { body: replyBody } = await sendMsgAsync('gamepb.userpb.UserService', 'DeleteAccount', body);
    const reply = types.DeleteAccountReply.decode(replyBody);
    const success = !!reply.success;
    const msg = reply.msg || '';
    log('注销', `${success ? '请求成功' : '请求失败'}${msg ? `: ${msg}` : ''}`);
    return reply;
}

module.exports = {
    parseCertType,
    deleteAccount,
};

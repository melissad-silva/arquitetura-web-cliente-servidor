const crypto = require('crypto');
const multer = require('multer');
const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3 } = require('../instances/s3');


const EXTENSOES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
};

const ehChaveS3 = (valor) => Boolean(valor) && !/^https?:\/\//.test(valor);
const bucket = process.env.AWS_S3_BUCKET;
const expiracaoLink = Number(process.env.AWS_S3_URL_EXPIRES_IN || 86400);

const enviarArquivo = async (buffer, mimetype, pasta) => {
    const chave = `${pasta}/${crypto.randomUUID()}${EXTENSOES[mimetype]}`;
    await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: chave,
        Body: buffer,
        ContentType: mimetype,
    }));
    return chave;
};

const gerarLink = async (chave) => {
    if (!ehChaveS3(chave)) return chave;
    return await getSignedUrl(s3, new GetObjectCommand({
        Bucket: bucket,
        Key: chave,
    }), { expiresIn: expiracaoLink });
};

const deletarArquivo = async (chave) => {
    if (!ehChaveS3(chave)) return;
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: chave }));
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if(EXTENSOES[file.mimetype]) return cb(null, true);
        cb(new Error('TIPO_INVALIDO'));
    },
});

module.exports = { enviarArquivo, gerarLink, deletarArquivo, upload };


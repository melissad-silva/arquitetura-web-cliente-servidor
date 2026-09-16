const bcrypt = require('bcrypt');

/*async function comparePassBcrypty(pass, hash) {
    const match = await bcrypt.compare(pass, hash);
    return match;
}*/

async function main() {
    const hash = await bcrypt.hash("123", 1);
    const result = await comparePassBcrypty("123", hash);

    console.log(result);
}

main();
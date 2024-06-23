const oracle = require('oracledb');
const fs = require('fs');

const manipulateState = async () => {

const data = fs.readFileSync('../sql/states.data', 'utf8');
const lines = data.split('\n');
let line;
let i = 0;
let connection = null;
while(i < lines.length) {
line = lines[i];
const alpha_code = line.substring(line.length - 3).trim();
const code = line.substring(line.length - 6, line.length - 3).trim();
const name = line.substring(0, line.length - 6).trim();
console.log(code, alpha_code, name);

connection = await oracle.getConnection({
"user": "hr",
"password": "hr",
"connectionString": "localhost:1521/xepdb1"
});

await connection.execute(`insert into ac_state (code, alpha_code, name)  values (${parseInt(code)}, '${alpha_code}', '${name}')`);
await connection.commit();
i++;
}

await connection.close();

}

manipulateState();
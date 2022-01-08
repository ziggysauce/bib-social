/* eslint-disable no-await-in-loop */
const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const util = require('util');

dotenv.config();

const poolConfigs = { connectionString: process.env.DATABASE_URL };

if (process.env.NODE_ENV === 'production') {
  poolConfigs.ssl = { 
    rejectUnauthorized: false,
    sslmode: 'require'
  };
}

const pool = new Pool(poolConfigs);

// TODO: May want to only use this when there is an issue setting up the DB
// pool.on('remove', () => {
//   console.log('Client removed');
//   process.exit(0);
// });

/**
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 */
const query = async (text, params) => new Promise((resolve, reject) => {
    pool.query(text, params)
      .then((res) => { resolve(res); })
      .catch((err) => { reject(err); });
  });

/**
 * @description Run a SQL query given a filepath
 * @param {string} path
 * @param {object} [params]
 */
async function execute(path, params = {}) {
  const queryVariables = [];
  const queryParam = (qv) => {
    const variable = qv.slice(2, -1);
    const i = queryVariables.indexOf(variable);
    if(i >= 0) {
      return `$${i + 1}`;
    }
    queryVariables.push(variable);
    return `$${queryVariables.length}`;
  };
  let sql = fs.readFileSync(path).toString();
  sql = sql.replace(/\$\{[^{}]+\}/g, queryParam);
  const values = queryVariables ? queryVariables.map(p => params[p]) : [];
  return query(sql, values);
};

/**
 * @description Read all files in current directory, filter out files
 * that don't contain SQL and previously ran migrations.
 * Read content of those files.
 * @param {array} migrations 
 */
const getOutStandingMigrations = async (migrations = []) => {
  const files = await util.promisify(fs.readdir)('server/sql/migrations');
  const sql = await Promise.all(
    files
      .filter((file) => file.split('.')[1] === 'sql' && (!migrations.includes(file)))
      .map(async (file) => ({
        file,
        query: await util.promisify(fs.readFile)(`server/sql/migrations/${file}`, {
          encoding: 'utf-8',
        }),
      }))
  );
  return sql;
};

/**
 * @description Select all migrations, filter out executed migrations, and executes leftover migrations.
 * Runs a transaction, which will run all leftover migrations, or fail completely.
 */
const migrate = async () => {
  let existingMigrations = [];
  try {
    const result = await execute('server/sql/migration_queries/get_all.sql');
    existingMigrations = result.rows.map((r) => `${r.id}.sql`);
  } catch (err) {
    console.log('RUNNING FIRST MIGRATION', err);
  }

  // Get outstanding migrations
  const outstandingMigrations = await getOutStandingMigrations(existingMigrations);

  await pool.connect(async (error, client, release) => {
    if (error) {
      return console.log('Error connected to db: ', error);
    };

    try {
      // Start transaction
      console.log('STARTING MIGRATIONS');
      // eslint-disable-next-line no-restricted-syntax
      for (const migration of outstandingMigrations) {
        const [id] = migration.file.split('.sql');
        await execute(`server/sql/migrations/${migration.file}`);
        await execute('server/sql/migration_queries/put.sql', {id});
        console.log(`COMPLETED MIGRATION ${migration.file}`);
      }
    } catch (err) {
      console.log('Error occurred while migration process was running: ', err);
      console.log('ERROR OCCURRED: ROLLING BACK MIGRATIONS');
    } finally {
      release((err) => {
        if (err) {
          console.log('Error occurred during migration release: ', err.stack);
        }
      });
      const [lastMigration] = existingMigrations.pop().split('.sql');
      console.log(`MIGRATIONS COMPLETED [LATEST VERSION: ${lastMigration}]`);
    }
  });
};

module.exports = {
  query,
  execute,
  migrate
};
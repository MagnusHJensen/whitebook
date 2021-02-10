class User {
    constructor({id=null, discord_id, mc_uuid, kicks=null, tempbans=null, bans=null}) {
        this.id = id;
        this.discord_id = discord_id;
        this.mc_uuid = mc_uuid;
        this.kicks = kicks;
        this.tempbans = tempbans;
        this.bans = bans;
    }

    static async get_user_profile_From_id(id) {
        const query = `SELECT u.id, u.discord_id, u.mc_uuid, u.kicks, u.tempbans, u.bans FROM users AS u INNER JOIN discord_alias AS da ON u.id = da.user_id INNER JOIN mc_alias AS ma ON u.id = ma.id WHERE u.id = ${id}`;
        const result = await new Promise((resolve, reject) => {
            database.query(query, (err, results) => {
                if (err) return reject(err);
                return resolve(results[0]);
            });
        }).catch(() => {
            return null;
        });
        if (!result) throw 'no user';

        return new User(result);
    }

    static async get_user_profile_from_discord_id(id) {
        const query = `SELECT u.id, u.discord_id, u.mc_uuid, u.kicks, u.tempbans, u.bans FROM users AS u INNER JOIN discord_alias AS da ON u.id = da.user_id INNER JOIN mc_alias AS ma ON u.id = ma.id WHERE u.discord_id = ${id};`;
        const result = await new Promise((resolve, reject) => {
            database.query(query, (err, results) => {
                if (err) return reject(err);
                return resolve(results[0]);
            });
        }).catch(() => {
            return null;
        });
        if (!result) throw 'no user';
        console.log(result)


        return new User(result);
    }

    async create() {
        const query = `INSERT INTO users (discord_id, mc_uuid) VALUES ('${this.discord_id}', '${this.mc_uuid}');`;

        return await new Promise((resolve, reject) => {
            database.query(query, (err, results) => {
                if (err) return reject(err);
                return resolve();
            });
        });
    }

    static async ban({user_id, unban_time, guild_id}) {
        const query = `INSERT INTO banned_users (user_id, time_banned, unban_time, guild_id) VALUES (${user_id}, '${new Date().getTime()}', '${unban_time}', '${guild_id}');`;
        return await new Promise((resolve, reject) => {
            database.query(query, (err, results) => {
                if (err) return reject(err);
                return resolve();
            });
        });
    }

    static async get_all_banned_users() {
        const query = `SELECT b.id, b.user_id, b.time_banned, b.unban_time, b.guild_id FROM banned_users b;`;
        const results = await new Promise((resolve, reject) => {
            database.query(query, (err, results) => {
                if (err) return reject(err);

                return resolve(results);
            });
        });
        const banned_users = {};
        results.forEach((res) => {
            banned_users[res.id] = res;
        });

        return banned_users;
    }

    static async remove_ban(id) {
        const query = `DELETE FROM banned_users WHERE id = ${id};`;
        return await new Promise((resolve, reject) => {
            database.query(query, (err, results) => {
                if (err) return reject(err);
                return resolve();
            });
        });
    }
}

module.exports = User;


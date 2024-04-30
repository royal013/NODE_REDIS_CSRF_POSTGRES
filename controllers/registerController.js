const database = require('../database');
const redis = require('redis');
const REDIS_PORT = 6379;
const client = redis.createClient(REDIS_PORT);

const register = async (req, res) => {
    try {
        console.log('crsf token in server: ', req.csrfToken());
        console.log('crsf token from frontend: ', req.headers['x-csrf-token']);

        let { first_name, last_name, phone_number, age, state, coupon } = req.body;

        //REDIS VALIDATION STARTS
        const phoneKey = `phone:${phone_number}`;
        await client.connect();
        let count = await client.get(phoneKey);
        if (!count) {
            count = 1;
            await client.set(phoneKey, count);
        } else {
            count = parseInt(count) + 1;
            await client.set(phoneKey, count);
        }
        if (count > 3) {
            req.session.csrfToken = '';
            await client.disconnect();
            return res.status(403).json({ message: 'Maximum hits from this number exceeded' });
        }
        await client.disconnect();
        //REDIS VALIDATION ENDS




        //DATABASE VALIDATION STARTS
        let phoneCount = await executeQuery('SELECT * FROM register_user WHERE phone_number=$1', [phone_number])

        if (phoneCount.rows.length > 3) {
            return res.status(403).json({ message: "Maximum Registration From This Device Done" });
        }
        //DATABASER VALIDATION ENDS


        //CSRF VALIDATION STARTS
        const sessionCsrfToken = req.session.csrfToken;
        if (!sessionCsrfToken || sessionCsrfToken !== req.headers['x-csrf-token']) {
            req.session.csrfToken = '';
            return res.status(403).json({ message: 'Invalid CSRF token' });
        }
        //CSRF VALIDATION ENDS


        if (!req.body || !first_name || !last_name || !phone_number || !age || !state) {
            req.session.csrfToken = '';
            return res.status(404).json({ message: "All Fields are required" });
        }
        if (phone_number.length != 10) {
            req.session.csrfToken = '';
            return res.status(404).json({ message: "Invalid phone number" })
        }
        if (age < 18) {
            req.session.csrfToken = '';
            return res.status(404).json({ message: "UnderAged Not Allowed" });
        }
        let phoneCheck = await executeQuery('SELECT phone_number FROM register_user WHERE phone_number=$1', [phone_number]);
        if (phoneCheck.rows.length > 0) {
            req.session.csrfToken = '';
            return res.status(404).json({ message: "Phone Number Already Used" });
        }
        let stateCheck = await executeQuery(`SELECT isactive FROM state_detail WHERE state=$1`, [state]);
        if (!stateCheck.rows[0].isactive) {
            req.session.csrfToken = '';
            return res.status(500).json({ message: "State Inactive" });
        }
        let couponState = coupon.substr(0, 2);
        if (couponState != state) {
            req.session.csrfToken = '';
            return res.status(500).json({ message: 'Invalid Coupon for the state' });
        }
        let couponCheck = await executeQuery(`SELECT coupon FROM coupons WHERE coupon=$1`, [coupon]);
        if (couponCheck === null || couponCheck.rows.length === 0) {
            req.session.csrfToken = '';
            return res.status(500).json({ message: "Invalid Coupon" });
        }
        let couponUsed = await executeQuery('SELECT is_used FROM coupons WHERE coupon=$1', [coupon]);
        if (couponUsed.rows[0].is_used !== 0) {
            req.session.csrfToken = '';
            return res.json({ message: "Coupon Already Used" });
        }
        let couponType = await executeQuery(`SELECT type FROM coupons  WHERE coupon=$1`, [coupon]);
        let type = couponType.rows[0].type;
        let val;
        if (type === 'Quart') {
            let couponVal = await executeQuery('SELECT quart FROM state_detail WHERE state=$1', [state]);
            val = couponVal.rows[0].quart;
        }
        else if (type === 'Pint') {
            let couponVal = await executeQuery('SELECT pint FROM state_detail WHERE state=$1', [state]);
            val = couponVal.rows[0].pint;
        }
        else if (type === 'Nip') {
            let couponVal = await executeQuery('SELECT nip FROM state_detail WHERE state=$1', [state]);
            val = couponVal.rows[0].nip;
        }
        const currentTimeStamp = new Date().toISOString();
        console.log('Coupon Val is: ', val);
        let userRegister = await executeQuery(`INSERT INTO register_user(first_name,last_name,phone_number,age,state,created_at) VALUES($1,$2,$3,$4,$5,$6) RETURNING id;`, [first_name, last_name, phone_number, age, state, currentTimeStamp]);
        let userId = userRegister.rows[0].id;
        let updateCoupon = await executeQuery(`Update coupons SET user_id=$1, is_used=$2,used_at=$3 WHERE coupon=$4`, [userId, 1, currentTimeStamp, coupon]);
        let giftcardQuery = await executeQuery(`SELECT * FROM gift_card where amount=$1 and is_used=$2 AND state=$3 order by RANDOM() LIMIT(1);`, [val, 0, state]);
        if (giftcardQuery.rows.length === 0) {
            req.session.csrfToken = '';
            return res.status(404).json({ message: "Gift Card Exhausted" });
        }
        console.log(giftcardQuery.rows[0]);
        let giftcardVal = giftcardQuery.rows[0];

        await executeQuery('Update gift_card set is_used=1,user_id=$1,redemeed_at=$2 where id=$3', [userId, currentTimeStamp, giftcardVal.id]);
        req.session.csrfToken = '';
        return res.status(200).json({ message: 'Succesfully Registered', giftcardVal });
    } catch (error) {
        console.log(error);
        req.session.csrfToken = '';
        return res.status(500).json({ message: "Internal Server Error", error });
    }

}

function executeQuery(sql, values) {
    return new Promise((resolve, reject) => {
        database.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                // console.log(results.rows[0].isactive);
                resolve(results);
            }
        });
    });
}


module.exports = {
    register
}
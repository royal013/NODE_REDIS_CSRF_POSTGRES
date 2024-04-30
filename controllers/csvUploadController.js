const database = require('../database');
const uploadCoupon = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(500).json({ error: 'No file Selected.' });
        }
        const fileName = req.file.originalname;
        const fileExtension = fileName.split('.').pop();
        if (fileExtension !== 'csv') {
            return res.status(500).json({ error: "Incorrect file format" });
        }
        else {
            const fileBuffer = req.file.buffer.toString('utf-8');
            const rows = fileBuffer.split(/\r?\n/);
            let data = [];
            rows.forEach((row) => {
                if (row.trim() !== '') {
                    data.push(row.split(','));
                }
            });
            const headers = data.shift();
            const trimmedHeaders = trimArrayElements(headers);

            if (trimmedHeaders[0] !== 'coupon' || trimmedHeaders[1] !== 'type') {
                return res.status(500).json({ error: "Incorrect Format" });
            }
            else {

                for (const row of data) {
                    try {
                        row[0] = row[0].trim();
                        row[1] = row[1].trim();
                        if (row[0] === '' && row[1] === '') {
                            continue;
                        }
                        let insertQuery = `
                        INSERT INTO coupons(coupon,type)
                        VALUES($1,$2)
                        `;
                        await new Promise((resolve, reject) => {
                            database.query(insertQuery, [row[0], row[1]], (err, result) => {
                                if (err) {
                                    reject(err);
                                }
                                resolve();
                            })
                        })
                    } catch (error) {
                        resolve(error);
                    }
                }
                // console.log(data);
                // res.send(data);
            }

            return res.status(200).json({ message: "Success" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}
const uploadGiftCard = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(500).json({ error: 'No file Selected.' });
        }
        const fileName = req.file.originalname;
        const fileExtension = fileName.split('.').pop();
        if (fileExtension !== 'csv') {
            return res.status(500).json({ error: "Incorrect file format" });
        }
        else {
            const fileBuffer = req.file.buffer.toString('utf-8');
            const rows = fileBuffer.split(/\r?\n/);
            let data = [];
            rows.forEach((row) => {
                if (row.trim() !== '') {
                    data.push(row.split(','));
                }
            });
            const headers = data.shift();
            const trimmedHeaders = trimArrayElements(headers);

            if (trimmedHeaders[0] !== 'product_name' || trimmedHeaders[1] !== 'amount' || trimmedHeaders[2] !== 'Gift_card_number' || trimmedHeaders[3] !== 'validity' || trimmedHeaders[4] !== 'card_pin' || trimmedHeaders[5] !== 'terms_condition' || trimmedHeaders[6] !== 'currency_code' || trimmedHeaders[7] !== 'is_used' || trimmedHeaders[8] !== 'State') {
                return res.status(500).json({ error: "Incorrect Format" });
            }
            else {

                for (const row of data) {
                    try {
                        row[0] = row[0].trim();
                        row[1] = row[1].trim();
                        row[2] = parseFloat(row[2]).toString();
                        row[3] = row[3].trim();
                        row[4] = row[4].trim();
                        row[5] = row[5].trim();
                        row[6] = row[6].trim();
                        row[7] = row[7].trim();
                        row[8] = row[8].trim();
                        if (row[0] === '' && row[1] === '' && row[2] === '' && row[3] === '' && row[4] === '' && row[5] === '' && row[6] === '' && row[7] === '' && row[8] === '') {
                            continue;
                        }
                        const dateParts = row[3].split('/');
                        const postgresqlDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
                        let insertQuery = `
                        INSERT INTO gift_card(product_name,amount,Gift_card_number,validity,card_pin,terms_condition,currency_code,is_used,State)
                        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
                        `;
                        console.log(row[2]);
                        await new Promise((resolve, reject) => {
                            database.query(insertQuery, [row[0], row[1], row[2], postgresqlDate, row[4], row[5], row[6], row[7], row[8]], (err, result) => {
                                if (err) {
                                    reject(err);
                                }
                                resolve();
                            })
                        })
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({ mesage: "Internal Server error", error });
                    }
                }
                // console.log(data);
                // res.send(data);
            }

            return res.status(200).json({ message: "Success" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}
const uploadBatchCode = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(500).json({ error: 'No file Selected.' });
        }
        const fileName = req.file.originalname;
        const fileExtension = fileName.split('.').pop();
        if (fileExtension !== 'csv') {
            return res.status(500).json({ error: "Incorrect file format" });
        }
        else {
            const fileBuffer = req.file.buffer.toString('utf-8');
            const rows = fileBuffer.split(/\r?\n/);
            let data = [];
            rows.forEach((row) => {
                if (row.trim() !== '') {
                    data.push(row.split(','));
                }
            });
            const headers = data.shift();
            const trimmedHeaders = trimArrayElements(headers);

            if (trimmedHeaders[0] !== 'batch_code' || trimmedHeaders[1] !== 'state') {
                return res.status(500).json({ error: "Incorrect Format" });
            }
            else {

                for (const row of data) {
                    try {
                        row[0] = row[0].trim();
                        row[1] = row[1].trim();

                        if (row[0] === '' && row[1] === '') {
                            continue;
                        }

                        let insertQuery = `
                        INSERT INTO batchcode(batch_code,state)
                        VALUES($1,$2)
                        `;
                        await new Promise((resolve, reject) => {
                            database.query(insertQuery, [row[0], row[1]], (err, result) => {
                                if (err) {
                                    reject(err);
                                }
                                resolve();
                            })
                        })
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({ mesage: "Internal Server error", error });
                    }
                }
                // console.log(data);
                // res.send(data);
            }

            return res.status(200).json({ message: "Success" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}
module.exports = {
    uploadCoupon,
    uploadGiftCard,
    uploadBatchCode
}

function trimArrayElements(arr) {

    const trimmedArray = arr.map(element => {
        if (typeof element !== 'string') {
            throw new Error('Array contains non-string elements');
        }

        return element.trim();
    });

    return trimmedArray;
}
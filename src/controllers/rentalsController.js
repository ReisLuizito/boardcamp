import { db } from "../database/database.js";
import { rentalSchema } from "../schemas/rentalSchema.js";
import dayjs from "dayjs";

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const validation = rentalSchema.validate({ customerId, gameId, daysRented });
    if (validation.error) {
        return res.status(400).send(validation.error.details.map(d => d.message));
    }

    try {
        const customerResult = await db.query("SELECT id FROM customers WHERE id = $1", [customerId]);
        if (customerResult.rowCount === 0) {
            return res.sendStatus(404); // Customer not found
        }

        const gameResult = await db.query(`SELECT "stockTotal", "pricePerDay" FROM games WHERE id = $1`, [gameId]);
        if (gameResult.rowCount === 0) {
            return res.sendStatus(404); // Game not found
        }
        const { stockTotal, pricePerDay } = gameResult.rows[0];

        const openRentalsResult = await db.query(`SELECT COUNT(*) FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL`, [gameId]);
        const openRentals = parseInt(openRentalsResult.rows[0].count);
        
        if (openRentals >= stockTotal) {
            return res.sendStatus(422); // Unprocessable Entity - No games available
        }
        
        const rentDate = dayjs().format("YYYY-MM-DD");
        const originalPrice = daysRented * pricePerDay;

        await db.query(
            `INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") 
             VALUES ($1, $2, $3, $4, $5, NULL, NULL)`,
            [customerId, gameId, daysRented, rentDate, originalPrice]
        );

        res.sendStatus(201); // Created
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getRentals(req, res) {
    try {
        const query = `
            SELECT 
                r.*,
                c.id AS "customerId", c.name AS "customerName",
                g.id AS "gameId", g.name AS "gameName"
            FROM rentals r
            JOIN customers c ON r."customerId" = c.id
            JOIN games g ON r."gameId" = g.id
        `;
        const result = await db.query(query);

        const rentals = result.rows.map(row => ({
            id: row.id,
            customerId: row.customerId,
            gameId: row.gameId,
            rentDate: dayjs(row.rentDate).format("YYYY-MM-DD"),
            daysRented: row.daysRented,
            returnDate: row.returnDate ? dayjs(row.returnDate).format("YYYY-MM-DD") : null,
            originalPrice: row.originalPrice,
            delayFee: row.delayFee,
            customer: {
                id: row.customerId,
                name: row.customerName
            },
            game: {
                id: row.gameId,
                name: row.gameName
            }
        }));

        res.send(rentals);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function returnRental(req, res) {
    const { id } = req.params;

    try {
        const rentalResult = await db.query(
            `SELECT r.*, g."pricePerDay"
             FROM rentals r
             JOIN games g ON r."gameId" = g.id
             WHERE r.id = $1`,
            [id]
        );

        if (rentalResult.rowCount === 0) {
            return res.sendStatus(404); // Not Found
        }

        const rental = rentalResult.rows[0];

        if (rental.returnDate) {
            return res.sendStatus(422); // Unprocessable Entity - Rental already finished
        }

        const rentDate = dayjs(rental.rentDate);
        const returnDate = dayjs();
        const daysDiff = returnDate.diff(rentDate, 'day');
        
        let delayFee = 0;
        if (daysDiff > rental.daysRented) {
            const delayDays = daysDiff - rental.daysRented;
            delayFee = delayDays * rental.pricePerDay;
        }

        await db.query(
            `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
            [returnDate.format("YYYY-MM-DD"), delayFee, id]
        );

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        const rentalResult = await db.query("SELECT * FROM rentals WHERE id = $1", [id]);

        if (rentalResult.rowCount === 0) {
            return res.sendStatus(404); // Not Found
        }

        const rental = rentalResult.rows[0];

        if (!rental.returnDate) {
            return res.sendStatus(400); // Bad Request - Rental not finished
        }

        await db.query("DELETE FROM rentals WHERE id = $1", [id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
} 
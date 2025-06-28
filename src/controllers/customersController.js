import { db } from "../database/database.js";
import { customerSchema } from "../schemas/customerSchema.js";

export async function createCustomer(req, res) {
    const { name, phone, cpf } = req.body;

    const validation = customerSchema.validate({ name, phone, cpf });
    if (validation.error) {
        return res.status(400).send(validation.error.details.map(d => d.message));
    }

    try {
        const existingCustomer = await db.query("SELECT * FROM customers WHERE cpf = $1", [cpf]);
        if (existingCustomer.rowCount > 0) {
            return res.sendStatus(409); // Conflict
        }

        await db.query(
            `INSERT INTO customers (name, phone, cpf) VALUES ($1, $2, $3)`,
            [name, phone, cpf]
        );

        res.sendStatus(201); // Created
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomers(req, res) {
    try {
        const customers = await db.query("SELECT * FROM customers");
        res.send(customers.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;

    try {
        const customer = await db.query("SELECT * FROM customers WHERE id = $1", [id]);

        if (customer.rowCount === 0) {
            return res.sendStatus(404); // Not Found
        }

        res.send(customer.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
} 
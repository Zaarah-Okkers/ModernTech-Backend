import pool from '../config/database.js';

export const getEmployees = async (req, res) => {
  try {
    const [employees] = await pool.query(`
      SELECT 
        e.employees_id,
        e.first_name,
        e.last_name,
        e.position,
        d.department_name,
        e.salary,
        e.employment_history,
        e.contact
      FROM employees e
      LEFT JOIN departments d 
        ON e.department_id = d.department_id
      ORDER BY e.employees_id
    `);

    res.json(employees);

  } catch (error) {
    console.error('Employees API error:', error);
    res.status(500).json({
      error: 'Failed to fetch employees',
      details: error.message
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      position,
      department_id,
      salary,
      employment_history,
      contact
    } = req.body;

    // Validation
    if (!first_name || !last_name || !position || !department_id || !contact) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO employees 
        (first_name, last_name, position, department_id, salary, employment_history, contact) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        position,
        department_id,
        salary || 0,
        employment_history || '',
        contact
      ]
    );

    res.status(201).json({
      id: result.insertId,
      first_name,
      last_name,
      position,
      department_id,
      salary,
      employment_history,
      contact
    });

  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({
      error: 'Failed to create employee'
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM employees WHERE employees_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Employee not found'
      });
    }

    res.json({
      message: 'Employee deleted successfully'
    });

  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      error: 'Failed to delete employee'
    });
  }
};
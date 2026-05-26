import db from '../../config/db.js';

// ==========================================
// 1. CREATE (Insert Profile with Relations)
// ==========================================
export const createProfile = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { biodata, education, courses, employment } = req.body;

    // Sanitize biodata: remove relation arrays that are not columns in the biodata table
    const bioToInsert = { ...biodata };
    delete bioToInsert.education;
    delete bioToInsert.courses;
    delete bioToInsert.employment;

    // Insert into biodata
    const [bioResult] = await connection.query(
      `INSERT INTO biodata SET ?`, 
      [bioToInsert]
    );
    const biodataId = bioResult.insertId;

    // Insert into education_history
    if (education && education.length > 0) {
      const eduData = education.map(edu => [biodataId, edu.last_education, edu.institution, edu.major, edu.graduation_year, edu.ipk]);
      await connection.query(
        `INSERT INTO education_history (biodata_id, last_education, institution, major, graduation_year, ipk) VALUES ?`,
        [eduData]
      );
    }

    // Insert into course_history
    if (courses && courses.length > 0) {
      const courseData = courses.map(c => [biodataId, c.course_name, c.is_sertificated, c.year]);
      await connection.query(
        `INSERT INTO course_history (biodata_id, course_name, is_sertificated, year) VALUES ?`,
        [courseData]
      );
    }

    // Insert into employment_history
    if (employment && employment.length > 0) {
      const empData = employment.map(emp => [biodataId, emp.company_name, emp.last_position, emp.last_salary, emp.year]);
      await connection.query(
        `INSERT INTO employment_history (biodata_id, company_name, last_position, last_salary, year) VALUES ?`,
        [empData]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Profile created successfully!", biodataId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ==========================================
// 2. READ (Get All Profiles or Single Profile)
// ==========================================
export const getAllProfiles = async (req, res) => {
  try {
    // Check if the authenticated user has admin role (assuming role 0 is admin)
    if (!req.user || req.user.role !== 0) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const [rows] = await db.query(`SELECT id, name, position, dob, pob FROM biodata`);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const userEmail = req.user.email; // From JWT middleware

    const [rows] = await db.query(`SELECT * FROM biodata WHERE email = ?`, [userEmail]);
    if (rows.length === 0) return res.status(404).json({ message: "Profile not found" });

    const biodata = rows[0];
    const bioId = biodata.id;

    const [education] = await db.query(`SELECT * FROM education_history WHERE biodata_id = ?`, [bioId]);
    const [courses] = await db.query(`SELECT * FROM course_history WHERE biodata_id = ?`, [bioId]);
    const [employment] = await db.query(`SELECT * FROM employment_history WHERE biodata_id = ?`, [bioId]);

    console.log(education);

    res.status(200).json({ biodata, education, courses, employment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const bioId = req.params.id;

    const [[biodata]] = await db.query(`SELECT * FROM biodata WHERE id = ?`, [bioId]);
    if (!biodata) return res.status(404).json({ message: "Profile not found" });

    const [education] = await db.query(`SELECT * FROM education_history WHERE biodata_id = ?`, [bioId]);
    const [courses] = await db.query(`SELECT * FROM course_history WHERE biodata_id = ?`, [bioId]);
    const [employment] = await db.query(`SELECT * FROM employment_history WHERE biodata_id = ?`, [bioId]);

    res.status(200).json({ biodata, education, courses, employment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 3. UPDATE (Modify Profile & Child Records)
// ==========================================
export const updateProfile = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const bioId = req.params.id;
    const { biodata, education, courses, employment } = req.body;

    // Update main biodata
    if (biodata) {
      // Sanitize biodata: remove relation arrays that are not columns in the biodata table
      const bioToUpdate = { ...biodata };
      delete bioToUpdate.education;
      delete bioToUpdate.courses;
      delete bioToUpdate.employment;
      delete bioToUpdate.id; // Ensure the ID is not part of the SET clause

      await connection.query(`UPDATE biodata SET ? WHERE id = ?`, [bioToUpdate, bioId]);
    }

    // Wipe and re-insert child table records for simplicity
    if (education) {
      await connection.query(`DELETE FROM education_history WHERE biodata_id = ?`, [bioId]);
      if (education.length > 0) {
        const eduData = education.map(edu => [bioId, edu.last_education, edu.institution, edu.major, edu.graduation_year, edu.ipk]);
        await connection.query(`INSERT INTO education_history (biodata_id, last_education, institution, major, graduation_year, ipk) VALUES ?`, [eduData]);
      }
    }

    if (courses) {
      await connection.query(`DELETE FROM course_history WHERE biodata_id = ?`, [bioId]);
      if (courses.length > 0) {
        const courseData = courses.map(c => [bioId, c.course_name, c.is_sertificated, c.year]);
        await connection.query(`INSERT INTO course_history (biodata_id, course_name, is_sertificated, year) VALUES ?`, [courseData]);
      }
    }

    if (employment) {
      await connection.query(`DELETE FROM employment_history WHERE biodata_id = ?`, [bioId]);
      if (employment.length > 0) {
        const empData = employment.map(emp => [bioId, emp.company_name, emp.last_position, emp.last_salary, emp.year]);
        await connection.query(`INSERT INTO employment_history (biodata_id, company_name, last_position, last_salary, year) VALUES ?`, [empData]);
      }
    }

    await connection.commit();
    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ==========================================
// 4. DELETE (Cascade Delete Profile)
// ==========================================
export const deleteProfile = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const bioId = req.params.id;

    // Delete child records
    await connection.query(`DELETE FROM education_history WHERE biodata_id = ?`, [bioId]);
    await connection.query(`DELETE FROM course_history WHERE biodata_id = ?`, [bioId]);
    await connection.query(`DELETE FROM employment_history WHERE biodata_id = ?`, [bioId]);
    
    // Delete parent record
    const [result] = await connection.query(`DELETE FROM biodata WHERE id = ?`, [bioId]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Profile not found" });
    }

    await connection.commit();
    res.status(200).json({ message: "Profile deleted successfully!" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};